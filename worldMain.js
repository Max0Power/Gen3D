"use strict"

/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/* Global variables */

var mymap; // leafletin kartta
let mapComponent; // leaflet-goldenlayout purkka
var clickSquare; // kartan neliö

// onko kartalla liikuttu
var isAreaChanged = true;

//                   label          id                min     max  step   default value
const areaInputs = [["Latitude: ",  "inputLatitude",  -85,    85,  "any", 0.25],
                    ["Longitude: ", "inputLongitude", -180,   180, "any", 6.50],
                    ["Size: ",      "inputSize",      0.01,   10,  0.01,  0.2]];

/**
 * Loads start page
 */
window.onload = function() {
    initiateSite();
}

/**
 * Adds components, leaflet map and generates a 3D model
 * and texture image of the default area
 */
function initiateSite() {
    createLeafletMap(mapComponent);
    
    let areaSizeInput = document.getElementById("inputSize");
    areaSizeInput.addEventListener("change", (e) => {
        isAreaChanged = true;
    });
    
    let maxVinput = document.getElementById("input_modelMaxVertices");
    maxVinput.addEventListener("change", (e) => {
        isAreaChanged = true;
    });
    
    readAreaInputs();
    generateImageAnd3D();
}

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
    
	makeSquareFromClicks(lat,lng,size,mymap);
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
 * Validates area inputs
 * @returns valid or not
 */
function validateAreaInput(target,value) {
	return value ? document.getElementById(target).reportValidity() : false;
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
    if (isAreaChanged) {
        isAreaChanged = false;
		
		const latlngs = getLatlngs();
		
		const lat_1 = ["lat_1",latlngs[0][0]];
		const lng_1 = ["lng_1",latlngs[0][1]];
		
		const lat_2 = ["lat_2",latlngs[1][0]];
		const lng_2 = ["lng_2",latlngs[1][1]];
		
		const max = ["max",latlngs[2]];
		
		
        var files = fileTehtaat([lat_1[1],lng_1[1]],[lat_2[1],lng_2[1]],max[1]);
        
        var dataStruct = new DataStruct();
        dataStruct.setCallbacks([function(arg) {
            var result = [arg.heights,arg.minMaxH];
            callbacks.map(f => f(...result));
            // 3D mallin koko muuttuu vasta piirron jälkeen
            window.dispatchEvent(new Event('resize'));
        }]);
        
        dataStruct.execute(files);
    }
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
    /* Selvitetään klikattu alue ja sen koko */
    const input_lat = parseFloat( document.getElementById("inputLatitude").value );
    const input_lng = parseFloat( document.getElementById("inputLongitude").value );
    const size = parseFloat( document.getElementById("inputSize").value ) / 2;
    const max = parseInt ( document.getElementById("input_modelMaxVertices").value);

    /* Lasketaan alueen vasen ylakulma ja oikea alakulma */
	var latlng_1 = [input_lat + size, input_lng - size];
	var latlng_2 = [input_lat - size, input_lng + size];
    
    return [latlng_1,latlng_2,max];
}

/**
 * Listener for one click to map
 * @param e   event
 */
function onMapOneClick(e) {
    isAreaChanged = true;
    
	let click = e.latlng;
	updateAreaInputs(click.lat, click.lng);
	readAreaInputs();
}

/**
 * Makes a square based on the clicks. Has to make corrections since originally
 * user makes a rectangle.
 * @param lat    latitude
 * @param lng    longitude
 * @param size   size
 * @param map    leaflet map
 */
function makeSquareFromClicks(lat,lng,size,map) {
	if (clickSquare) clickSquare.remove();
    
    lat = validate(lat,lng)[0];
    lng = validate(lat,lng)[1];
    
	size = size / 2.0;
	var bounds = [[lat + size, lng + size], [lat - size, lng - size]];
	// add rectangle passing bounds and some basic styles
    const rectangle = L.rectangle(bounds, {color: "red", weight: 1}).addTo(map);
    
    /* Asetetaan neliön raahaus */
    rectangle.on('mousedown', () => {
        map.dragging.disable();
        map.on('mousemove', (e) => {
			lat = validate(e.latlng.lat,e.latlng.lng)[0];
			lng = validate(e.latlng.lat,e.latlng.lng)[1];
			bounds = [[lat + size, lng + size], [lat - size, lng - size]];
            rectangle.setBounds(bounds);
        });
    }); 
    rectangle.on('mouseup', (e) =>{
        map.dragging.enable();
        map.removeEventListener('mousemove');
    });
    
    clickSquare = rectangle;
}

/**
 * Validates the coordinates
 * @param lat   latitude
 * @param lng   longitude
 * @returns [lat,lng]
 */
function validate(lat,lng) {
    if (lat < -85) lat = -85;
    if (85 < lat) lat = 85;
    
    if (lng < -180) lng = -180;
    if (180 < lng) lng = 180;

    let latInput = document.getElementById("inputLatitude");
	let lngInput = document.getElementById("inputLongitude");
	latInput.value = lat;
	lngInput.value = lng;
    
    return [lat,lng];
}
