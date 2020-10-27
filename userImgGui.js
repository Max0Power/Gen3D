"use strict";

var userInputComponent = {
    type: 'component',
    id: 'User input',
    isClosable: false,
    componentName: 'User input',
    componentState: {  },
    props: { draggableId: 'User input' }
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
    componentState: { text: '3D-model' },
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
                userInputComponent
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

// User input component
myLayout.registerComponent('User input', function( container, componentState) {
    container.getElement().html( $( createUserInputImgController() ) );
});


// Controller 3D component
myLayout.registerComponent('Controller 3D', function( container, componentState) {
    container.getElement().html( $( createInput3dController(0, 0, function() {
	redraw(draw3dModelFromUserImg);
    }, true, true) ) )
});

// Texture viewer component
myLayout.registerComponent('Texture viewer', function( container, componentState) {
    container.getElement().html( $( createTextureController(0, 0, () => {
	redraw(drawTextureFromUserImg);
    }) ) );
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

$(window).resize(function () {
    myLayout.updateSize();
});

myLayout.on('initialised',function() {
    initiateSite(); // userImgMain.js
});

myLayout.init();
