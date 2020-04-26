/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 14.10.2019, GoldenLayout
 * @version 26.04.2020, jQuery.i18n
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
    h_1.className = "deftext";
    h_1.textContent = "Img size / 3d model vertices:";
    h_1.setAttribute("data-i18n", "noise-ctrl-img-size");
    container.appendChild(h_1);
    
    var div1 = document.createElement("DIV");
    div1.className = "flexable";
    container.appendChild(div1);

    var span1 = document.createElement("SPAN");
    span1.className = "form-group";
    div1.appendChild(span1);

    var widthTxt = document.createElement("LABEL"); // Leveys
    widthTxt.textContent = "Width:";
    widthTxt.setAttribute("data-i18n", "noise-ctrl-width");
    //container.appendChild(widthTxt);
    span1.appendChild(widthTxt);
    var widthInp = numberBox("input_imgWidth", 128, 1, 2, 1024, true);
    //container.appendChild(widthInp);
    span1.appendChild(widthInp);
    
    var span2 = document.createElement("SPAN");
    span2.className ="form-group";
    div1.appendChild(span2);
    
    var heightTxt = document.createElement("LABEL"); // Korkeus
    heightTxt.textContent = "Height:";
    heightTxt.setAttribute("data-i18n", "noise-ctrl-height");
    //container.appendChild(heightTxt);
    span2.appendChild(heightTxt);
    var heightInp = numberBox("input_imgHeight", 128, 1, 2, 1024, true);
    //container.appendChild(heightInp);
    span2.appendChild(heightInp);
    
    var h_2 = document.createElement("H3"); // Otsikko noisen parametreille:
    h_2.className = "deftext";
    h_2.textContent = "Noise parameters:";
    h_2.setAttribute("data-i18n", "noise-ctrl-noise-param");
    container.appendChild(h_2);
    
    var div2 = document.createElement("DIV");
    div2.className = "flexable";
    container.appendChild(div2);

    var span3 = document.createElement("SPAN");
    span3.className = "form-group";
    div2.appendChild(span3);
    
    var scaleTxt = document.createElement("LABEL"); // scale
    scaleTxt.textContent = "Scale:";
    scaleTxt.setAttribute("data-i18n", "noise-ctrl-scale");
    //container.appendChild(scaleTxt);
    span3.appendChild(scaleTxt);
    var scaleInp = numberBox("input_noiseScale", 100, 0.1, 0.00000001, 10000000, false);
    //container.appendChild(scaleInp);
    span3.appendChild(scaleInp);
    
    var span4 = document.createElement("SPAN");
    span4.className = "form-group";
    div2.appendChild(span4);

    var seedTxt = document.createElement("LABEL"); // seed
    seedTxt.textContent = "Seed:";
    seedTxt.setAttribute("data-i18n", "noise-ctrl-seed");
    //container.appendChild(seedTxt);	
    span4.appendChild(seedTxt);	
    var seedInp = numberBox("input_noiseSeed", 0, 1, 0, 9999999, true);
    //container.appendChild(seedInp);
    span4.appendChild(seedInp);
    
    var span5 = document.createElement("SPAN");
    span5.className = "form-group";
    div2.appendChild(span5);

    var octavesTxt = document.createElement("LABEL"); // oktaavit
    octavesTxt.textContent = "Octaves:";
    octavesTxt.setAttribute("data-i18n", "noise-ctrl-octaves");
    //container.appendChild(octavesTxt);
    span5.appendChild(octavesTxt);
    var octavesInp = numberBox("input_noiseOctaves", 4, 1, 1, 32, true);
    //container.appendChild(octavesInp);
    span5.appendChild(octavesInp);
    
    var span6 = document.createElement("SPAN");
    span6.className = "form-group";
    div2.appendChild(span6);
    
    var persistanceTxt = document.createElement("LABEL"); // persistance
    persistanceTxt.textContent = "Persistence:";
    persistanceTxt.setAttribute("data-i18n", "noise-ctrl-persistence");
    //container.appendChild(persistanceTxt);
    span6.appendChild(persistanceTxt);
    var persistanceInp = numberBox("input_noisePersistance", 0.5, 0.1, 0, 9999, false);
    //container.appendChild(persistanceInp);
    span6.appendChild(persistanceInp);

    var span7 = document.createElement("SPAN");
    span7.className = "form-group";
    div2.appendChild(span7);
    
    var lacunarityTxt = document.createElement("LABEL"); // lacunarity
    lacunarityTxt.textContent = "Lacunarity:";
    lacunarityTxt.setAttribute("data-i18n", "noise-ctrl-lacunarity");
    //container.appendChild(lacunarityTxt);
    span7.appendChild(lacunarityTxt);
    var lacunarityInp = numberBox("input_noiseLacunarity", 2.0, 0.1, 0, 9999, false);
    //container.appendChild(lacunarityInp);
    span7.appendChild(lacunarityInp);
    
    var span8 = document.createElement("SPAN");
    span8.className = "form-group";
    div2.appendChild(span8);
    
    var offsetXTxt = document.createElement("LABEL"); // offset X
    offsetXTxt.textContent = "Offset X:";
    offsetXTxt.setAttribute("data-i18n", "noise-ctrl-offset-x");
    //container.appendChild(offsetXTxt);
    span8.appendChild(offsetXTxt);
    var offsetXInp = numberBox("input_noiseOffsetX", 0, 0.1, -10000000, 10000000, false);
    //container.appendChild(offsetXInp);
    span8.appendChild(offsetXInp);
    
    var span9 = document.createElement("SPAN");
    span9.className = "form-group";
    div2.appendChild(span9);
    
    var offsetYTxt = document.createElement("LABEL"); // offsetY
    offsetYTxt.textContent = "Offset Y:";
    offsetYTxt.setAttribute("data-i18n", "noise-ctrl-offset-y");
    //container.appendChild(offsetYTxt);
    span9.appendChild(offsetYTxt);
    var offsetYInp = numberBox("input_noiseOffsetY", 0, 0.1, -10000000, 10000000, false);
    //container.appendChild(offsetYInp);
    span9.appendChild(offsetYInp);

    var div3 = document.createElement("DIV");
    div3.className = "flexable";
    container.appendChild(div3);
    
    var span10 = document.createElement("SPAN");
    span10.className = "form-group";
    div3.appendChild(span10);

    var randomSeedBtn = document.createElement("BUTTON");
    randomSeedBtn.className = "form-control btn btn-default";
    //randomSeedBtn.textContent = "Random seed";
    randomSeedBtn.appendChild(document.createTextNode("Random seed"));
    randomSeedBtn.setAttribute("data-i18n", "noise-ctrl-btn-random-seed");
    randomSeedBtn.onclick = function(event) {
	rnd_seed();
    }
    //container.appendChild(randomSeedBtn);
    span10.appendChild(randomSeedBtn);
    
    var span11 = document.createElement("SPAN");
    span11.className = "form-group";
    div3.appendChild(span11);

    var randomOffsetsBtn = document.createElement("BUTTON");
    randomOffsetsBtn.className = "form-control btn btn-default";
    //randomOffsetsBtn.textContent = "Random offsets";
    randomOffsetsBtn.appendChild(document.createTextNode("Random offsets"));
    randomOffsetsBtn.setAttribute("data-i18n", "noise-ctrl-random-offsets");
    randomOffsetsBtn.onclick = function(event) {
	rnd_offsets();
    }
    //container.appendChild(randomOffsetsBtn);
    span11.appendChild(randomOffsetsBtn);
    
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
