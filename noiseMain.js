/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 14.10.2019, GoldenLayout
 */

"use strict"; 

/**
 * @firstCreated 26.10.2018 by Jussi Parviainen
 * @version 12.11.2018
 */
window.onload = function() {
	textures.setSelectOption(0);
	
	// aloituksessa piirrettava grayscale ja 3d malli: 
	// width, height, scale, seed, octaves, persistance, lacunarity, offsetsXY
	var heights = generateNoiseMap(128,128, 100, 0,4, 0.5, 2.0, [0, 0]);
	
	textures.drawTexture("Grayscale", heights, [0, 1]);
	
	// heights, heights_minMaxH ,quadSize, max_model_height
	generateMesh(heights, [0,1] ,1, 20, "Grayscale");
	drawMesh();
}


/**
 * Tekee noise controllerin komponentit, eli noisea kasittelevat
 * inputit
 */
function createNoiseController() {
	var container = document.createElement("DIV"); // container, johon komoponentit
	
	var h_1 = document.createElement("H3"); // otsikko Leveydelle ja korkeudelle
	h_1.textContent = "Img size / 3d model vertices:";
	container.appendChild(h_1);
	
	var widthTxt = document.createElement("LABEL"); // Leveys
	widthTxt.textContent = "Width:";
	container.appendChild(widthTxt);
	var widthInp = numberBox("input_imgWidth", 128, 1, 2, 1024, true);
	container.appendChild(widthInp);
	
	var heightTxt = document.createElement("LABEL"); // Korkeus
	heightTxt.textContent = "Height:";
	container.appendChild(heightTxt);
	var heightInp = numberBox("input_imgHeight", 128, 1, 2, 1024, true);
	container.appendChild(heightInp);
	
	var h_2 = document.createElement("H3"); // Otsikko noisen parametreille:
	h_2.textContent = "Noise parameters:";
	container.appendChild(h_2);
	
	var scaleTxt = document.createElement("LABEL"); // scale
	scaleTxt.textContent = "Scale:";
	container.appendChild(scaleTxt);
	var scaleInp = numberBox("input_noiseScale", 100, 0.1, 0.00000001, 10000000, false);
	container.appendChild(scaleInp);
	
	var seedTxt = document.createElement("LABEL"); // seed
	seedTxt.textContent = "Seed:";
	container.appendChild(seedTxt);	
	var seedInp = numberBox("input_noiseSeed", 0, 1, 0, 9999999, true);
	container.appendChild(seedInp);
	
	var octavesTxt = document.createElement("LABEL"); // oktaavit
	octavesTxt.textContent = "Octaves:";
	container.appendChild(octavesTxt);
	var octavesInp = numberBox("input_noiseOctaves", 4, 1, 1, 32, true);
	container.appendChild(octavesInp);
	
	var persistanceTxt = document.createElement("LABEL"); // persistance
	persistanceTxt.textContent = "Persistence:";
	container.appendChild(persistanceTxt);
	var persistanceInp = numberBox("input_noisePersistance", 0.5, 0.1, 0, 9999, false);
	container.appendChild(persistanceInp);
	
	var lacunarityTxt = document.createElement("LABEL"); // lacunarity
	lacunarityTxt.textContent = "Lacunarity:";
	container.appendChild(lacunarityTxt);
	var lacunarityInp = numberBox("input_noiseLacunarity", 2.0, 0.1, 0, 9999, false);
	container.appendChild(lacunarityInp);
	
	var offsetXTxt = document.createElement("LABEL"); // offset X
	offsetXTxt.textContent = "Offset X:";
	container.appendChild(offsetXTxt);
	var offsetXInp = numberBox("input_noiseOffsetX", 0, 0.1, -10000000, 10000000, false);
	container.appendChild(offsetXInp);
	
	var offsetYTxt = document.createElement("LABEL"); // offsetY
	offsetYTxt.textContent = "Offset Y:";
	container.appendChild(offsetYTxt);
	var offsetYInp = numberBox("input_noiseOffsetY", 0, 0.1, -10000000, 10000000, false);
	container.appendChild(offsetYInp);
	
	var randomSeedBtn = document.createElement("BUTTON");
	randomSeedBtn.textContent = "Random seed";
	randomSeedBtn.onclick = function(event) {
		rnd_seed();
	}
	container.appendChild(randomSeedBtn);
	
	var randomOffsetsBtn = document.createElement("BUTTON");
	randomOffsetsBtn.textContent = "Random offsets";
	randomOffsetsBtn.onclick = function(event) {
		rnd_offsets();
	}
	container.appendChild(randomOffsetsBtn);

	return container;
}


