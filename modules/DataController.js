/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

"use strict"; 

var interpolationSetting = true;
var NO_DATA_VALUE = -30000; // value, jota pienemmat tai samat arvot ovat puuttuvia aukkoja datassa

/**
 * Asetetut korkeudet oliolle kaksiulotteisessa taulukossa!
 * Ottaa parametrina file olioit taulukossa, laskee korkeudet olioille niiden rajaamalta alueilta kaksiulotteiseen
 * taulukkoon. Samalla etsii rajatun alueen pienimman ja korkeimman kohdan ja asettaa sen olioille
 */
function setFileObjects(file_objs, option, callbackFunc) {
	var readedCount = 0; // osoittaa kuinka moni file_objekti on kasitelty
	
	for (var i = 0; i < file_objs.length; i++) {
		var img = new Image(1,1); // luodaan uusi img per file olio
		const f = file_objs[i]; // otetaan indeksissa oleva file olio
		// Tapahtuma, kun kuva on ladattu:
		img.onload = function() {
			readedCount++; // kasvatetaan kasiteltyjen olioiden maaraa	
			var canvas = document.createElement('canvas'); // luodaan canvas, jota kaytetaan pixeleiden lukemiseen
			canvas.width = this.naturalWidth; // asetetaan kuvan koot kanvasille
			canvas.height = this.naturalHeight;
			var ctx = canvas.getContext('2d'); // piirtaa kuvan
			ctx.drawImage(this, 0, 0);
			
			// 1 korkeuksien asetus file oliolle, file olion rajaamalle alueelle, samalla etsitaan myos rajatun alueen pienin ja suurin korkeus:		
			
			// 1.1 pakko hakea maxRGB arvo koko kuvan alueelta, koska ei ole aina 255, esim N00E006 se on 253
			var data_whole_img = ctx.getImageData(0, 0, 1201 , 1201).data;
			var maxRGB = -100000;
			for (var i = 0; i < data_whole_img.length; i+=4) {
				if (data_whole_img[i] > maxRGB) maxRGB = data_whole_img[i]
			}
			
			// 1.2 olion rajaama alue
			var topLeftPixel = f.getTopLeft()
			var bottomRightPixel = f.getBottomRight();
			var pixelsX = bottomRightPixel[0] - topLeftPixel[0] + 1;
			var pixelsY = bottomRightPixel[1] - topLeftPixel[1] + 1;
			
			// 1.3 lasketaan korkeudet yksiulotteiseen taulukkoon, file olion rajaamalta alueelta ja samalla katsotaan kyseisen alueen matalin ja korkein kohta
			var minMaxH = window[f.getFileName()]; // haetaan data.js:sta asetettu min max korkeus kyseiselle filelle (eli koko kuvan alueen pienin ja suurin korkeus)
			var data = ctx.getImageData(topLeftPixel[0], topLeftPixel[1], pixelsX , pixelsY).data; // otetaan kuvan data file olion osoittamalta alueelta

			var heights = new Array(pixelsX); // alustetaan x suuntaan oleva taulukko, johon luodaan y suunnassa olevat taulukot
			var file_minH = 1000000; // minH ja maxH osoittavat matalinta ja korkeinta kohtaa
			var file_maxH = -1000000;
			
			for (var x = 0; x < pixelsX; x++) {
				var h_tmp = new Array(pixelsY); // luodaan taulukko, joka vastaa yhta pystyrivia valitulta alueelta
				for (var y = 0; y < pixelsY; y++) {
					var pixelIndex = (x + (y * pixelsX)) * 4; // lasketaan pikselin indeksi, kuvan datasta
					h_tmp[y] = data[pixelIndex] / maxRGB * (minMaxH[1] - minMaxH[0]) + minMaxH[0]; // lasketaan korkeus
					if (h_tmp[y] < file_minH) file_minH = h_tmp[y]; // katsotaan loytyyko uusi minH tai maxH arvoa
				    if (h_tmp[y] > file_maxH) file_maxH = h_tmp[y];	
				}
				heights[x] = h_tmp; // asetetaan luotu pystyrivi heights taulukkoon
			}
			
			f.setHeights(heights); // asetetaan korkeudet oliolle
			f.setMinMax(file_minH, file_maxH); // asetetaan min ja max korkeus heights alueelta oliolle
			
			//document.body.appendChild(canvas); // jos canvaksen haluaa dumpata bodyyn
			
			// jos kaikki file_oliot on maaritelty
			if (readedCount == file_objs.length) {
				callbackFunc(option, file_objs); // kutsutaan all_File_Objects_Set funktiota --> ohjelma jatkaa eteenpain siita
			}
		};
		// Tapahtuma, jos kuvaa ei voitu ladata:
		img.onerror= function() {
			readedCount++; // kasvatetaan kasiteltyjen olioiden maaraa
			
			// 1 asetetaan min max korkeuksien arvo
			f.setMinMax(0,0); // asetetaan min maxiin 0:llat
			
			// 2 korkeuksien asetus file oliolle, file olion rajaamalle alueelle:
			var topLeftPixel = f.getTopLeft()
			var bottomRightPixel = f.getBottomRight();
			var pixelsX = bottomRightPixel[0] - topLeftPixel[0] + 1;
			var pixelsY = bottomRightPixel[1] - topLeftPixel[1] + 1;
			// alustetaan array tayteen 0:llia
			var heights = new Array(pixelsX);
			for (var x = 0; x < pixelsX; x++) {
				var h_tmp = new Array(pixelsY);
				for (var y = 0; y < pixelsY; y++) {
					h_tmp[y] = 0;
				}
				heights[x] = h_tmp;
			}
			f.setHeights(heights); // asetetaan korkeustaulukko
			
			// jos kaikki file_oliot on maaritelty
			if (readedCount == file_objs.length) {
				callbackFunc(option, file_objs); // kutsutaan all_File_Objects_Set funktiota --> ohjelma jatkaa eteenpain siita
			}
		};
		img.src = "grayscales/" + f.getFileName() + ".jpeg"; // imagen source
	}
}

