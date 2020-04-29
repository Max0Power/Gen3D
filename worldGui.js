"use strict";

var mapComponent = {
	type: 'react-component',
	isClosable: true,
	title: 'Map',
	component: 'Map',
	props: {
		draggableId: 'Map',
		latitude: {
			sign: 'Latitude:',
			id: 'inputLatitude',
			name: 'inputLatitude',
			for: 'inputLatitude',
			min: '-85',
			max: '85',
			step: 'any',
			value: '0.25'
		},
		longitude: {
			sign: 'Longitude:',
			id: 'inputLongitude',
			name: 'inputLongitude',
			for: 'inputLongitude',
			min: '-180',
			max: '180',
			step: 'any',
			value: '6.5'
		},
		size: {
			sign: 'Size:',
			id: 'inputSize',
			name: 'inputSize',
			for: 'inputSize',
			min: '0.01',
			max: '10',
			step: '0.01',
			value: '0.2'
		}
	}
}

var controller3dComponent = {
    type: 'component',
    id: 'Controller 3D',
    isClosable: true,
    componentName: 'Controller 3D',
    componentState: {  },
    props: { draggableId: 'Controller 3D' }
}

var textureViewerComponent = {
    type: 'component',
    id: 'Texture viewer',
    isClosable: true,
    componentName: 'Texture viewer',
    componentState: {  },
    props: { draggableId: 'Texture viewer' }
}

var textureEditorComponent = {
    type: 'component',
    isClosable: true,
    id: 'Texture editor',
    componentName: 'Texture editor',
    componentState: {  },
    props: { draggableId: 'Texture editor' }
}

var modelComponent = {
    type: 'component',
    id: '3D-model',
    isClosable: true,
    componentName: '3D-model',
    componentState: { label: '3D-model' },
    props: { draggableId: '3D-model' }
}

var consoleWindowComponent = {
    type: 'component',
    isClosable: true,
    id: 'Console window',
    componentName: 'Console window',
    componentState: {  },
    props: { draggableId: 'Console window' }
}

var layout = {
    settings:{
        showPopoutIcon: false,
        showMaximiseIcon: true,
        showCloseIcon: true
    },
    labels: {
        close: 'close',
        maximise: 'maximise',
        popout: 'open in new window'
    },
    dimensions: {
        borderWidth: 8,
        headerHeight: 40
    },
    content: [{
        type: 'row',
        content:[{
	    type: 'stack',
	    width: 25,
	    height: 100,
	    content: [
		mapComponent
	    ]}
	,{
	    type: 'stack',
	    width: 50,
	    height: 100,
	    content: [
		modelComponent
	    ]}
	,{
	    type: 'column',
	    width: 25,
	    height: 100,
            content:[{
		type: 'stack',
		content: [
		    controller3dComponent,
		    textureEditorComponent
		]}
	    ,{
		type: 'stack',
		content: [
		    consoleWindowComponent,
		    textureViewerComponent
		]
	    }]
        }]
    }]
};

class MapComponent extends React.Component {
    constructor(props) {        
	super(props);
        this.handleClick = this.handleClick.bind(this);

	this.leaflet = React.createRef();
    }

    componentDidMount() {
	const lat = parseFloat(document.getElementById( 'inputLatitude' ).value);
	const lng = parseFloat(document.getElementById( 'inputLongitude' ).value);
	const size = parseFloat(document.getElementById( 'inputSize' ).value);
	if (lat && lng && size) {
	    window._leaflet.makeSquareFromClicks(lat,lng,size);
	}
    }
    
    handleClick(e) {
        generateImageAnd3D();
    }
    
    render() {
        return (
            <React.Fragment>
		<div id={this.props.draggableId} class='draggableContainer flexable'>
	        <Leaflet {...this.props} ref={this.leaflet}/>
                <Input {...this.props.latitude} />
                <Input {...this.props.longitude} />
                <Input {...this.props.size} />
		<span class="form-group flexable">
                  <button class="form-control btn btn-default" onClick={this.handleClick} data-i18n="map-btn-gen">Generate</button>
		</span>
		</div>
            </React.Fragment>
        );
    }
}

class Leaflet extends React.Component {
    constructor(props) {
        super(props);

        this.clickSquare = null;
        this.mymap = null;
        this.state = ({mapview: 'dark'});
        
        this.onMapOneClick = this.onMapOneClick.bind(this);
        this.makeSquareFromClicks = this.makeSquareFromClicks.bind(this);
        this.handleChange = this.handleChange.bind(this);

	window._leaflet = this;
    }
    
    handleChange(e) {
        const layerId = e.target.value;
        this.setState({mapview: layerId});
        
        if (this.style) this.style.remove();
        if (layerId !== 'default') {
            this.style = L.mapbox.styleLayer('mapbox://styles/mapbox/' + layerId).addTo(this.mymap);
        }
    }
    
    componentDidMount() {
        L.mapbox.accessToken = 'pk.eyJ1IjoiaGFiYSIsImEiOiJjazF5eXptbG4wcTl1M21sODFwbWVnMDI1In0.RgLBJb1OFvgsqYfnREA7ig';
        var map = this.mymap = L.mapbox.map(ReactDOM.findDOMNode(this), 'mapbox.dark', {
            minZoom: 1,
            maxZoom: 18,
            zoom: 10,
            center: [0.25,6.5],
            SameSite: 'None',
            attributionControl: true,
            reuseTiles: true
        });
        map.on('click', this.onMapOneClick);
        map.fitWorld();

	function outputsize() {
	    map.invalidateSize();
	}
	const leaflet = document.querySelector('#mapid');
	new ResizeObserver(outputsize).observe(leaflet);
	//new ResizeObserver(outputsize).observe(ReactDOM.findDOMNode(this));
    }
    