/**
 * Hakee kayttajan syottamat parametrit noisecontrollerista, ja 
 * generoi parametreista noise Mapin, joka palautetaan
 */
function generateNoiseMapFromInputs() {
	
	var imgWidth = parseInt(document.getElementById('input_imgWidth').value, 10); // kuvan koko/vertices lkm
	if (isNaN(imgWidth)) imgWidth = 128;
	if (imgWidth < 2 ) imgWidth = 2;
	if (imgWidth > 1024) imgWidth = 1024;
	document.getElementById('input_imgWidth').value = imgWidth;
	
	var imgHeight = parseInt(document.getElementById('input_imgHeight').value, 10); // kuvan korkeus/verticet lkm
	if (isNaN(imgHeight)) imgHeight = 128;
	if (imgHeight < 2) imgHeight = 2;
	if (imgHeight > 1024) imgHeight = 1024;
	document.getElementById('input_imgHeight').value = imgHeight;
	
	var noiseScale = parseFloat(document.getElementById('input_noiseScale').value); // scale
	if (isNaN(noiseScale)) noiseScale = 100.0;
	if (noiseScale < 0.00000001) noiseScale = 0.00000001;
	if (noiseScale > 10000000) noiseScale = 10000000;
	document.getElementById('input_noiseScale').value = noiseScale;
	
	var noiseSeed = parseInt(document.getElementById('input_noiseSeed').value, 10); // seed
	if (noiseSeed < 0 || isNaN(noiseSeed)) noiseSeed = 0;
	if (noiseSeed > 9999999) noiseSeed = 9999999;
	document.getElementById('input_noiseSeed').value = noiseSeed;
	
	var noiseOctaves = parseInt(document.getElementById('input_noiseOctaves').value, 10); // octaves
	if (isNaN(noiseOctaves)) noiseOctaves = 4;
	if (noiseOctaves < 1 ) noiseOctaves = 1;
	if (noiseOctaves > 32) noiseOctaves = 32;
	document.getElementById('input_noiseOctaves').value = noiseOctaves;
	
	var noisePersistance = parseFloat(document.getElementById('input_noisePersistance').value); // persistance
	if (isNaN(noisePersistance)) noisePersistance = 0.5;
	if (noisePersistance < 0) noisePersistance = 0;
	if (noisePersistance > 1000) noisePersistance = 9999;
	document.getElementById('input_noisePersistance').value = noisePersistance;
	
	var noiseLacunarity = parseFloat(document.getElementById('input_noiseLacunarity').value); // lacunarity
	if (isNaN(noiseLacunarity)) noiseLacunarity = 2.0;
	if (noiseLacunarity < 0) noiseLacunarity = 0;
	if (noiseLacunarity > 1000) noiseLacunarity = 9999;
	document.getElementById('input_noiseLacunarity').value = noiseLacunarity;
	
	var noiseOffsetX = parseFloat(document.getElementById('input_noiseOffsetX').value); // offset X
	if (isNaN(noiseOffsetX)) noiseOffsetX = 0;
	document.getElementById('input_noiseOffsetX').value = noiseOffsetX;
	
	var noiseOffsetY = parseFloat(document.getElementById('input_noiseOffsetY').value); // offset Y
	if (isNaN(noiseOffsetY)) noiseOffsetY = 0;
	document.getElementById('input_noiseOffsetY').value = noiseOffsetY;
	
	// Generoidaan noise map:
	var heights = generateNoiseMap(imgWidth, imgHeight, noiseScale, noiseSeed, noiseOctaves, noisePersistance, noiseLacunarity, [noiseOffsetX, noiseOffsetY]);
	
	return heights; // palautetaan korkeudet
}


