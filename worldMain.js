"use strict"

/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/* Global variables */

var mymap;
var clickSquare;

var isAreaChanged = true;

const areaInputLat = 0.25;
const areaInputLng = 6.50;
					// label			id 			  min     max  step   default value
const areaInputs = [["Latitude: ",  "inputLatitude",  -85,    85,  "any", areaInputLat],
					["Longitude: ", "inputLongitude", -180,   180, "any", areaInputLng],
					["Size: ", 		"inputSize", 	  0.01,   10,  0.01,  0.2]];
                    
//const url = "/db";

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
	createComponents();
    createMap();
    readAreaInputs();
    generateImageAnd3D();
}

/**
 * Creates a map
 */
function createMap() {
	mymap = L.map('mapid').setView([areaInputLat, areaInputLng], 10);
    
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
        minZoom: 1,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);

	mymap.on("click", onMapOneClick);
}

/**
 * Creates components for the site
 */
function createComponents() {
	const ox = 10;
	const oy = 10;
	let x = ox;
	let y = oy;
	const add = 10;

	let viewer3d = document.getElementById("container3D");

	// Creates a map component
	let mapComponent = draggableUiComponent("Map", [ox, oy], document.getElementById("mapid"));
	viewer3d.appendChild(mapComponent);
	let mapComponentContent = mapComponent.firstChild.nextSibling;

	// Area inputs & buttons
    areaInputs.map(args => { addInput(mapComponentContent,...args); });
    let areaSizeInput = document.getElementById("inputSize");
    areaSizeInput.addEventListener("change", (e) => { isAreaChanged = true; });
	addGenerateButton(mapComponentContent);

	mapComponent.style.left = x + 'px';
	x += mapComponent.offsetWidth + add;

	// Controller 3D component
	let controller3dComponent = createInput3dController(ox, oy, generate3DModel, true, false);
	viewer3d.appendChild(controller3dComponent);
    let maxVinput = document.getElementById("input_modelMaxVertices");
    maxVinput.addEventListener("change", (e) => { isAreaChanged = true; });
	
	y += controller3dComponent.offsetHeight + add;
	controller3dComponent.style.left = x + 'px';
	
	// Texture viewer component
	let texturesComponent = createTextureController(ox, oy, generateImage);
	viewer3d.appendChild(texturesComponent);

	texturesComponent.style.top = y + 'px';
	texturesComponent.style.left = x + 'px';
	x += texturesComponent.offsetWidth + add;

	// Texture editor component
	let textureEditorComponent = createTextureEditor(ox, oy);
	// let textureEditorComponent = createTextureEditor((container3D.offsetWidth - 269 - add), oy);
	viewer3d.appendChild(textureEditorComponent);

	x = container3D.offsetWidth - textureEditorComponent.offsetWidth - add;
	textureEditorComponent.style.left = x + 'px';
}

/**
 * Add input
 * @param place   place for the input
 * @param sign    label text
 * @param id      id
 * @param min     min value
 * @param max     max value
 * @param step    step
 * @param value   default value
 */
function addInput(place,sign,id,min,max,step,value) {
	let spot = place.appendChild(document.createElement("span"));
	let label = spot.appendChild(document.createElement("label"));
	let input = spot.appendChild(document.createElement("input"));
	label.appendChild(document.createTextNode(sign));

    const attr = [["id", id], ["name", id], ["for", id], ["min", min], ["max", max],
    			  ["step", step], ["value", value], ["defaultValue", value]];
    attr.map(([k,v]) => { input.setAttribute(k,v); });
    
	input.setAttribute("type", "number");
	input.setAttribute("class", "inputsArea");
	input.addEventListener("change", (e) => { 
		areaInputsListener(e);
		isAreaChanged = true;
	});
}

/**
 * Adds a generate button
 * @param place   DOM element
 */
function addGenerateButton(place) {
	let spot = place.appendChild(document.createElement("span"));
	let button = spot.appendChild(document.createElement("button"));
	button.appendChild(document.createTextNode("Generate"));
    button.addEventListener("click", generateImageAnd3D);
}

 /**
 * Area inputs listener
 * @param e   event
 */
function areaInputsListener(e) {
	const target = e.target.id;
	const value = e.target.value;
    
    if (validateAreaInput(target,value)) {
        e.target.defaultValue = value;
    } else {
        const max = parseFloat(e.target.max);
        const min = parseFloat(e.target.min);
        
        if (value > max) {
            e.target.value = max;
        } else if (value < min) {
            e.target.value = min;
        } else {
            e.target.value = e.target.defaultValue;
        }
        
        isAreaChanged = true;
    }
    
    readAreaInputs();
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

/**
 * Make file objects based on user's input
 */
function makeFiles() {
    /* Selvitetään klikattu alue ja sen koko */
    const input_lat = parseFloat( document.getElementById("inputLatitude").value );
    const input_lng = parseFloat( document.getElementById("inputLongitude").value );
    const size = parseFloat( document.getElementById("inputSize").value ) / 2;
    const max = parseInt ( document.getElementById("input_modelMaxVertices").value);

    /* Lasketaan alueen vasen ylakulma ja oikea alakulma */
	var latlng_1 = [input_lat + size, input_lng - size];
	var latlng_2 = [input_lat - size, input_lng + size];
    
    /* Luodaan file-oliot */
    var files = fileTehtaat(latlng_1, latlng_2, max, alg);
    
	return files;
}

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