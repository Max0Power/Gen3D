﻿/**
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
 * Kaikki kartat käyttävät samaa tietorakennetta,
 * joten myös yksi tai useampi controller 3d
 * käyttää sitä samaa, mikä vähentää monimutkaisuutta!
 */
var datastruct = new DataStruct(); // modules/DataStruct.js

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

	this.initiateSite();
    }

    getContainer() {
	return this.container;
    }

    getElementValue(element) {
	return parseFloat( element.value );
    }

    setElementValue(element,value) {
	element.value = value;
	var event = new Event('input');
	element.dispatchEvent(event);
    }

    getValidity() {
	return this.inputLatitude.checkValidity() &&
	    this.inputLongitude.checkValidity() &&
	    this.inputSize.checkValidity();
    }
    
    /**
     * Read area inputs
     */
    readAreaInputs() {
	const lat = this.getElementValue(this.inputLatitude);
	const lng = this.getElementValue(this.inputLongitude);
	const size = this.getElementValue(this.inputSize) / 2.0;
	
	return [lat,lng,size];
    }

    /**
     * Update area inputs
     * @param latLng   coordinates
     */
    updateAreaInputs(lat,lng) {
	this.setElementValue(this.inputLatitude,lat);
	this.setElementValue(this.inputLongitude,lng);
    }

    /**
     * Generates both texture image and 3D model from files
     * Former option 2
     */
    generateImageAnd3D() {
	this.generateMap([makeGrayscale,make3DModel]); // 
    }

    /**
     * Generates file objects
     * @param callbacks		array of callback functions
     */
    generateMap(callbacks) {
        var start = Date.now(); // start timer

	const inputs = this.readAreaInputs();
        var files = fileTehtaat(...getLatlngs(...inputs));

        datastruct.setCallback( (arg) => {
            var result = [arg.heights,arg.minMaxH];
            callbacks.map(f => f(...result));
            
            const ms = Date.now() - start; // stop timer
	    const s = Math.floor(ms/1000); // time elapsed

	    consoleLog("Time elapsed "+ s +" second(s)");
        }).execute(files);
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

	this.map.on('click', (e) => {
	    const click = e.latlng;
	    this.updateAreaInputs(click.lat, click.lng);

	    const inputs = this.readAreaInputs();
	    this.makeSquareFromClicks(...inputs);
	});
	//map.fitWorld();
	
	new ResizeObserver( () => {
	    this.map.invalidateSize();
	}).observe(this.container);
	
	const inputs = this.readAreaInputs();
	this.makeSquareFromClicks(...inputs);
    }

    makeSquareFromClicks(lat,lng,size) {
	if (this.clicksquare) this.clicksquare.remove();
	
	var bounds = [[lat + size, lng + size], [lat - size, lng - size]];

	// add rectangle passing bounds and some basic styles
	const rectangle = L.rectangle(bounds, {color: getColor(this), weight: 1, type: 'fill'}).addTo(this.map);
	
	// asetetaan neliön raahaus
	rectangle.on('mousedown', () => {
	    this.map.dragging.disable();
	    this.map.on('mousemove', (e) => {
		lat = e.latlng.lat;
		lng = e.latlng.lng;

		this.updateAreaInputs(lat,lng);
		
		bounds = [[lat + size, lng + size], [lat - size, lng - size]];
		rectangle.setBounds(bounds);
		rectangle.setStyle({ color: getColor(this) });
	    });
	});
	rectangle.on('mouseup', (e) =>{
	    this.map.dragging.enable();
	    this.map.removeEventListener('mousemove');
	});
	
	this.clicksquare = rectangle;

	function getColor(that) {
	    return that.getValidity() ? 'dodgerblue' : 'deeppink';
	}
    }
    
    createMap() {
	this.container = document.createElement("DIV");
	this.container.setAttribute("id", "Map");
	this.container.setAttribute("class", "flexable");
	//fitToContainer(this.container); // poista kun css!

	var div = this.container.appendChild(document.createElement("DIV"));
	div.setAttribute("class", "form-group");
	fitToContainer(div); // vain tämä kun css!

	// // // // Leaflet // // // //

	this.mapid = div.appendChild(document.createElement("DIV"));
	//this.mapid.setAttribute("id", "mapid");
	//fitToContainer(this.mapid); // poista kun css!

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

	select.onchange = (e) => {
	    const layerId = e.target.value;
            select.setAttribute("value", layerId);
	    
	    if (this.style) this.style.remove();
            if (layerId !== 'dark-v10') {
		this.style = L.mapbox.styleLayer('mapbox://styles/mapbox/' + layerId).addTo(this.map);
            }
	}
	
	const options = [["Dark","dark-v10","map-opt-dark"],
			 ["Light","light-v10","map-opt-light"],
			 ["Streets","streets-v11","map-opt-streets"],
			 ["Outdoors","outdoors-v11","map-opt-outdoors"],
			 ["Satellite","satellite-v9","map-opt-satellite"],
			 ["Satellite-Streets","satellite-streets-v11","map-opt-satellite-streets"]];

	for (var i = 0; i < options.length; i++) {
	    var option = select.appendChild(document.createElement("OPTION"));
	    option.appendChild(document.createTextNode(options[i][0]));
	    option.setAttribute("value", options[i][1]);
	    option.setAttribute("data-i18n", options[i][2]);
	}
	
	this.inputLatitude = this.createInput(this.container,latitude);
	this.inputLongitude = this.createInput(this.container,longitude);
	this.inputSize = this.createInput(this.container,size);

	var span = this.container.appendChild(document.createElement("SPAN"));
	span.setAttribute("class", "form-group flexable");

	var button = span.appendChild(document.createElement("BUTTON"));
	button.appendChild(document.createTextNode("Generate"));
	button.setAttribute("class", "form-control btn btn-default");
	button.setAttribute("data-i18n", "map-btn-gen");
	
	button.onclick = () => {
	    this.generateImageAnd3D();
	}
	
	this.inputLatitude.addEventListener('input', () => {
	    button.disabled = !this.getValidity();
	});
	this.inputLongitude.addEventListener('input', () => {
	    button.disabled = !this.getValidity();
	});
	this.inputSize.addEventListener('input', () => {
	    button.disabled = !this.getValidity();
	});    

	return draggableUiComponent("Map", this.container);
    }

    createInput(container,props) {
	var span = container.appendChild(document.createElement("SPAN"));
	span.setAttribute("class", "form-group");
	
	var label = span.appendChild(document.createElement("LABEL"));
	label.appendChild(document.createTextNode(props.sign));
	label.setAttribute("for", props.id);
	label.setAttribute("data-i18n", props.sign);
	
	var input = span.appendChild(document.createElement("INPUT"));
	input.setAttribute("class", "form-control btn-default");

	input.oninput = (e) => {
	    input.value = e.target.value;
	    
	    const [lat,lng,size] = this.readAreaInputs();

	    if (!(isNaN(lat) || isNaN(lng) || isNaN(size))) {
		this.makeSquareFromClicks(lat,lng,size);
	    } else if (this.clicksquare) {
		this.clicksquare.remove();
	    }
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

	return input;
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

    datastruct.setCallback( (arg) => {
        var result = [arg.heights,arg.minMaxH];
        callbacks.map(f => f(...result));
        // 3D mallin koko muuttuu vasta piirron jälkeen
        window.dispatchEvent(new Event('resize'));
        
        // lopeta ajastin
        const ms = Date.now() - start;
	const s = Math.floor(ms/1000);
        //console.log("Time elapsed "+ s +" second(s)");
	consoleLog("Time elapsed "+ s +" second(s)");
    }).execute();
}

/**
 * Makes a texture image
 */
function makeGrayscale(heights, minmax) {
    const tile = document.getElementById("selectTextureImg").value;
    textures.drawTexture(tile, heights, minmax); // modules/textures.js
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
