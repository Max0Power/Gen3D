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

class Map {
    constructor() {
	this.map;
	this.clicksquare;
	this.style;
	this.mapid;
	
	this.inputLatitude;
	this.inputLongitude;
	this.inputSize;

	this.container = this.createMap();
	this.datastruct = new DataStruct(); // TODO

	this.initiateSite();
    }

    getContainer() {
	return this.container;
    }

    /**
     * Read area inputs
     */
    readAreaInputs() {
	let lat = parseFloat(this.inputLatitude.value);
	let lng = parseFloat(this.inputLongitude.value);
	let size = parseFloat(this.inputSize.value);
	
	return [lat,lng,size];
    }

    /**
     * Update area inputs
     * @param latLng   coordinates
     */
    updateAreaInputs(lat,lng) {
	this.inputLatitude.value = lat;
	this.inputLongitude.value = lng;
    }

    /**
     * Generates both texture image and 3D model from files
     * Former option 2
     */
    generateImageAnd3D() {
	this.generate2([makeGrayscale,make3DModel]);
    }

    /**
     * Generates file objects
     * @param callbacks		array of callback functions
     */
    generate2(callbacks) {
        var start = Date.now(); // start timer

	const lat = parseFloat( this.inputLatitude.value );
	const lng = parseFloat( this.inputLongitude.value );
	const size = parseFloat( this.inputSize.value ) / 2.0;

        var files = fileTehtaat(...getLatlngs(lat,lng,size));
        this.datastruct = new DataStruct(); // TODO tarkista onko uudet
        this.datastruct.setCallbacks([function(arg) {
            var result = [arg.heights,arg.minMaxH];
            callbacks.map(f => f(...result));

            // 3D mallin koko muuttuu vasta piirron jälkeen
            window.dispatchEvent(new Event('resize')); // TODO redraw suoraan
            
            const ms = Date.now() - start; // stop timer
	    const s = Math.floor(ms/1000); // time elapsed

	    consoleLog("Time elapsed "+ s +" second(s)"); // TODO
        }]);
        
        this.datastruct.execute(files);
    }

    initiateSite() {
	L.mapbox.accessToken = 'pk.eyJ1IjoiaGFiYSIsImEiOiJjazF5eXptbG4wcTl1M21sODFwbWVnMDI1In0.RgLBJb1OFvgsqYfnREA7ig';
	this.map = L.mapbox.map(this.mapid, 'mapbox.dark', {
	    minZoom: 1,
	    maxZoom: 18,
	    zoom: 2,
	    center: [0.25,6.5],
	    SameSite: 'None',
	    attributionControl: true,
	    reuseTiles: true
	});

	const that = this; // TODO bind?
	this.map.on('click', function(e) {
	    const click = e.latlng;
	    that.updateAreaInputs(click.lat, click.lng);
	    
	    const args = that.readAreaInputs();
	    that.makeSquareFromClicks(...args);
	});
	//map.fitWorld();
	
	new ResizeObserver(function() {
	    that.map.invalidateSize();
	}).observe(this.container);
	
	const lat = parseFloat( this.inputLatitude.value );
	const lng = parseFloat( this.inputLongitude.value );
	const size = parseFloat( this.inputSize.value );
	if (lat && lng && size) {
	    this.makeSquareFromClicks(lat,lng,size);
	}
    }

    makeSquareFromClicks(lat,lng,size) {
	if (this.clicksquare) this.clicksquare.remove();
	
	size = size / 2.0;
	var bounds = [[lat + size, lng + size], [lat - size, lng - size]];
	// add rectangle passing bounds and some basic styles
	const rectangle = L.rectangle(bounds, {color: '#2196F3', weight: 1, type: 'fill'}).addTo(this.map);
	
	// asetetaan neliön raahaus
	rectangle.on('mousedown', () => {
	    this.map.dragging.disable();
	    this.map.on('mousemove', (e) => {
		lat = e.latlng.lat;
		lng = e.latlng.lng;
		bounds = [[lat + size, lng + size], [lat - size, lng - size]];
		rectangle.setBounds(bounds);
	    });
	});
	rectangle.on('mouseup', (e) =>{
	    this.map.dragging.enable();
	    this.map.removeEventListener('mousemove');
	});
	
	this.clicksquare = rectangle;
    }
    
