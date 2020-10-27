"use strict";

var mapComponent = {
    type: 'component',
    id: 'Map',
    isClosable: false,
    componentName: 'Map',
    componentState: {  },
    props: { draggableId: 'Map' }
};
	
const latitude = {
    sign: 'Latitude:',
    id: 'inputLatitude',
    name: 'inputLatitude',
    for: 'inputLatitude',
    min: '-85',
    max: '85',
    step: 'any',
    value: '0.25'
};

const longitude = {
    sign: 'Longitude:',
    id: 'inputLongitude',
    name: 'inputLongitude',
    for: 'inputLongitude',
    min: '-180',
    max: '180',
    step: 'any',
    value: '6.5'
};

const size = {
    sign: 'Size:',
    id: 'inputSize',
    name: 'inputSize',
    for: 'inputSize',
    min: '0.01',
    max: '10',
    step: '0.01',
    value: '0.2'
};

var controller3dComponent = {
    type: 'component',
    id: 'Controller 3D',
    isClosable: false,
    componentName: 'Controller 3D',
    componentState: {  },
    props: { draggableId: 'Controller 3D' }
}

var textureViewerComponent = {
    type: 'component',
    id: 'Texture viewer',
    isClosable: false,
    componentName: 'Texture viewer',
    componentState: {  },
    props: { draggableId: 'Texture viewer' }
}

var textureEditorComponent = {
    type: 'component',
    isClosable: false,
    id: 'Texture editor',
    componentName: 'Texture editor',
    componentState: {  },
    props: { draggableId: 'Texture editor' }
}

var modelComponent = {
    type: 'component',
    id: '3D-model',
    isClosable: false,
    componentName: '3D-model',
    componentState: {  },
    props: { draggableId: '3D-model' }
}

var consoleWindowComponent = {
    type: 'component',
    isClosable: false,
    id: 'Console window',
    componentName: 'Console window',
    componentState: {  },
    props: { draggableId: 'Console window' }
}

var layout = {
    settings:{
        showPopoutIcon: false,
        showMaximiseIcon: true,
        showCloseIcon: false
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

var myLayout = new GoldenLayout(layout, '#container3D');

// Map component
myLayout.registerComponent('Map', function( container, componentState) {
    container.getElement().html( $( (new Map()).getContainer() ) );
});

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
    container.getElement().html( init() ); // modules/controller3d.js
});

// Console window component
myLayout.registerComponent('Console window', function( container, componentState) {
    container.getElement().html( $( createConsoleWindow(0,0) ) );
});

$(window).resize(function () {
    myLayout.updateSize();
});

myLayout.init();
