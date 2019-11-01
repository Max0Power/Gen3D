"use strict";

/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 14.10.2019, GoldenLayout
 */

/**
 * @author Jussi Parviainen
 * @edited 09.10.2018
 * @edited 20.10.2018
 * @edited 8.10.2019 -> Rakennetta muutettu, koska three.js pääsi generoimaan ylimääräistä muistia. Aikaisemmin mallit
 * tuhottiin poistamalla canvasista three.js elementit -> muisti ei vapautunut.
 * Nykyään three.js:än scene tyhjennetään, joka ei generoi turhaa muistia -> muisti vapautuu
 * First created 02.10.2018
 */
 
var meshVertices; // generoitavan meshin verticet (pakollinen)
var meshTriangles; // generoitavan meshin kolmiot (pakollinen)
var meshNormals; // generoitavan meshin normaalit (ei pakollinen)
var meshUvs; // mahdollisesti kaytettavalle textuurille UV koordinaatit (ei pakollinen)

var material;

var cameraPosition = [0,100,100];

var container;
var scene;
var renderer;
var camera;
var controls;
var mesh = null;

function init() {
    container = document.createElement("DIV"); // container, johon renderer lisataan
    fitToContainer(container);
    
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( container.clientWidth, container.clientHeight );
    renderer.shadowMap.enabled = true; // pistetaan shadowmappi (ei pakollinen)
    renderer.shadowMap.type = THREE.basicShadowMap; // asetetaan varjon tyyppi (ei pakollinen)
    container.appendChild( renderer.domElement );
    
    var ambientLight = new THREE.AmbientLight(0x404040, 1.0); // valo sceneen (ei pakollinen)
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    //directionalLight.position.x = Math.random() - 0.5;
    //directionalLight.position.y = Math.random() - 0.5;
    //directionalLight.position.z = Math.random() - 0.5;
    //directionalLight.position.normalize();
    scene.add( directionalLight );
    
    // kamera
    var maxDrawDistance = 10000; //1000;
    camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 0.1, maxDrawDistance );
    
    // controllit
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10000;
    controls.maxPolarAngle = Math.PI / 2;
    
    // FPS counter for testing (https://github.com/mrdoob/stats.js/) (MIT Licence)
    javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();stats.dom.style.cssFloat = "left";container.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
	
    return draggableUiComponent("3D-model", [0, 0], container);
}


// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_orbit.html // orbit esimerkki, eli kuinka kontrollit toimivat
function drawMesh() {
	
	//console.log ("verticeja: " + meshVertices.length);
	//console.log ("kolmioita: " + meshTriangles.length);
	
	// generoidun meshin piirto:
	
	//init(); // suoritetaan tarvittavien komponenttien luonti (kutsutaan vain kerran)
	
	// Tyhjennetaan scene:
	if (mesh != null) {
		scene.remove(mesh);
		mesh.geometry.dispose();
		mesh.material.dispose();
		mesh = null;
	}
	
	// Kameran paikka
	camera.position.set(cameraPosition[0],cameraPosition[1],cameraPosition[2]);
	camera.lookAt(0, 0, 0);

	
	var geometry = new THREE.Geometry(); // luodaan meshin geometria datasta
	
	for (var i = 0; i < meshVertices.length; i++) {
		geometry.vertices.push(new THREE.Vector3(meshVertices[i][0], meshVertices[i][1], meshVertices[i][2])); // lisataan meshin verticet geometriaan
	}
	
	geometry.faceVertexUvs[0] = []; // UV, poista, jos omia tekstureita ei kayteta!!!!!!!!!!
	
	for (var i = 0; i < meshTriangles.length; i++) {
		geometry.faces.push( new THREE.Face3( meshTriangles[i][0], meshTriangles[i][1], meshTriangles[i][2] )); // lisataan meshin kolmiot geometriaan
		
		var uv1 = meshUvs[meshTriangles[i][0]];
		var uv2 = meshUvs[meshTriangles[i][1]];
		var uv3 = meshUvs[meshTriangles[i][2]];
		
		geometry.faceVertexUvs[0].push([ // UV, poista, jos omia tekstureita ei kayteta!!!!!!!!!!
			new THREE.Vector2(uv1[0], uv1[1]),
			new THREE.Vector2(uv2[0], uv2[1]),
			new THREE.Vector2(uv3[0], uv3[1])
		]);
	}	
	geometry.uvsNeedUpdate = true; // UV, poista, jos omia tekstureita ei kayteta!!!!!!!!!!
	
	mesh = new THREE.Mesh( geometry, material ); // luodaan meshi ja asetetaan materiaali
	mesh.drawMode = THREE.TrianglesDrawMode; //default

	scene.add( mesh ); // lisataan luotu meshi sceneen
	
	render();
	
	// paivittaa 3d piirtoikkunan tarvittaessa uuteen kokoon
	window.onresize = function(event) {
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( container.clientWidth, container.clientHeight );
		render();
	};
	
	/*
	// animoi, eli kuuntelee controllit
	function animate() {
		requestAnimationFrame( animate );
		controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
		render();
		
	}*/
}