/**
 * Piirtaa molemmat grayscalen ja 3d mallin kayttajan syotteista
 */
function drawTextureAnd3dModelFromNoiseInputs() {
	
	var heights = generateNoiseMapFromInputs();

	var selectedTextureImg = document.getElementById("selectTextureImg").value; // valittu tekstuuri

	textures.drawTexture(selectedTextureImg, heights, [0, 1]);

	// 3d malli parametrit
	var quadSize = parseFloat(document.getElementById('input_modelQuadSize').value);
	if (isNaN(quadSize)) quadSize = 1.0;
	if (quadSize < 0.1) quadSize = 0.1;
	if (quadSize >1000) quadSize = 1000;
	document.getElementById('input_modelQuadSize').value = quadSize;
	
	var maxHeight = parseFloat(document.getElementById('input_modelMaxHeight').value);
	if (isNaN(maxHeight)) maxHeight = 1.0;
	if (maxHeight < 0) maxHeight = 0;
	if (maxHeight >10000) maxHeight = 10000;
	document.getElementById('input_modelMaxHeight').value = maxHeight;

	var selectedTexture3D = document.getElementById("selectedTexture3D").value; // valittu tekstuuri 3d mallille
	
	// heights, heights_minMaxH ,quadSize, max_model_height, texture(int)
	generateMesh(heights, [0.0,1.0], quadSize, maxHeight, selectedTexture3D);
	drawMesh();	
}


/**
 * Piirtaa pelkan 3d mallin kayttajan syotteista
 */
function draw3dModelFromNoiseInputs() {
	var heights = generateNoiseMapFromInputs();
	
	// 3d malli parametrit
	var quadSize = parseFloat(document.getElementById('input_modelQuadSize').value);
	if (isNaN(quadSize)) quadSize = 1.0;
	if (quadSize < 0.1) quadSize = 0.1;
	if (quadSize >1000) quadSize = 1000;
	document.getElementById('input_modelQuadSize').value = quadSize;
	
	var maxHeight = parseFloat(document.getElementById('input_modelMaxHeight').value);
	if (isNaN(maxHeight)) maxHeight = 1.0;
	if (maxHeight < 0) maxHeight = 0;
	if (maxHeight >10000) maxHeight = 10000;
	document.getElementById('input_modelMaxHeight').value = maxHeight;

	var selectedTexture3D = document.getElementById("selectedTexture3D").value; // valittu tekstuuri 3d mallille
	
	// heights, heights_minMaxH ,quadSize, max_model_height, texture(int)
	generateMesh(heights, [0.0,1.0], quadSize, maxHeight, selectedTexture3D);
	drawMesh();	
	
}


/**
 * Piirtaa pelkan grayscalen kayttajan syotteista
 */
function drawTextureFromNoiseInputs() {
	var heights = generateNoiseMapFromInputs();
	
	var selectedTexture = document.getElementById("selectTextureImg").value;
	
	textures.drawTexture(selectedTexture, heights, [0, 1]);
}


/**
 * Arpoo satunnaisen seedin ja paivittaa input laatikon
 */
function rnd_seed() {
	var seed = Math.floor(Math.random() * 9999999);
	document.getElementById('input_noiseSeed').value = seed;
	//drawGrayScaleFromNoiseBtnClick();
}


/**
 * Arpoo satunnaiset offsetit ja paivittaa input laatikot
 */
function rnd_offsets() {
	var offsetX	= Math.floor(Math.random() * 200000 - 100000 );
	document.getElementById('input_noiseOffsetX').value = offsetX;
	var offsetY = Math.floor(Math.random() * 200000 - 100000 );
	document.getElementById('input_noiseOffsetY').value = offsetY;
	//drawGrayScaleFromNoiseBtnClick();
}