/**
 * Palauttaa taulukoissa annetuista file_objekteista pienimman ja korkeimman
 * loytyvan korkeuden
 */
function fileObjects_getMinMaxH(file_objs) {
	var minH = 100000;
	var maxH = -100000;
	
	for (var i = 0; i < file_objs.length; i++) {
		if (file_objs[i].getMin() < minH) minH = file_objs[i].getMin();
		if (file_objs[i].getMax() > maxH) maxH = file_objs[i].getMax();
	}
	
    if (minH < 0) {
        minH = 0;
    }
    
	return [minH, maxH];
}

/**
 * Mergettaa taulukossa annetujen file_objektien korkeudet yhteen kaksiuloitteiseen taulukkoon ja
 * palauttaa sen
 */
function mergeFileObjects(file_objs) {
	
	var eastCoords = findEastCoords(file_objs);
	var northCoords = findNorthCoords(file_objs);
	
	var rowHeights = new Array(northCoords.length); // tallennetaan korkeudet riveittain
	var i = 0; // osoitin rowHeightsiin
	// lahdetaan kaymaan pohjoisia lapi suurimmasta alaspain
	for (var y = northCoords.length - 1; y >= 0; y--) {
		var n = northCoords[y]; // otetaan kasiteltava pohjoiskoordinaatti
		var row_tmp = findFileObj(file_objs, n, eastCoords[0]).getHeights(); // kerataan tahan kaikki yhdella rivilla esiintyvat korkeudet, (haetaan vasemmassa reunassa olevan olion korkeudet)
		// kaydaan lapi rivin oliot oikealle pain
		for (var x = 1; x < eastCoords.length; x++) {
			var e = eastCoords[x]; // haetaan kasiteltava ita koordinaatti
			var cur_heights = findFileObj(file_objs, n, e).getHeights(); // haetaan rivin seuraava olio
			row_tmp = mergeX(row_tmp, cur_heights); // mergetetaan yhteen aikaisemmat korkeudet rivilta ja nykyinen kasiteltava korkeus
		}
		// kun yksi rivi on kasitelty, tallennetaan keratyt rivin korkeudet rowHeights taulukkoon
		rowHeights[i] = row_tmp;
		i++; // kasvatetaan indexia
	}
	
	// alustetaan matrixi, johon yhdistetaan kaikki rivejen keratyt korkeudet
	var matrix = rowHeights[0];
	
	// kaydaan loput rivit lapi ja liitetaan ne matrixiin, eli mergetetaan y suunnassa korkeudet
	for (var i = 1; i < rowHeights.length; i++) {
		matrix = mergeY(matrix ,rowHeights[i]); // liitto
	}
	
	// palautetaan lopuksi matriisi
	return matrix;	
	
	// APUFUNKTIOT, eivat nay mergeFileObjects function ulkopuolelle!
	/**
	 * palauttaa olion f_objs taulukosta, jonka poh ja ita vastaa annettuja parametreja
	 * muuten palautta null
	 */
	function findFileObj(f_objs, north, east) {
		for (var i = 0; i < f_objs.length; i++) {
			if (f_objs[i].getNorth() == north && f_objs[i].getEast() == east) return f_objs[i];
		}
		return null;
	}
	
	/**
	 * palauttaa kaikki loytyvat ita koordinaatit taulukossa annetuista file olioista
	 */
	function findEastCoords(f_objs) {
		var eastCoords = [];
		for (var i = 0; i < f_objs.length; i++) {
			var canAdd = true;
			for (var j = 0; j < eastCoords.length; j++) {
				if (eastCoords[j] == f_objs[i].getEast()) canAdd = false;
			}
			if (canAdd) eastCoords.push(f_objs[i].getEast());
		}
		
		eastCoords.sort(sortNumber); // jarjestetaan suuruus jarjestykseen
		
		return eastCoords;
	}
	
	/**
	 * palauttaa kaikki loytyvat pohjois koordinaatit taulukossa annetuista file olioista
	 */
	function findNorthCoords(f_objs) {
		var northCoords = [];
		for (var i = 0; i < f_objs.length; i++) {
			var canAdd = true;
			for (var j = 0; j < northCoords.length; j++) {
				if (northCoords[j] == f_objs[i].getNorth()) canAdd = false;
			}
			if (canAdd) northCoords.push(f_objs[i].getNorth());
		}
		
		northCoords.sort(sortNumber); // jarjestetaan suuruus jarjestykseen
		
		return northCoords;
	}
	
	/**
	 * kaytetaan sortissa, jolla sortataan loytyvat ita ja pohjois koordinaatit
	 */
	function sortNumber(a,b) {
		return a - b;
	}
	
	/**
	 * mergettaa kaksi matriisia yhteen x-akselin linjalla
	 */
	function mergeX(t1, t2) {
		return t1.concat(t2);
	}


	/**
	 * mergettaa kaksi matriisia yhteen y-akselin linjalla
	 */
	function mergeY(t1, t2) {
		for (var i = 0; i < t1.length; i++) {
			for (var j = 0; j < t2[i].length; j++) {
				t1[i].push(t2[i][j]);
			}
		}	
		return t1;
	}
}