// renderoi 3d mallin nakyvaksi
function render() {
	renderer.render( scene, camera );
	cameraPosition = [camera.position.x, camera.position.y, camera.position.z]; // paivittaa kameran position talteen
}


/**
 * Luo 3D objektin annetusta korkeuksista
 * @param {MATRIISI} heights - taulukko, joka sisaltaa meshille tulevat korkeudet (lukuja valilla [0-1]) | heights[0][0] on 2D kuvassa vasen ylanurkka
 * @param {MATRIISI} heights_minMaxH - Mika on annettujen korkeuksien pienin ja suurin arvo
 * @param {double} quadSize - kuinka suuri vali verticejen pisteiden valilla on eli quadin koko
 * @param {double} max_model_height - maksimi korkeus, johon verticen pystyy luomaan, eli malli ei saa suurempaa korkeutta
 */
function generateMesh(heights, heights_minMaxH ,quadSize, max_model_height, textureName) {
	
	if (heights.length < 2 || heights[0] < 2) return;
	
	material = textures.getGeneratedMaterial(textureName, heights, heights_minMaxH); // luodaan materiaali parametrina annetulla tekstuurilla
	
	var verticesX = heights.length;
	var verticesZ = heights[0].length;
	
	var triangleCount = (verticesX - 1) * (verticesZ - 1) * 2; // lasketaan monta kolmiota meshiin tulee
	meshVertices = new Array(verticesX * verticesZ); // alustetaan taulukko, joka keraa verticejen datan
	meshTriangles = new Array(triangleCount); // alustetaan taulukko, joka keraa meshin kolmioiden datan
	meshUvs = new Array(verticesX * verticesZ); // alustetaan taulukko, joka keraa meshin Uv datan
	// meshin vasen alanurkka, eli x ja z koordinaatit																				. . .
	var cornerX = 0.0 - ((verticesX - 1) * quadSize * 0.5); // meshin nurkan X koordinaatti . . .
	var cornerZ = 0.0 - ((verticesZ - 1) * quadSize * 0.5); // meshin nurkan Z koordinaatti x . .
	
	var v_index = 0; // mones kasiteltava vertice
	var t_index = 0; // mones kasiteltava kolmio
	
	// luodaan meshin data, lahdetaan x,z nurkasta liikkeelle ja edetaan z linjaa pitkin, eli 2D kuvassa tama on vasen alanurkka
	for (var i = 0; i < verticesX; i++) {
		
		for (var j = 0; j < verticesZ; j++) {
			var x = cornerX + (1.0 * i * quadSize); // x koordinaatti verticelle

			var val_btwn_0_and_1 = (heights[i][j] - heights_minMaxH[0]) / (heights_minMaxH[1] - heights_minMaxH[0]); // kuten grayscalessa, muutetaan korkeus valille 0-1
			var y = val_btwn_0_and_1 * max_model_height; // y koordinaatti verticelle | kun heights[0][0] on vasen ylakulma, niin -> heights[i][verticesZ - 1 - j] on oikean pikselin korkeus
			
			var z = cornerZ + (1.0 * j * quadSize); // z koordinaatti verticelle
			
			var v = [x,y,z]; // luodaan vertice			
			meshVertices[v_index] = v; // asetetaan luotu vertice meshin dataan	
			
			// . . .  | t = luodaan trianglit
			// t t .  | ./t on verticen piste
			// t t .
			// luodaan meshille faset, kun ehto toteutuu (kolmioita ei luoda, kun kasiteltava vertice on "oikeassa reunassa" tai "yla reunassa" 
			if ( (i+1) < verticesX && (j+1) < verticesZ ) {
				// esimerkki miten v1-v4 valitaan, kun v_index on 0
				// 2 5 8
				// 1 4 7 -> v1 = 0, v2 = 1, v3 = 3, v4 = 4
				// 0 3 6 
				var v1 = v_index // kasiteltavan verticen indeksi
				var v2 = (v1 + 1) // seuraava vertice kasiteltavan verticen indeksista
				var v3 = (v1 + verticesZ);
				var v4 = v3 + 1;
				
				var t1 = [v1, v2, v3]; // kolmio1, myotapaivaan
				var t2 = [v2, v4, v3]; // kolmio2, myotapaivaan
				
				// lisataan kolmiot meshin dataan
				meshTriangles[t_index] = t1;
				meshTriangles[(t_index + 1)] = t2;
				t_index += 2; // kasvatetaan kasiteltavan kolmion indeksia kahdella
			}
			
			// tallennetaan verticelle UV data
			var uvX = (1.0 * i) / ((verticesX-1) * 1.0); // arvo 0-1, kasiteltavan verticen UV koordinaatin X arvo
			var uvY = (1.0 * j) / ((verticesZ - 1) * 1.0) // arvo 0-1, kasiteltavan verticen UV koordinaatin Y arvo
			meshUvs[v_index] = [uvX, uvY]; // lisataan UV koordinaatti, verticen indeksille
			
			v_index++; // kasvatetaan kasiteltavan verticen indeksia yhdella
		}
	}
	
	calculateNormals(); // lopuksi lasketaan normaalit (ei pakollinen, ja jos korkeusdata tiedetaan, niin normaalit voi laskea kolmioita muodostaessa)

}


