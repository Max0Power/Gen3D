"use strict";

var userInputComponent = {
    type: 'component',
    id: 'User input',
    isClosable: true,
    componentName: 'User input',
    componentState: {  },
    props: { draggableId: 'User input' }
};

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
    componentState: { text: '3D-model' },
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

var addMenuItem = function( title, component ) {
	var element = document.createElement("BUTTON");
	element.textContent = title;
        element.setAttribute("data-i18n", title);
	element.className = "draggableToggleBtnActive navbar-btn";
	
	var show_hide = true;
	element.onclick = function(event) {
		show_hide = !show_hide;
		if (show_hide) {
			element.className = "draggableToggleBtnActive"; document.getElementById(component.props.draggableId).style.display = 'block'; // show, ikkunan nakyviin
		} else {
			element.className = "draggableToggleBtnInactive";
			document.getElementById(component.props.draggableId).style.display = 'none'; // show, ikkuna pois nakyvista
		}
	}
	
	$( '#tools' ).append( element );
  	myLayout.createDragSource( element, component );
};

$(window).resize(function () {
    myLayout.updateSize();
});

myLayout.on('initialised',function() {
    myLayout.on('itemCreated',function(component) {
        updateLocales(); // js/lang.js
    });

    initiateSite(); // userImgMain.js

    addMenuItem( userInputComponent.componentName, userInputComponent );
    addMenuItem( controller3dComponent.componentName, controller3dComponent );
    addMenuItem( textureViewerComponent.componentName, textureViewerComponent );
    addMenuItem( textureEditorComponent.componentName, textureEditorComponent );
    addMenuItem( modelComponent.componentName, modelComponent );
    addMenuItem( consoleWindowComponent.componentName, consoleWindowComponent );
});

myLayout.init();
