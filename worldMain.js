/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 14.10.2019, GoldenLayout
 * @version 19.10.2019, React
 * @version 23.04.2020, jQuery.i18n
 */

"use strict"

/**
 * Read area inputs
 */
function readAreaInputs() {
	let latInput = document.getElementById("inputLatitude");
	let lngInput = document.getElementById("inputLongitude");
	let sizeInput = document.getElementById("inputSize");
	let lat = parseFloat(latInput.value);
	let lng = parseFloat(lngInput.value);
	let size = parseFloat(sizeInput.value);
    
    //var files = fileTehtaat(...getLatlngs());
    //console.log(files.map(x => x.getFileName()));
    
    return [lat,lng,size];
}

/**
 * Update area inputs
 * @param latLng   coordinates
 */
function updateAreaInputs(lat,lng) {
	document.getElementById("inputLatitude").value = lat;
	document.getElementById("inputLongitude").value = lng;
}

/**
 * Generates both texture image and 3D model from files
 * Former option 2
 */
function generateImageAnd3D(e) {
    generate([makeGrayscale,make3DModel]);
}

/**
 * Generates 3D model from files
 * Former option 1
 */
function generate3DModel() {
    generate([make3DModel]);
}

/**
 * Generates texture image from files
 * Former option 0
 */
function generateImage() {
    generate([makeGrayscale]);
}

/**
 * Generates file objects
 * @param callbacks		array of callback functions
 */
function generate(callbacks) {
        // käynnistä ajastin
        var start = Date.now();

        var files = fileTehtaat(...getLatlngs());
        var dataStruct = new DataStruct();
        dataStruct.setCallbacks([function(arg) {
            var result = [arg.heights,arg.minMaxH];
            callbacks.map(f => f(...result));
            // 3D mallin koko muuttuu vasta piirron jälkeen
            window.dispatchEvent(new Event('resize'));
            
            // lopeta ajastin
            const ms = Date.now() - start;
	    const s = Math.floor(ms/1000);
            console.log("Time elapsed "+ s +" second(s)");
        }]);
        
        dataStruct.execute(files);
}

/**
 * Makes a texture image
 */
function makeGrayscale(heights, minmax) {
    const tile = document.getElementById("selectTextureImg").value;
    textures.drawTexture(tile, heights, minmax);
}

/**
 * Creates a 3D model
 */
function make3DModel(heights, minmax) {
    const quadSize = document.getElementById("input_modelQuadSize").value;
    const maxHeight = document.getElementById("input_modelMaxHeight").value;
    const texture = document.getElementById("selectedTexture3D").value;

    generateMesh(heights, minmax, quadSize, maxHeight, texture);
    drawMesh();
}

/*
 * Ei käytössä!
 * Make file objects based on user's input
 */
/*
function makeFiles() {
    // Selvitetään klikattu alue ja sen koko
    const input_lat = parseFloat( document.getElementById("inputLatitude").value );
    const input_lng = parseFloat( document.getElementById("inputLongitude").value );
    const size = parseFloat( document.getElementById("inputSize").value ) / 2;
    const max = parseInt ( document.getElementById("input_modelMaxVertices").value);

    // Lasketaan alueen vasen ylakulma ja oikea alakulma
	var latlng_1 = [input_lat + size, input_lng - size];
	var latlng_2 = [input_lat - size, input_lng + size];
    
    // Luodaan file-oliot
    var files = fileTehtaat(latlng_1, latlng_2, max, alg);
    
	return files;
}
*/

function getLatlngs() {
    // Selvitetään klikattu alue ja sen koko
    const input_lat = parseFloat( document.getElementById("inputLatitude").value );
    const input_lng = parseFloat( document.getElementById("inputLongitude").value );
    const size = parseFloat( document.getElementById("inputSize").value ) / 2;
    const max = parseInt ( document.getElementById("input_modelMaxVertices").value);

    // Lasketaan alueen vasen ylakulma ja oikea alakulma
	var latlng_1 = [input_lat + size, input_lng - size];
	var latlng_2 = [input_lat - size, input_lng + size];
    
    return [latlng_1,latlng_2,max];
}