/**
 * Testattu ja laskee normaalit oikein
 * verrattu blenderin tuottamiin normaaleihin ja tasmaavat
 * Jos korkeusdata tiedetaan, niin normaalit voidaan laskea dynaamisesti kolmioiden luonnin yhteydessa
 */
function calculateNormals() {
	meshNormals = new Array(meshTriangles.length); // normaalit lasketaan kolmioista
	
	// kaydaan kolmiot lapi, ja lasketaan pintojen normaalit
	for (var i = 0; i < meshTriangles.length; i++) {
		// p1, p2 ja p3 on meshin pisteista muodostuva kolmio, kolmio haetaan meshin triangles datasta.
		var p1 = meshVertices[meshTriangles[i][0]];
		var p2 = meshVertices[meshTriangles[i][1]];
		var p3 = meshVertices[meshTriangles[i][2]];
		
		// muodostetaan vektorit U ja V, jossa U=p2-p1 ja V=p3-p1
		var vector_U = [ (p2[0]-p1[0]), (p2[1]-p1[1]), (p2[2]-p1[2]) ];
		var vector_V = [ (p3[0]-p1[0]), (p3[1]-p1[1]), (p3[2]-p1[2]) ];
		
		var n = normaliseV(crossProduct(vector_U, vector_V)); // normaali on U ja V vektorin ristitulo, ja normalisoidaan sen pituus ristitulon jalkeen
		meshNormals[i] = n; // asetetaan laskettu normaali dataan
	}
}


