/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

"use strict";

class Textures {
	
	/**
	 * Luokan muodostaja, luodaan tahan oletuksena kaytettavat tekstuurit
	 */
	constructor() {
		
		// oletuksena/valmiina kaytettavat tekstuurit:
		this.names = ["Wireframe", "Grayscale", "Red-Black", "NoiseTerrain" ,"World"]; // tekstuurien nimet
		this.valuesToBetween0And1 = [true,true,true,true,false]; // maailman korkeudet tulee esimerkiksi skaalata valille 0-1, jos kyseessa esim grayscale
		
		const wireframeGrad = new GradientColor([[0,0,0], [255,255,255]], [0.0, 1.0]); // grayscale oletuksena
		
		const grayscaleGrad = new GradientColor([[0,0,0], [255,255,255]], [0.0, 1.0]); // grayscale
		
		const blackRedGrad = new GradientColor([[0,0,0], [255,0,0]], [0.0, 1.0]); // black-red
		blackRedGrad.setOutColors([0,0,0], [255,0,0]);
		
		var noiseTerrainColors = [[0,0,255], [0,0, 255], [255, 205, 0], [255, 240, 0], [0,175,0], [98, 248,13], [192, 135, 5], [187, 157, 96], [137, 136, 130], [241,241,241]]
		var noiseTerrainValues = [0.0, 0.05, 0.05, 0.1, 0.3, 0.4, 0.5, 0.6, 0.7, 1.0];
		const noiseTerrainGrad = new GradientColor(noiseTerrainColors, noiseTerrainValues);
		noiseTerrainGrad.setOutColors([40,224,40], [241,241,241]);
		
		var worldColors = [[0,0,238], [40,224,40], [0,128,0], [100,144,76], [204,170,136], [136,100,70], [128,128,128], [180,128,64], [255,144,32], [200,110,80], [128,128,128], [255,255,255]];
		var worldValues = [0.0, 0.1, 200, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4500, 10000];
		const worldGrad = new GradientColor(worldColors, worldValues);
		worldGrad.setOutColors([0,0,238], [255,255,255]);
		
		
		this.gradients = [wireframeGrad, grayscaleGrad, blackRedGrad, noiseTerrainGrad, worldGrad] // asetetaan luodut liukuvarit
		
		this.addedTextures = 0;
		
		this.selectOption = 2;
	}
	
	setSelectOption(opt) {
		if (opt < 0 || opt > 2) opt = 2;
		this.selectOption = opt; 
	}
	
	setIsValueBetween0And1(index, val) {
		this.valuesToBetween0And1[index] = val;
	}
	
	
	/**
	 * metodi, jolla voidaan lisata luotu tekstuuri erikseen
	 */
	addTexture(name, gradient, isBetween0And1) {
		this.names.push(name);
		this.gradients.push(gradient);
		this.valuesToBetween0And1.push(isBetween0And1);
	}
	