    createMap() {
	this.container = document.createElement("DIV");
	this.container.setAttribute("id", "Map");
	this.container.setAttribute("class", "flexable");
	fitToContainer(this.container); // poista kun css!

	var div = this.container.appendChild(document.createElement("DIV"));
	div.setAttribute("class", "form-group");
	fitToContainer(div); // vain tämä kun css!

	// // // // Leaflet // // // //

	this.mapid = div.appendChild(document.createElement("DIV"));
	//this.mapid.setAttribute("id", "mapid");
	fitToContainer(this.mapid); // poista kun css!

	// // // // Leaflet // // // //

	var span = this.container.appendChild(document.createElement("SPAN"));
	span.setAttribute("class", "form-group");
	
	var label = span.appendChild(document.createElement("LABEL"));
	label.appendChild(document.createTextNode("Map view:"));
	label.setAttribute("data-i18n", "map-lbl-view");
	label.setAttribute("for", "selectMapView");
	
	var select = span.appendChild(document.createElement("SELECT"));
	select.setAttribute("class", "form-control btn-default");
	select.setAttribute("value", "dark"); // default value
	select.onchange = function(e) {
	    const layerId = e.target.value;
            select.setAttribute("value", layerId);
	    
	    if (this.style) this.style.remove();
            if (layerId !== 'default') {
		this.style = L.mapbox.styleLayer('mapbox://styles/mapbox/' + layerId).addTo(this.map);
            }
	}
	
	const options = [["Black","default","map-opt-black"],
			 ["Streets","streets-v11","map-opt-streets"],
			 ["Light","light-v10","map-opt-light"],
			 ["Dark","dark-v10","map-opt-dark"],
			 ["Outdoors","outdoors-v11","map-opt-outdoors"],
			 ["Satellite","satellite-v9","map-opt-satellite"],
			 ["Satellite-Streets","satellite-streets-v11","map-opt-satellite-streets"]];

	for (var i = 0; i < options.length; i++) {
	    var option = select.appendChild(document.createElement("OPTION"));
	    option.appendChild(document.createTextNode(options[i][0]));
	    option.setAttribute("value", options[i][1]);
	    option.setAttribute("data-i18n", options[i][2]);
	}
	
	var res0 = this.createInput(mapComponent.props.latitude);
	var res1 = this.createInput(mapComponent.props.longitude);
	var res2 = this.createInput(mapComponent.props.size);

	this.container.appendChild(res0[0]);
	this.inputLatitude = res0[1];

	this.container.appendChild(res1[0]);
	this.inputLongitude = res1[1];
	
	this.container.appendChild(res2[0]);
	this.inputSize = res2[1];

	var span = this.container.appendChild(document.createElement("SPAN"));
	span.setAttribute("class", "form-group flexable");

	var button = span.appendChild(document.createElement("BUTTON"));
	button.appendChild(document.createTextNode("Generate"));
	button.setAttribute("class", "form-control btn btn-default");
	button.setAttribute("data-i18n", "map-btn-gen");

	const that = this;
	button.onclick = function() {
	    that.generateImageAnd3D();
	};

	return draggableUiComponent("Map", [0,0], this.container);
    }

    createInput(props) {
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
	    const lat = parseFloat( this.inputLatitude.value );
	    const lng = parseFloat( this.inputLongitude.value );
	    const size = parseFloat( this.inputSize.value );
	    if (lat && lng && size) {
		this.makeSquareFromClicks(lat,lng,size);
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

	return [span,input];
    }
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
 * @param callbacksarray of callback functions
 */
function generate(callbacks) {
    // käynnistä ajastin
    var start = Date.now();

    const input_lat = parseFloat( document.getElementById("inputLatitude").value );
    const input_lng = parseFloat( document.getElementById("inputLongitude").value );
    const size = parseFloat( document.getElementById("inputSize").value ) / 2;

    var files = fileTehtaat(...getLatlngs(input_lat,input_lng,size));
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

function getLatlngs(input_lat,input_lng,size) {
    // Selvitetään klikattu alue ja sen koko
    const max = parseInt ( document.getElementById("input_modelMaxVertices").value);

    // Lasketaan alueen vasen ylakulma ja oikea alakulma
    var latlng_1 = [input_lat + size, input_lng - size];
    var latlng_2 = [input_lat - size, input_lng + size];
    
    return [latlng_1,latlng_2,max];
}