/**
 * pienentaa annetun heights matriisiin uuteen kokoon
 * huom newSizeX ja newSizeY tulee olla > 1!!
 * ottaa suoraan vanhan matriisin valilta arvot, ei laske mitaan keskiarvoja korkeuksista
 */
function decreaseHeightsMatrix(heights, newSizeX, newSizeY) {
	if (newSizeX <= 1 || newSizeY <= 1) {
		console.log("new size have to be >= 2!");
		return;
	}
	var new_heights = new Array(newSizeX);
	for (var i = 0; i < newSizeX; i++) {
		var x =  Math.floor((i * (  (heights.length-1) / (newSizeX-1)))); // lasketaan pikselin X coordinaatti
		var h_tmp = new Array(newSizeY);
		for (var j = 0; j < newSizeY; j++) {
			var y =  Math.floor((j * (  (heights[0].length-1) / (newSizeY-1)))); // lasketaan pikselin X coordinaatti
			h_tmp[j] = heights[x][y]; 
		}
		new_heights[i] = h_tmp;
	}
	
	return new_heights;
}


/**
 * palauttaa pieninmman ja suurimman korkeuden parametrina annetusta heights matriisista
 */
function getHeightsMatrixMinMaxH(heights) {
	
	var minH = 1000000;
	var maxH = -1000000;
	
	for (var i = 0; i < heights.length; i++) {
		for (var j = 0; j < heights[0].length; j++) {
			if (heights[i][j] < minH) minH = heights[i][j];
			if (heights[i][j] > maxH) maxH = heights[i][j];
		}
	}
	
    if (minH < 0) {
        minH = 0;
    }
    
	return [minH, maxH];
}