	addDefaultCustomTexture() {
		this.names.push("Custom" + (this.addedTextures + 1));
		this.addedTextures++;
		this.gradients.push(new GradientColor([[0,0,0], [255,255,255]], [0.0, 1.0])); // grayscale
		this.valuesToBetween0And1.push(true);
	}
	
	
	/**
	 * piirtaa tekstuurin kanvasille
	 */
	drawTexture(name, heights, minMaxH) {
		
		var index = this.getIndexFromName(name); // haetaan mallin indeksi annetusta nimesta

		var canvas = document.getElementById("canv"); // haetaan kanvas
		var ctx = canvas.getContext("2d"); // otetaan kanvaksen konteksti
		
		var sizeX = heights.length; // korkedet vaakasuunnssa
		var sizeY = heights[0].length;
		
		canvas.width = sizeX; // korkedet vaakasuunnssa
		canvas.height = sizeY; // korkeudet pystysuunnssa
		
		// generoidaan pixselit imagedataan
		var imgData=ctx.createImageData(sizeX, sizeY); // luodaan ctx.ImageData objekti, johon kerataan suoraan generoitavan kuvan data
		var i = 0; // osoitin kuvan datalle
		// kaydaan lapi data, kuva luodaan antamalle arvot vasemmasta ylanurkasta oikealle edeten
		for (var y = 0; y < sizeY; y++) {
			for (var x = 0; x < sizeX; x++) {
				var h = heights[x][y]; // datassa oleva korkeus
				if (this.valuesToBetween0And1[index]) h = (h - minMaxH[0]) / (minMaxH[1] - minMaxH[0]); // jos korkeus tulee muuntaa valille 0-1
				if (isNaN(h)) h = 0;
				var rgb = this.gradients[index].getColor(h); // lasketaan vari h arvolla
				imgData.data[i+0] = rgb[0];
				imgData.data[i+1] = rgb[1];
				imgData.data[i+2] = rgb[2];
				imgData.data[i+3] = 255;
				i+=4;
			}
		}
		ctx.putImageData(imgData,0,0); // piirtaa generoidun imgDatan
	}
	
	
	/**
	 * Luo materiaalin 3d mallia varten
	 */
	getGeneratedMaterial(name, heights, minMaxH) {	
	
		var index = this.getIndexFromName(name); // haetaan tekstuurin indeksi
		
		if (index == 0) {
			 return new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe:true} ); // jos indeksi on 0, niin palautetaan wireframe materiaali
		}
		
		// luodaan tekstuurin data
		var pixelsX = heights.length;
		var pixelsY = heights[0].length;
		var data = new Uint8Array( 3 * pixelsX * pixelsY );
		var data_index = 0;
		for (var y = 0; y < pixelsY; y++) {
			for (var x = 0; x < pixelsX; x++) {
				var h = heights[x][y]; // otetaan korkeus
				if (this.valuesToBetween0And1[index]) h = (h - minMaxH[0]) / (minMaxH[1] - minMaxH[0]); // jos korkeus tulee skaalata valille 0-1
				if (isNaN(h)) h = 0;
				var rgb = this.gradients[index].getColor(h); // lasketaan vari h arvolla
				data[data_index] = rgb[0];
				data[data_index + 1] = rgb[1];
				data[data_index + 2] = rgb[2];
				data_index += 3;
			}
		}
	
		var generatedTexture = new THREE.DataTexture( data, pixelsX, pixelsY, THREE.RGBFormat ); // luodaan tekstuuri tekstuurin datalla
		generatedTexture.needsUpdate = true;
		
		var material = new THREE.MeshPhongMaterial( {specular: 0xffffff, shininess: 0.25, flatShading: true, map: generatedTexture} ); // white specular
		//var material = new THREE.MeshPhongMaterial( {specular: 0x000000, shininess: 0.5, flatShading: true, map: generatedTexture} ); // black specular
		return material; // palautetaan lopuksi luotu materiaali
	}
	
	
	/**
	 * Palauttaa tekstuurin indeksin nimen perusteella
	 */
	getIndexFromName(name) {
		var index = 0;
		for (var i = 0; i < this.names.length; i++) {
			if (this.names[i] === name ) {
				return i;
			}
		}
		return index;
	}
	
	
	getGradientColorFromName(name) {
		for (var i = 0; i < this.names.length; i++) {
			if (this.names[i] === name ) {
				return this.gradients[i];
			}
		}
		return this.gradients[0];
	}
	
	getIsBetween0And1FromName(name) {
		for (var i = 0; i < this.names.length; i++) {
			if (this.names[i] === name ) {
				return this.valuesToBetween0And1[i];
			}
		}
		return this.valuesToBetween0And1[0];
	}
	
	
	/**
	 * Palauttaa kaikkien luotujen tekstuurien nimet
	 */
	getTextureNames() {
		return this.names;
	}
	
	
	/**
	 * palauttaa kaikki mahdolliset piirrettavat tekstuurit nimelta, eli wireframe tekstuuri ei kuulu joukkoon
	 * option 0, palauttaa tekstuurit, jotka ovat valilta 0-1
	 * option 1, palauttaa tekstuurit, jotka ovat vapaalta valilti
	 * option 2, palauttaa molempien luokkien tekstuurit
	 */
	getTextureNamesForImg() {
		
		var textureNames = [];
		for (var i = 1; i < this.valuesToBetween0And1.length; i++) {
			if (this.selectOption == 0 || this.selectOption == 2) {
				if (this.valuesToBetween0And1[i]) textureNames.push(this.names[i]);
			}
			if (this.selectOption == 1 || this.selectOption == 2) {
				if (!this.valuesToBetween0And1[i]) textureNames.push(this.names[i]);
			}
		}
		
		return textureNames;
	}
	
	/**
	 * palauttaa kaikki mahdolliset piirrettavat tekstuurit nimelta, eli wireframe tekstuuri ei kuulu joukkoon
	 */
	getAllTextureNamesForImg() {
		
		var textureNames = [];
		for (var i = 1; i < this.valuesToBetween0And1.length; i++) {
			textureNames.push(this.names[i]);
		}	
		return textureNames;
	}
	
	
	/**
	 * palauttaa kaikki 3d mallille kaytettavat tekstuurit nimelta, eli wireframe kuuluu myos
	 * option 0, palauttaa tekstuurit, jotka ovat valilta 0-1
	 * option 1, palauttaa tekstuurit, jotka ovat vapaalta valilti
	 * option 2, palauttaa molempien luokkien tekstuurit
	 */
	getTextureNamesFor3d() {
		
		var textureNames = [];
		for (var i = 0; i < this.valuesToBetween0And1.length; i++) {
			if (this.selectOption == 0 || this.selectOption == 2) {
				if (this.valuesToBetween0And1[i]) textureNames.push(this.names[i]);
			}
			if (this.selectOption == 1 || this.selectOption == 2) {
				if (!this.valuesToBetween0And1[i]) textureNames.push(this.names[i]);
			}
		}
		
		return textureNames;
		
	}
}


/**
 * Luokka liukuvareille
 */
class GradientColor {

