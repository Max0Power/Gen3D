var layout = {
    settings:{
        showPopoutIcon: false,
        showMaximiseIcon: false,
        showCloseIcon: false
    },
    labels: {
        close: 'close',
        maximise: 'maximise',
        popout: 'open in new window'
    },
    content: [{
        type: 'row',
        content:[{
            type: 'react-component',
            id: 'Map',
            title: 'Map',
            width: 28,
            height: 100,
            isClosable: false,
            component: 'Map',
            props: {
                latitude: {
                    sign: 'Latitude:',
                    id: 'inputLatitude',
                    name: 'inputLatitude',
                    for: 'inputLatitude',
                    min: '-85',
                    max: '85',
                    step: 'any',
                    value: '0.25',
                    defaultValue: '0.25'
                },
                longitude: {
                    sign: 'Longitude:',
                    id: 'inputLongitude',
                    name: 'inputLongitude',
                    for: 'inputLongitude',
                    min: '-180',
                    max: '180',
                    step: 'any',
                    value: '6.25',
                    defaultValue: '6.25'
                },
                size: {
                    sign: 'Size:',
                    id: 'inputSize',
                    name: 'inputSize',
                    for: 'inputSize',
                    min: '0.01',
                    max: '10',
                    step: '0.01',
                    value: '0.2',
                    defaultValue: '0.2'
                }
            }
        },{
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
        this.state = {file: ''};
        
        this.handleClick = this.handleClick.bind(this);
        this.readFile = this.readFile.bind(this);
    }
    
    componentDidMount() {
        //draggableUiComponent("Map", [0, 0], ReactDOM.findDOMNode(this));
    }
    
    handleClick(e) {
        generateImageAnd3D();
    }
    
    readFile(e) {
        lueTiedostoZip(e.target.files[0],null,function (heights) {
            var t = fillAllDataHoles(heights);
            var minmax = getHeightsMatrixMinMaxH(t);
            makeGrayscale(t,minmax);
        });
    }
    
    render() {
        return (
            <React.Fragment>
                <Leaflet {...this.props} />
                <br />
                <Input {...this.props.latitude} />
                <br />
                <Input {...this.props.longitude} />
                <br />
                <Input {...this.props.size} />
                <button onClick={this.handleClick}>Generate</button>
                <br />
                <label>hgt.zip: (raw)</label>
                <br />
                <input type='file' onChange={this.readFile} />
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
        
        /*
        let map = this.mymap = L.map(ReactDOM.findDOMNode(this), {
            minZoom: 1,
            maxZoom: 18,
            zoom: 10,
            center: [0.25,6.5],
            SameSite: 'Secure',
            layers: [
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    id: 'mapbox.streets',
                }),
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                })
            ],
            attributionControl: true
        });
        map.on('click', this.onMapOneClick);
        map.fitWorld();
        */
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
            <div id='mapid' />
            <label>Map view: </label>
            <br />
            <select onChange={this.handleChange} value={this.state.mapview}>
                <option value='default'>Black</option>
                <option value='streets-v11'>Streets</option>
                <option value='light-v10'>Light</option>
                <option value='dark-v10'>Dark</option>
                <option value='outdoors-v11'>Outdoors</option>
                <option value='satellite-v9'>Satellite</option>
                <option value='satellite-streets-v11'>Satellite-Streets</option>
            </select>
            <button onClick={this.handleFix}>Fix</button>
            </React.Fragment>
        );
    }
}

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            defaultValue: this.props.defaultValue
        };
        
        this.handleChange = this.handleChange.bind(this);
    }
    
    render() {
        return (
            <React.Fragment>
            <label>{this.props.sign}</label>
            <br />
            <input id={this.props.id}
                name={this.props.id}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                value={this.state.value}
                defaultValue={this.state.defaultValue}
                type='number'
                class='inputsArea'
                onChange={this.handleChange}>
            </input>
            </React.Fragment>
        );
    }
    
    handleChange(e) {
        // TODO: paranna tuntumaa
        const target = document.getElementById(e.target.id);
        
        if (target.reportValidity()) {
            this.setState({value: e.target.value});
            this.setState({defaultValue: e.target.value});
        } else {
            if (e.target.value > this.props.max) {
                this.setState({value: this.props.max});
            } else if (e.target.value < this.props.min) {
                this.setState({value: this.props.min});
            }
        }
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
    container.getElement().html( $( createInput3dController(0, 0, generate3DModel, true, false) ) );
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

myLayout.init();
