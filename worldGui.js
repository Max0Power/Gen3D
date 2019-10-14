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
    content: [{
        type: 'row',
        content:[{
            type: 'component',
            id: 'Map',
            width: 28,
            height: 100,
            isClosable: false,
            componentName: 'Map',
            componentState: {  }
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

// Map component
myLayout.registerComponent('Map', function( container, componentState) {
    container.getElement().html( $( createMap() ) );
});

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