    onMapOneClick(e) {
        const click = e.latlng;
        updateAreaInputs(click.lat, click.lng);
        
        const args = readAreaInputs();
        this.makeSquareFromClicks(...args);
    }

    makeSquareFromClicks(lat,lng,size) {
        const map = this.mymap;
        var square = this.clickSquare;
        
        if (square) square.remove();
        
        size = size / 2.0;
        var bounds = [[lat + size, lng + size], [lat - size, lng - size]];
        // add rectangle passing bounds and some basic styles
        const rectangle = L.rectangle(bounds, {color: '#2196F3', weight: 1, type: 'fill'}).addTo(map);
        
        // asetetaan neli�n raahaus
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
        
        square = this.clickSquare = rectangle;
    }
    
    render() {
        return(
            <React.Fragment>
            <div id='mapid' />

	    <span class="form-group">
            <label for="selectMapView" data-i18n="map-lbl-view">Map view:</label>
            <select class="form-control btn-default" onChange={this.handleChange} value={this.state.mapview} id="selectMapView">
                <option value='default' data-i18n="map-opt-black">Black</option>
                <option value='streets-v11' data-i18n="map-opt-streets">Streets</option>
                <option value='light-v10' data-i18n="map-opt-light">Light</option>
                <option value='dark-v10' data-i18n="map-opt-dark">Dark</option>
                <option value='outdoors-v11' data-i18n="map-opt-outdoors">Outdoors</option>
                <option value='satellite-v9' data-i18n="map-opt-satellite">Satellite</option>
                <option value='satellite-streets-v11' data-i18n="map-opt-satellite-streets">Satellite-Streets</option>
            </select>
	    </span>
            </React.Fragment>
        );
    }
}

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: this.props.value};
        
	this.handleValid = this.handleValid.bind(this);
	this.handleChange = this.handleChange.bind(this);
    }
    
    render() {
        return (
            <React.Fragment>	
	      <span class="form-group">
              <label for={this.props.id} data-i18n={this.props.sign}>{this.props.sign}</label>
              <input class="form-control btn-default"
	        onInput={this.handleValid}
	        onChange={this.handleChange}
	        id={this.props.id}
                name={this.props.id}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                value={this.state.value}
                defaultValue={this.props.value}
	        required
                type='number'>
              </input>
	      </span>
            </React.Fragment>
        );
    }
    
    handleChange(e) {
	e.target.reportValidity();
    }

    handleValid(e) {
	this.setState({value: e.target.value});
	
	const lat = parseFloat(document.getElementById( 'inputLatitude' ).value);
	const lng = parseFloat(document.getElementById( 'inputLongitude' ).value);
	const size = parseFloat(document.getElementById( 'inputSize' ).value);
	if (lat && lng && size) {
	    window._leaflet.makeSquareFromClicks(lat,lng,size);
	}
    }
}

var myLayout = new GoldenLayout(layout, '#container3D');

// Map component
myLayout.registerComponent('Map', MapComponent);

// Controller 3D component
myLayout.registerComponent('Controller 3D', function( container, componentState) {
    container.getElement().html( $( createInput3dController(0, 0, generate3DModel, true, true) ) );
});

// Texture viewer component
myLayout.registerComponent('Texture viewer', function( container, componentState) {
    container.getElement().html( $( createTextureController(0, 0, generateImage) ) );
});

// Texture editor component
myLayout.registerComponent('Texture editor', function( container, componentState) {
    container.getElement().html( $( createTextureEditor(0, 0) ) );
});

// 3D-model
myLayout.registerComponent('3D-model', function( container, componentState) {
    container.getElement().html( init() );
});

// Console window component
myLayout.registerComponent('Console window', function( container, componentState) {
    container.getElement().html( $( createConsoleWindow(0,0) ) );
});

var addMenuItem = function( title, component ) {
    var element = document.createElement("BUTTON");
    element.textContent = title;
    element.setAttribute("data-i18n", title);
    element.className = "draggableToggleBtnActive";

    var show_hide = true;
    element.onclick = function(event) {
	show_hide = !show_hide;
	var that = document.getElementById(component.props.draggableId);
	
	if (that) {
	    if (show_hide) {
		element.className = "draggableToggleBtnActive";
		that.style.display = 'block'; // show, ikkunan nakyviin
	    } else {
		element.className = "draggableToggleBtnInactive";
		that.style.display = 'none'; // show, ikkuna pois nakyvista
	    }
	}		
    }
    
    $( '#tools' ).append( element );
    myLayout.createDragSource( element, component );
};

$(document).ready(function() {
    addMenuItem( mapComponent.title, mapComponent );
    addMenuItem( controller3dComponent.componentName, controller3dComponent );
    addMenuItem( textureViewerComponent.componentName, textureViewerComponent );
    addMenuItem( textureEditorComponent.componentName, textureEditorComponent );
    addMenuItem( modelComponent.componentName, modelComponent );
    addMenuItem( consoleWindowComponent.componentName, consoleWindowComponent );
});

$(window).resize(function () {
    myLayout.updateSize();
});

myLayout.on('initialised',function() {
    myLayout.on('itemCreated',function(component) {
	updateLocales();
    });
    consoleLog("Hello, welcome to Gen3D!", 'cmd-hello');
});

myLayout.init();