/**
 * Laskee ristitulon kahden vektorin valilla
 * @returns {[x,y,z]} Palauttaa ristitulosta syntyvan vektorin
 */
function crossProduct(v1, v2) {
	var x = (v1[1] * v2[2]) - (v1[2] * v2[1]);
	var y = (v1[2] * v2[0]) - (v1[0] * v2[2]);
	var z = (v1[0] * v2[1]) - (v1[1] * v2[0]);
	
	return [x, y, z];
}

/**
 * Normalisoi annetun vektorin, eli muokkaa sen pituuden yhdeksi
 * @returns {[x,y,z]} palauttaa annetun vektorin normalisoituna
 */
function normaliseV(v) {
	var length = Math.sqrt( (v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]) );	
	return [(v[0] / length), (v[1] / length), (v[2] / length) ]
}


/**
 * Palauttaa merkkijonon, joka sisaltaa meshin datan .obj filen vaatimassa muodossa
 * @returns {string} Palauttaa merkkijonon, joka sisaltaa meshin datan .obj filen vaatimassa muodossa
 */
function meshDataToObj() {
	var data = "# Terrain data:\n";
	data = data + "o Terrain\n"; // luo objektin, jonka nimi on Terrain
	
	var v_String = ""; // merkkijono, johon kerataan meshin verticet
	for (var i = 0; i < meshVertices.length; i++) {
		v_String = v_String + "v " + meshVertices[i][0] + " " + meshVertices[i][1] + " " + meshVertices[i][2] + "\n"; // lisataan vertice
	}
	
	var vt_String = ""; // merkkijono, johon kerataan UV koordinaatit, eli tekstuurille tulevat pisteet
	for (var i = 0; i < meshUvs.length; i++) {
		vt_String = vt_String + "vt " + meshUvs[i][0] + " " + meshUvs[i][1] + "\n";
	}
	
	var vn_String = ""; // merkkijono, johon kerataan pintojen eli kolmioiden normaalit
	for (var i = 0; i < meshNormals.length; i++) {
		vn_String = vn_String + "vn " + meshNormals[i][0] + " " + meshNormals[i][1] + " " + + meshNormals[i][2] + "\n"; // lisataan normaali
	}
	
	var f_String = ""; // merkkijono, johon kerataan facet --> otetaan data kolmioista
	for (var i = 0; i < meshTriangles.length; i++) {
		f_String = f_String + "f " + (meshTriangles[i][0] + 1) + " " + (meshTriangles[i][1] + 1) + " " + (meshTriangles[i][2] + 1) + "\n"; // lisataan face, eli kolmio
	}
	
	return data + v_String + f_String;
	//return data + v_String + vt_String + vn_String + f_String; // palautetaan merkkijono, joka sisaltaa .obj filen luomiseen tarvittavat tiedot
}


/**
 * Kun kayttaja klikkaa download .obj file buttonia
 * Lataa luodun 3d objektin .obj tiedostoon, jonka kayttaja voi tallentaa
 */
function downloadObj() {
	if (!meshVertices || meshVertices.length < 4) return; // jos meshverticeja ei ole viela maaritelty tai niita on liian vahan
	
	var content = meshDataToObj(); // otetaan 3d objektin data merkkijonoksi
	
	var a = document.createElement('a'); // luodaan a elementti
	a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)); // asetetaan teksti linkkiin
	a.setAttribute('download', "model.obj"); // asetetaan download attribuutti ja ladattavan filen nimi
	a.style.display = 'none'; // ei ole nakyvissa
	document.body.appendChild(a); // lisataan elementti bodyyn

	a.click(); // kutsutaan click tapahtumaa automaattisesti -> aktivoi kayttajan lataus ikkunan

	document.body.removeChild(a); // poistetaan luotu a elementti
}
