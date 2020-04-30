/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 14.10.2019, GoldenLayout
 * @version 19.10.2019, React
 * @version 23.04.2020, jQuery.i18n
 * @version 30.04.2020, React removed
 */

"use strict";

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
            //console.log("Time elapsed "+ s +" second(s)");
	    consoleLog("Time elapsed "+ s +" second(s)");
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

var mymap;
var clickSquare;
var style;

function initiateSite() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiaGFiYSIsImEiOiJjazF5eXptbG4wcTl1M21sODFwbWVnMDI1In0.RgLBJb1OFvgsqYfnREA7ig';
    const mapid = document.getElementById("mapid");
    var map = mymap = L.mapbox.map(mapid, 'mapbox.dark', {
	minZoom: 1,
	maxZoom: 18,
	zoom: 2, // 10
	center: [0.25,6.5],
	SameSite: 'None',
	attributionControl: true,
	reuseTiles: true
    });
    map.on('click', function(e) {
	const click = e.latlng;
	updateAreaInputs(click.lat, click.lng);
	
	const args = readAreaInputs();
	makeSquareFromClicks(...args);
    });
    //map.fitWorld();
    
    function outputsize() {
	map.invalidateSize();
    }
    new ResizeObserver(outputsize).observe(mapid);

    const lat = parseFloat(document.getElementById( 'inputLatitude' ).value);
    const lng = parseFloat(document.getElementById( 'inputLongitude' ).value);
    const size = parseFloat(document.getElementById( 'inputSize' ).value);
    if (lat && lng && size) {
	makeSquareFromClicks(lat,lng,size); // leaflet
    }
};

function makeSquareFromClicks(lat,lng,size) {
    const map = mymap;
    var square = clickSquare;
    
    if (square) square.remove();
    
    size = size / 2.0;
    var bounds = [[lat + size, lng + size], [lat - size, lng - size]];
    // add rectangle passing bounds and some basic styles
    const rectangle = L.rectangle(bounds, {color: '#2196F3', weight: 1, type: 'fill'}).addTo(map);
    
    // asetetaan neliön raahaus
    rectangle.on('mousedown', () => {
	map.dragging.disable();
	map.on('mousemove', (e) => {
	    lat = e.latlng.lat;
	    lng = e.latlng.lng;
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

function createMap() {
    var container = document.createElement("DIV");
    container.setAttribute("id", "Map");
    container.setAttribute("class", "flexable");
    fitToContainer(container); // poista kun css!

    let leaflet = container.appendChild(createLeaflet());
    fitToContainer(leaflet); // vain tämä kun css!

    // // // //

    var span1 = container.appendChild(document.createElement("SPAN"));
    span1.setAttribute("class", "form-group");
    
    var label1 = span1.appendChild(document.createElement("LABEL"));
    label1.appendChild(document.createTextNode("Map view:"));
    label1.setAttribute("data-i18n", "map-lbl-view");
    label1.setAttribute("for", "selectMapView");
    
    var select1 = span1.appendChild(document.createElement("SELECT"));
    select1.setAttribute("class", "form-control btn-default");
    select1.setAttribute("id", "selectMapView");
    select1.setAttribute("value", "dark");
    select1.onchange = function(e) {
	const layerId = e.target.value;
        select1.setAttribute("value", layerId);
	
	if (style) style.remove();
        if (layerId !== 'default') {
	    style = L.mapbox.styleLayer('mapbox://styles/mapbox/' + layerId).addTo(mymap);
        }
    }
    
    var option1 = select1.appendChild(document.createElement("OPTION"));
    option1.appendChild(document.createTextNode("Black"));
    option1.setAttribute("value", "default");
    option1.setAttribute("data-i18n", "map-opt-black");
    
    var option2 = select1.appendChild(document.createElement("OPTION"));
    option2.appendChild(document.createTextNode("Streets"));
    option2.setAttribute("value", "streets-v11");
    option2.setAttribute("data-i18n", "map-opt-streets");

    var option3 = select1.appendChild(document.createElement("OPTION"));
    option3.appendChild(document.createTextNode("Light"));
    option3.setAttribute("value", "light-v10");
    option3.setAttribute("data-i18n", "map-opt-light");

    var option4 = select1.appendChild(document.createElement("OPTION"));
    option4.appendChild(document.createTextNode("Dark"));
    option4.setAttribute("value", "dark-v10");
    option4.setAttribute("data-i18n", "map-opt-dark");

    var option5 = select1.appendChild(document.createElement("OPTION"));
    option5.appendChild(document.createTextNode("Outdoors"));
    option5.setAttribute("value", "outdoors-v11");
    option5.setAttribute("data-i18n", "map-opt-outdoors");

    var option6 = select1.appendChild(document.createElement("OPTION"));
    option6.appendChild(document.createTextNode("Satellite"));
    option6.setAttribute("value", "satellite-v9");
    option6.setAttribute("data-i18n", "map-opt-satellite");

    var option6 = select1.appendChild(document.createElement("OPTION"));
    option6.appendChild(document.createTextNode("Satellite-Streets"));
    option6.setAttribute("value", "satellite-streets-v11");
    option6.setAttribute("data-i18n", "map-opt-satellite-streets");

    // // // //
    
    var blackbox = container.appendChild(document.createElement("DIV"));

    let latitude = container.appendChild(createInput(mapComponent.props.latitude));
    let longitude = container.appendChild(createInput(mapComponent.props.longitude));
    let size = container.appendChild(createInput(mapComponent.props.size));

    var span = container.appendChild(document.createElement("SPAN"));
    span.setAttribute("class", "form-group flexable");

    var button = span.appendChild(document.createElement("BUTTON"));
    button.appendChild(document.createTextNode("Generate"));
    button.setAttribute("class", "form-control btn btn-default");
    button.setAttribute("data-i18n", "map-btn-gen");
    button.onclick = function() {
	generateImageAnd3D();
    };

    return draggableUiComponent("Map", [0,0], container);

    function createLeaflet() {
	var div = document.createElement("DIV");
	div.setAttribute("class", "form-group");

	var mapid = div.appendChild(document.createElement("DIV"));
	mapid.setAttribute("id", "mapid");
	fitToContainer(mapid); // poista kun css!

        return div;
    }

    function createInput(props) {
	var span = document.createElement("SPAN");
	span.setAttribute("class", "form-group");
	
	var label = span.appendChild(document.createElement("LABEL"));
	label.appendChild(document.createTextNode(props.sign));
	label.setAttribute("for", props.id);
	label.setAttribute("data-i18n", props.sign);
	
	var input = span.appendChild(document.createElement("INPUT"));
	input.setAttribute("class", "form-control btn-default");
	input.oninput = function(e) {
	    input.setAttribute("value", e.target.value);
	    
            const lat = parseFloat(document.getElementById( 'inputLatitude' ).value);
            const lng = parseFloat(document.getElementById( 'inputLongitude' ).value);
            const size = parseFloat(document.getElementById( 'inputSize' ).value);
            if (lat && lng && size) {
		makeSquareFromClicks(lat,lng,size);
            }
	}
	input.onchange = function(e) {
	    e.target.reportValidity();
	}
	input.setAttribute("id", props.id);	
	input.setAttribute("name", props.id);
	input.setAttribute("min", props.min);
	input.setAttribute("max", props.max);
	input.setAttribute("step", props.step);
	input.setAttribute("value", props.value);
	input.setAttribute("defaultValue", props.value);
	input.setAttribute("required", ""); // true
	input.setAttribute("type", "number");

	return span;
    }
}
