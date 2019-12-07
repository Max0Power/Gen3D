"use strict"

var noiseControllerComponent = {
    type: 'component',
    id: 'Noise controller',
    width: 28,
    height: 100,
    isClosable: true,
    componentName: 'Noise controller',
    componentState: {  },
    props: { draggableId: 'Noise controller' }
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
    width: 15,
    height: 100,
    componentName: 'Texture editor',
    componentState: {  },
    props: { draggableId: 'Texture editor' }
}

var modelComponent = {
    type: 'component',
    id: '3D-model',
    width: 42,
    height: 100,
    isClosable: true,
    componentName: '3D-model',
    componentState: { label: '3D-model' },
    props: { draggableId: '3D-model' }
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
    content: [{
        type: 'row',
        content:[
	    noiseControllerComponent
	,{
            type: 'column',
            width: 15,
            height: 100,
            content:[
		controller3dComponent,
		textureViewerComponent
	    ]
        },
	    textureEditorComponent
	,{
            type: 'column',
            content:[
		modelComponent
	    ]
        }]
    }]
};

/*
// käytä evästeen runkoa tai oletusta
var myLayout,savedState = localStorage.getItem('savedState');
if(savedState !== null) {
    myLayout = new GoldenLayout(JSON.parse(savedState));
} else {
    myLayout = new GoldenLayout(layout, '#container3D');
}
*/

var myLayout = new GoldenLayout(layout, '#container3D');

// tallenna muutos evästeisiin ja päivitä ikkuna
myLayout.on('stateChanged', function() {
    /*
    const state = JSON.stringify(myLayout.toConfig());
    localStorage.setItem('savedState', state);
    */
    window.dispatchEvent(new Event('resize'));
});

// päivitä komponentit ikkunan mukaan
$(window).resize(function () {
    const container = document.getElementById("container3D");
    myLayout.updateSize(container.clientWidth, container.clientHeight);
});

// Noise Controller component
myLayout.registerComponent('Noise controller', function( container, componentState) {
    container.getElement().html( $( draggableUiComponent("Noise controller", [0,0], createNoiseController()) ) );
});

// Controller 3D component
myLayout.registerComponent('Controller 3D', function( container, componentState) {
    container.getElement().html( $( createInput3dController(0, 0, draw3dModelFromNoiseInputs) ) );
});

// Texture viewer component
myLayout.registerComponent('Texture viewer', function( container, componentState) {
    container.getElement().html( $( createTextureController(0, 0, drawTextureFromNoiseInputs) ) );
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
                that.style.display = 'block';
            } else {
                element.className = "draggableToggleBtnInactive";
                that.style.display = 'none';
            }
        }
    }

    document.getElementById( 'tools' ).append( element );
    myLayout.createDragSource( element, component );
};

$(document).ready(function() {
    addMenuItem( noiseControllerComponent.componentName, noiseControllerComponent );
    addMenuItem( controller3dComponent.componentName, controller3dComponent );
    addMenuItem( textureViewerComponent.componentName, textureViewerComponent );
    addMenuItem( textureEditorComponent.componentName, textureEditorComponent );
    addMenuItem( modelComponent.componentName, modelComponent );
});

myLayout.init();