	constructor(colors, rangeValues) {
		
		this.colors = colors; // liukuvarissa olevat varit
		this.rangeValues = rangeValues; // liukuvarissa olevat varin vaihdokset
		
		this.outBeginColor = [0,0,0]; // oletus vari, jos annettava arvo on rangen ulkopuolella < range[0]
		this.outEndColor = [255,255,255]; // oletus vari, jos annettava arvo on rangen ulkopuolella > range[range.length - 1]
		
		// jos varien maarja ja arvojen maara ei tasmaa, niin varia ei luoda
		if (colors.length != rangeValues.length) {
			this.colors = []; //[[0,0,0], [255,255,255]];
			this.rangeValues = []; // [0.0, 1.0];
		}
		this.sort();
	}
	
	set(colors, rangeValues) {
		this.colors = colors; // liukuvarissa olevat varit
		this.rangeValues = rangeValues; // liukuvarissa olevat varin vaihdokset
		
		this.outBeginColor = [0,0,0]; // oletus vari, jos annettava arvo on rangen ulkopuolella < range[0]
		this.outEndColor = [255,255,255]; // oletus vari, jos annettava arvo on rangen ulkopuolella > range[range.length - 1]
		
		// jos varien maarja ja arvojen maara ei tasmaa, niin varia ei luoda
		if (colors.length != rangeValues.length) {
			this.colors = []; //[[0,0,0], [255,255,255]];
			this.rangeValues = []; // [0.0, 1.0];
		}
		
		this.sort();
	}
	
	
	getColors() {
		return this.colors;
	}
	
	getRangeValues() {
		return this.rangeValues;
	}
	
	
	/**
	 * metodi, joka asettaa ulkopuolelle menevien arvojen varit
	 */
	setOutColors(begin, end) {
		this.outBeginColor = begin;
		this.outEndColor = end;
	}
	
	
	/**
	 * lisaa varin ja arvon luotuun liukuvariin
	 */
	addColor(color, value) {
		this.colors.push(color);
		this.rangeValues.push(value);
		
		//this.sort();
	}
	
	
	removeColor(index) {
		var colorsNew = [];
		var rangeValuesNew = [];
		
		for (var i = 0; i < this.colors.length; i++) {
			if (i != index) {
				colorsNew.push(this.colors[i]);
				rangeValuesNew.push(this.rangeValues[i]);
			}
		}
		
		this.colors = colorsNew;
		this.rangeValues = rangeValuesNew;
	}
	
	
	/**
	 * palauttaa varin liukuvarista annetulla arvolla
	 * jos arvo osuu kahden varin valille, niin palauttaa sekoituksen vareista lerpilla
	 */
	getColor(value) {
		if (value < this.rangeValues[0]) return this.outBeginColor; // jos value on pienempaa kuin rangen eka arvo, palautetaan esim veden vari
		if (value > this.rangeValues[this.rangeValues.length - 1]) return this.outEndColor; // jos arvo on suurempaa kuin rangen vika arvo
		
		// etsitaan mille valille rangea annettu value osuu
		for (var i = 0; i+1 < this.rangeValues.length; i++) {
			// jos vali loytyy:
			if (value >= this.rangeValues[i] && value <= this.rangeValues[i + 1]) {
				// lasketaan lerpattu vari, valilta johon annettu value osui
				var t_value = (value - this.rangeValues[i]) / (this.rangeValues[i+1] - this.rangeValues[i]); // muutetaan value valille [0-1]
				return lerpColor(this.colors[i], this.colors[i+1], t_value);
			}
			
		}
		
		return [255,0,0]; // palautetaan punainen vari, jos varia ei muuten saatu
		
		/**
		 * apufunktio lerpColor, jossa lasketaan vari, kahden varin valilta,
		 * annetulla parametrilla t, joka on valilta 0-1
		 */
		function lerpColor(c1, c2, t) {
			var c = [0,0,0];
			c[0] = ((1.0 - t) * c1[0]) + (c2[0] * t); 
			c[1] = ((1.0 - t) * c1[1]) + (c2[1] * t);
			c[2] = ((1.0 - t) * c1[2]) + (c2[2] * t);
			
			c[0] = Math.round(c[0]);
			c[1] = Math.round(c[1]);
			c[2] = Math.round(c[2]);
			
			return c;
		}
	}
	
	
	/**
	 * sort funktio, joka varmistaa, etta kaikki liukuvarin arvot/varit ovat kasvavassa jarjestyksessa
	 */
	sort() {
		
		var newOrder = [];
		for (var i = 0; i < this.rangeValues.length; i++) {
			newOrder.push(i);
		}
		
		for (var i = 0; i < this.rangeValues.length; i++) {
			for (var j = this.rangeValues.length - 1; j > i; j--) {
				if (this.rangeValues[j] < this.rangeValues[i]) {
					var tmpVal = this.rangeValues[i];
					var tmpCol = this.colors[i];
					
					this.rangeValues[i] = this.rangeValues[j];
					this.colors[i] = this.colors[j];
					
					this.rangeValues[j] = tmpVal;
					this.colors[j] = tmpCol;
					
					var tmpI = newOrder[i];
					newOrder[i]= newOrder[j];
					newOrder[j] = tmpI;
				}
			}
		}
		
		this.outBeginColor = this.colors[0];
		this.outEndColor = this.colors[this.colors.length - 1];

		return newOrder;
	}
}

const textures = new Textures();