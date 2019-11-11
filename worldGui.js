"use strict";

var mapComponent = {
	type: 'react-component',
	isClosable: true,
	title: 'Map',
	width: 28,
	height: 100,
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
			value: '6.25'
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

var layout = {
    settings:{
        showPopoutIcon: false,
        showMaximiseIcon: true,
        showCloseIcon: true,
    },
    labels: {
        close: 'close',
        maximise: 'maximise',
        popout: 'open in new window'
    },
    content: [{
        type: 'row',
        content:[
			mapComponent
			,{
            type: 'column',
            width: 15,
            height: 100,
            content:[{
                type: 'component',
                id: 'Controller 3D',
                isClosable: false,
                componentName: 'Controller 3D',
                componentState: {  }
            },{
                type: 'component',
                id: 'Texture viewer',
                isClosable: false,
                componentName: 'Texture viewer',
                componentState: {  }
            }]
        },{
            type: 'component',
                isClosable: false,
                id: 'Texture editor',
                width: 15,
                height: 100,
                componentName: 'Texture editor',
                componentState: {  }
        },{
            type: 'column',
            content:[{
                type: 'component',
                id: '3D-model',
                width: 42,
                height: 100,
                isClosable: false,
                componentName: '3D-model',
                componentState: { label: '3D-model' }
            }]
        }]
    }]
};

class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(e) {
        generateImageAnd3D();
    }
    
    render() {
        return (
            <React.Fragment>
		<div id={this.props.draggableId} class='draggableContainer flexable'>
                <Leaflet {...this.props} />
                <Input {...this.props.latitude} />
                <Input {...this.props.longitude} />
                <Input {...this.props.size} />
		<span class="form-group">
                  <button class="btn btn-default" onClick={this.handleClick}>Generate</button>
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
        this.handleFix = this.handleFix.bind(this);

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
    
    handleFix() {
		this.mymap.invalidateSize();
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
        
        square = this.clickSquare = rectangle;
    }
    
    render() {
        return(
            <React.Fragment>
            <div id='mapid' onResize={this.handleResize} />

	    <span class="form-group">
            <label for="selectMapView">Map view:</label>
            <select class="form-control" onChange={this.handleChange} value={this.state.mapview} id="selectMapView">
                <option value='default'>Black</option>
                <option value='streets-v11'>Streets</option>
                <option value='light-v10'>Light</option>
                <option value='dark-v10'>Dark</option>
                <option value='outdoors-v11'>Outdoors</option>
                <option value='satellite-v9'>Satellite</option>
                <option value='satellite-streets-v11'>Satellite-Streets</option>
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
        
        this.handleInvalid = this.handleInvalid.bind(this);
	this.handleValid = this.handleValid.bind(this);
	this.handleChange = this.handleChange.bind(this);
    }
    
    render() {
        return (
            <React.Fragment>	
	      <span class="form-group">
              <label for={this.props.id}>{this.props.sign}</label>
              <input class="form-control"
	        onInvalid={this.handleInvalid}
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
                type='number'
                onChange={this.handleChange}>
              </input>
	      </span>
            </React.Fragment>
        );
    }
    
    handleInvalid(e) {	
        e.target.setCustomValidity("");
    }
    
    handleChange(e) {
	e.target.reportValidity();
    }

    handleValid(e) {
	e.target.setCustomValidity("");
	this.setState({value: e.target.value});
    }
}

var myLayout = new GoldenLayout(layout, '#container3D');

// päivitä komponentit ikkunan mukaan
myLayout.on('stateChanged', function() {
    window.dispatchEvent(new Event('resize'));
});

// päivitä komponentit ikkunan mukaan
$(window).resize(function () {
    const container = document.getElementById("container3D");
    myLayout.updateSize(container.clientWidth, container.clientHeight);
});

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

var addMenuItem = function( title, component ) {
	var element = document.createElement("BUTTON");
	element.textContent = title;
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

addMenuItem( mapComponent.title, mapComponent );

myLayout.on('componentCreated',function(component) {
	component.container.on('resize',function() {
		window._leaflet.handleFix();
	});
});

myLayout.on('stackCreated', function(stack) {
            stack.header.controlsContainer.prepend('<li class="lm_collapse_mine" title="collapse pane"><i class="fa fa-arrow-left">&nbsp;</i></li>');
            stack.on('activeContentItemChanged', function(contentItem) {
                if (contentItem.componentName === "test") {
                    contentItem.parent.header.controlsContainer.find('.lm_popout').hide();
                    contentItem.parent.header.controlsContainer.find('.lm_maximise').hide();
                }

                $(".lm_collapse_mine").on("click", function(event) {
                    componentItem.container.setSize(10, componentItem.container.height);
                })
            });
        });

myLayout.init();