/**
 * Kay puuttuvat data-aukot lapi horisontaalisesti ja vertikaalisesti
 * Ottaa palautettavaan taulukkoon naiden paikkauksien keskiarvon
 */
function fillAllDataHoles(heights) {
	
	// paikataan ensiksi vaakarivien suunnassa
	var fixed1 =  fillDataHolesLinearHorizontal(heights);
	
	// paikataan toiseksi pystyrivien suunnassa
	var fixed2 =  fillDataHolesLinearVertical(heights);
	
	// asetetaan heights matriisin paikattujen matriisien korkeuksien keskuarvot
	for (var x = 0; x < heights.length; x++) {
		for (var y = 0; y < heights[0].length; y++) {
			heights[x][y] = (fixed1[x][y] + fixed2[x][y]) / 2.0; // lasketaan keskiarvo
		}
	}
	
	return heights; // palautetaan lopuksi paikattu matriisi
}





/**
 * Ottaa parametrina korkeusmatriisin ja paikkaa puuttuvat arvot lineaarisesti vaakarivien suunnassa!
 * Eli kaytetaan .hgt fileen josta on tehty matriisi!
 * palauttaa lopuksi paikatun matriisin
 * lisatty 2.11.2018
 */
function fillDataHolesLinearHorizontal(heights) {
	
	// kaydaan lapi yksi rivi kerrallaan ja paikataan noData arvot:
	for(var y = 0; y < heights[0].length; y++) {
		
		// jos eka alkio on NODATA --> etsitaan seuraava validi korkeus ja alustetaan ensimmainen arvo siksi
		if (heights[0][y] <= NO_DATA_VALUE) {
			for (var x = 1; x < heights.length; x++) {
				if (heights[x][y] > NO_DATA_VALUE) {
					heights[0][y] = heights[x][y]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					break;
					//x = heights.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		// jos vika alkio on NODATA --> etsitaan edellinen ensimmainen validi korkeus ja alustetaan viimeinen siksi
		if (heights[heights.length-1][y] <= NO_DATA_VALUE) {
			for (var x = heights.length-2; x >= 0; x--) {
				if (heights[x][y] > NO_DATA_VALUE) {
					heights[heights.length-1][y] = heights[x][y]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					break;
					//x = heights.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		// taytetaan aukot lineaarisesti:
		var lastValidIndex = 0; // <- mika oli edellinen validi korkeus?
		var fill = false; // <- osoittaa pitaako dataa tayttaa
		for (var x = 0; x < heights.length; x++) { // kaydaan vaakarivi lapi
			// jos kasitetltava korkeus on NO_DATA, asetetaan taytto trueki
			if (heights[x][y] <= NO_DATA_VALUE) {
				fill = true;
			}
			else { // muuten jos kasiteltava data on VALIDI
				// jos dataa ei tarvitse tayttaa:
				if (!fill) {
					lastValidIndex = x; // asetetaan edellinen validi indeksu
				}
				if (fill) { // muuten, jos dataa tarvitsee tayttaa:
					// taytetaan data viimeisesta validista korkeudesta nykyiseen validiin korkeuteen:
					for (var i = lastValidIndex + 1; i < x; i++) {
						var t = (i - lastValidIndex) / (x - lastValidIndex); // lasketaan t, joka on arvo valilta 0-1
                        
						// interpolointi funktion valintaehto
						if (interpolationSetting) {
						    heights[i][y] = ((1.0 - t) * heights[lastValidIndex][y]) + (heights[x][y] * t);
						}
						else {
						    var t2 = (1.0 - Math.cos(t*Math.PI))/2;
						    heights[i][y] = ((1.0 - t2) * heights[lastValidIndex][y]) + (heights[x][y] * t2); // taytetaan rivin NODATA arvo uudella arvolla
						}
					}
					fill = false; // taytto on false
					lastValidIndex = x; // asetetaan viimeinen validi arvo
				}
			}
		}
	}
	
	return heights
}

function fillDataHolesLinearVertical(heights) {
	
	// kaydaan matriisin rivit lapi:
	for (var i = 0; i < heights.length; i++) {
		heights[i] = fill_row(heights[i]); // korjataan pystyrivin puuttuvat korkeudet 
	}
	
	return heights; // palautetaan korkeudet matriisi, jonka aukot on korjattu
	
	/**
	 * APUFUNKTIO:
	 * Tayttaa yhden rivin puuttuvat datat lineaarisesti
	 */
	function fill_row(row) {
		
		// jos eka alkio on NODATA --> etsitaan seuraava validi korkeus ja alustetaan ensimmainen arvo siksi
		if (row[0] <= NO_DATA_VALUE) {
			for (var i = 1; i < row.length; i++) {
				if (row[i] > NO_DATA_VALUE) {
					row[0] = row[i]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					break;
					//i = row.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		// jos vika alkio on NODATA --> etsitaan edellinen ensimmainen validi korkeus ja alustetaan viimeinen siksi
		if (row[row.length - 1] <= NO_DATA_VALUE) {
			for(var i = row.length - 2; i >= 0; i--) {
				if (row[i] > NO_DATA_VALUE) {
					row[row.length-1] = row[i]; // vika alkio on sama kuin ensimmainen validi korkeus loppu paasta
					break;
					//i = -1; // lopetetaan silmukka
				}
			}
		}
		
		// taytetaan aukot lineaarisesti:
		var lastValidIndex = 0; // <- mika oli edellinen validi korkeus?
		var fill = false; // <- osoittaa pitaako dataa tayttaa
		// kaydaan rivi lapi
		for (var i = 1; i < row.length; i++) {
			// jos kasitetltava korkeus on NO_DATA, asetetaan taytto trueki
			if (row[i] <= NO_DATA_VALUE) {
				fill = true;
			}
			else { // muuten jos kasiteltava data on VALIDI
				// jos dataa ei tarvitse tayttaa:
				if (!fill) {
					lastValidIndex = i; // asetetaan edellinen validi indeksu
				}
				if (fill) { // muuten, jos dataa tarvitsee tayttaa:
					// taytetaan data viimeisesta validista korkeudesta nykyiseen validiin korkeuteen:
					for (var j = lastValidIndex + 1; j < i; j++) {
						var t = (j - lastValidIndex) / (i - lastValidIndex); // lasketaan t, joka on arvo valilta 0-1
                        
						if (interpolationSetting) {
						    row[j] = ((1.0 - t) * row[lastValidIndex]) + (row[i] * t); // taytetaan rivin NODATA arvo uudella arvolla
						}
						else {
						    var t2 = (1.0 - Math.cos(t*Math.PI))/2;
						    row[j] = ((1.0 - t2) * row[lastValidIndex]) + (row[i] * t2);
						}
				}
					fill = false; // taytto asetetaan false
					lastValidIndex = i; // asetetaan viimeinen validi arvo
				}
			}
		}
		
		return row; // palautetaan rivi, jonka puuttuvat arvot on paikattu
	}
}


/**
 * Toiminta ei ole luotettavaa! Ei ole käytössä ohjelmassa!
 * Puuttuvien aukkojen taytto kolmen pisteen spline funktiolla, kay matriisin pystyriveittain lapi
 * sivun kaavaa kaytetty: https://www.desmos.com/calculator/yvgfpq2prf 
 */
function fillDataHolesSpline(heights) {
	
	// kaydaan matriisin rivit lapi:
	for (var i = 0; i < heights.length; i++) {
		heights[i] = fill_row(heights[i]); // korjataan pystyrivin puuttuvat korkeudet 
	}
	
	return heights; // palautetaan korkeudet matriisi, jonka aukot on korjattu
	
	/**
	 * APUFUNKTIO:
	 * Tayttaa yhden rivin puuttuvat datat lineaarisesti
	 */
	function fill_row(row) {
		
		// jos eka alkio on NODATA --> etsitaan seuraava validi korkeus ja alustetaan ensimmainen arvo siksi
		if (row[0] <= NO_DATA_VALUE) {
			for (var i = 1; i < row.length; i++) {
				if (row[i] > NO_DATA_VALUE) {
					row[0] = row[i]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					i = row.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		if (row[1] <= NO_DATA_VALUE) row[1] = row[0]; // jos toka alkio on NODATA (SPLINE tarvitsee aina kaksi arvoa, ennen "aukkoa")
		
		// jos vika alkio on NODATA --> etsitaan edellinen ensimmainen validi korkeus ja alustetaan viimeinen siksi
		if (row[row.length - 1] <= NO_DATA_VALUE) {
			for(var i = row.length - 2; i >= 0; i--) {
				if (row[i] > NO_DATA_VALUE) {
					row[row.length-1] = row[i]; // vika alkio on sama kuin ensimmainen validi korkeus loppu paasta
					i = -1; // lopetetaan silmukka
				}
			}
		}
		
		// taytetaan aukot:
		var lastValidIndex = 1; // <- mika oli edellinen validi korkeus?
		var fill = false; // <- osoittaa pitaako dataa tayttaa (oletuksena false)
		
		// kaydaan rivi lapi, aloitetaan kolmannesta alkiosta, koska ensimmaiset kaksi ovat aina validit
		for (var i = 2; i < row.length; i++) {
			
			// jos kasitetltava korkeus on NO_DATA, asetetaan taytto trueki
			if (row[i] <= NO_DATA_VALUE) {
				fill = true;
			}
			else { // muuten jos kasiteltava data on VALIDI
				// jos dataa ei tarvitse tayttaa:
				if (!fill) {
					lastValidIndex = i; // asetetaan edellinen validi indeksi
				}
				if (fill) { // muuten, jos dataa tarvitsee tayttaa:
				
					var p1 = [lastValidIndex - 1, row[lastValidIndex - 1]]; // splinen vaatimat pisteet
					var p2 = [lastValidIndex, row[lastValidIndex]];
					var apu = p2;
					if (Math.abs(p2[1] - p1[1]) > 0) {
						apu[1] = p1[1];
					}
						
					// p2 = Math.abs(p2[1] - p1[1]) > 1 ? p1[1] + 1 : p2[1];
					var p3 = [i, row[i]];
					
					// taytetaan data viimeisesta validista korkeudesta nykyiseen validiin korkeuteen:
					for (var j = lastValidIndex + 1; j < i; j++) {
						row[j] = spline(p1,apu,p3, j) // taytetaan rivin NODATA arvo uudella arvolla
					}
					fill = false; // taytto on false oletuksena seuraavalle silmukan kierrokselle
					lastValidIndex = i; // asetetaan viimeinen validi arvo
				}
			}
		}
		
		return row; // palautetaan rivi, jonka puuttuvat arvot on paikattu
	}
	
	/**
	 * Spline funktio kolmelle pisteelle, kayttaa suoraan
	 * sivulta https://www.desmos.com/calculator/yvgfpq2prf loytyvaa kaavaa
	 * p1-3 on splinen kayttamat pisteet ja x --> p2.x < x < p3.x
	 */
	function spline(p1,p2,p3,x) {
		var a1 = ( p1[0]*(p2[1]-p3[1]) + p2[0]*(p3[1]-p1[1]) + p3[0]*(p1[1]-p2[1]) ) / ( 2.0*(p1[0]-p2[0])*(p1[0]-p2[0])*(p1[0]-p3[0])*(p2[0]-p3[0]) );
		var b1 = ( p1[0]*p1[0]*(p3[1]-p2[1]) - p1[0]*(p2[0]*(-3*p1[1]+p2[1]+2*p3[1])+3*p3[0]*(p1[1]-p2[1])) + p2[0]*p2[0]*(p3[1]-p1[1]) + p2[0]*p3[0]*(p2[1]-p1[1]) + 2*p3[0]*p3[0]*(p1[1]-p2[1]) ) / ( 2*(p1[0]-p2[0])*(p1[0]-p3[0])*(p2[0]-p3[0]) );
		var a2 = ( (p2[0]-p1[0]) / (p2[0]-p3[0])) * a1; 
		var b2 = ( 2*p1[0]*p1[0]*(p2[1]-p3[1]) + p2[0]*(p1[0]*(p3[1]-p2[1])+p3[0]*(2*p1[1]+p2[1]-3*p3[1])) + 3*p1[0]*p3[0]*(p3[1]-p2[1]) + p2[0]*p2[0]*(p3[1]-p1[1]) + p3[0]*p3[0]*(p2[1]-p1[1]) ) / ( 2*(p1[0]-p2[0])*(p1[0]-p3[0])*(p2[0]-p3[0]) );
		
		return a2*(x-p3[0])*(x-p3[0])*(x-p3[0]) + b2*(x-p3[0]) + p3[1]*x;
	}
}
