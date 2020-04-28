"use strict";

var userInputComponent = {
    type: 'react-component',
    title: 'User input',
    id: 'User input',
    component: 'User input',
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
        content: [{
	    type: 'stack',
	    width: 25,
	    height: 100,
	    content: [
		userInputComponent,
		textureViewerComponent
	    ]}
	,{
            type: 'stack',
            width: 50,
            height: 100,
            content: [
		modelComponent,
		consoleWindowComponent
	    ]}
	,{
            type: 'stack',
	    width: 25,
	    height: 100,
            content: [
		controller3dComponent,
	        textureEditorComponent
	    ]}
        ]}
    ]
};

class UserInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src: ''};
        
        this.heights;
        this.minmaxh;
        
        this.handleUpload = this.handleUpload.bind(this);
        this.handleLoadedImg = this.handleLoadedImg.bind(this);
        this.redraw = this.redraw.bind(this);
        
        window._fileInput = this;
    }
    
    render() {
        return (
            <React.Fragment>
		<div id={this.props.draggableId} class="draggableContainer">
		<div class="flexable">
		<span class="form-group">
                <label data-i18n="usr-in-lbl-file-formats">Supported file formats: </label>
                <br />
                <p class="deftext" data-i18n="usr-in-p-file-formats">.png, .jpg, .jpeg, .gif, .hgt.zip</p>
		</span>
		<span class="form-group">
		<label data-i18n="usr-in-lbl-file-system">File system explorer: </label>
		<label for="file_input" class="form-control btn btn-default" data-i18n="usr-in-btn-file-formats">Choose file</label>
                <input id="file_input" type="file" onChange={this.handleUpload}/>
		</span>
		</div>
		<span class="form-group">
                <img class="img-center" id={this.props.id} src={this.state.src} onLoad={this.handleLoadedImg} />
		</span>
		</div>
            </React.Fragment>
        );
    }
    
    handleUpload(e) {
        if (!e.target.files[0]) return;
        
        const that = this;
        const file = this.file = e.target.files[0];
        
        if (this.isFileImage(file)) {
            this.setState({src: URL.createObjectURL(file)});
            
            lueTiedostoImage(file,(data) => {
                that.heights = data;
                that.minmaxh = [0,1];
                
                drawTextureAnd3dModelFromUserImg(that.heights, that.minmaxh);
            });
        }
        
        if (this.isFileZip(file)) {
            const format = file.type.split('/')[1];
            this.setState({src: 'images/icon/'+format+'.svg'});
            
            lueTiedostoZip(file, null, (data) => {
		var select = document.getElementById( 'selectedIntAlg' );
		var intalg = select.options[select.selectedIndex].value;
		that.heights = data;
		
		var maxSize = parseInt(document.getElementById("input_modelMaxVertices").value, 10);
		if (data.length > maxSize) {
		    that.heights = decreaseHeightsMatrix(data, maxSize, maxSize);
		}
		
		switch (intalg) {
		  case '0':
		    that.heights = fillWeightedAverage(that.heights);
                    that.minmaxh = getHeightsMatrixMinMaxH(that.heights);
		    
		    drawTextureAnd3dModelFromUserImg(that.heights, that.minmaxh);
		    break;
		  case '1':
		    that.heights = fillAllDataHoles(that.heights);
                    that.minmaxh = getHeightsMatrixMinMaxH(that.heights);
		    
		    drawTextureAnd3dModelFromUserImg(that.heights, that.minmaxh);
		    break;
		  case '2':
		    const worker = new Worker('js/thread.js'); // js/thread.js
		    worker.addEventListener('message', function(e) {
			that.heights = e.data;
			that.minmaxh = getHeightsMatrixMinMaxH(that.heights); // modules/DataController.js
			drawTextureAnd3dModelFromUserImg(that.heights,that.minmaxh);
			worker.terminate();
		    });
		    worker.postMessage(that.heights);
		    break;
		  case '3':
		    that.heights = kaanteinenEtaisyys(that.heights);
                    that.minmaxh = getHeightsMatrixMinMaxH(that.heights);
		    
		    drawTextureAnd3dModelFromUserImg(that.heights, that.minmaxh);
		    break;
		  default:
		    throw new Error("Virhe interpoloinnissa");
		}
            });
        }
    }
    
    handleLoadedImg(e) {
        var img = e.target;
        
        // skaalataan kuva pieneksi
        var maxSize = 200;
        var pixelsX = img.width;
        var pixelsY = img.height;
        if (pixelsX > maxSize || pixelsY > maxSize) {
            var scale = maxSize / pixelsX; // otetaan skaalaus, jolla skaalataan matriisi, (leveys ja korkeus pysyy samana)
            if (pixelsY > pixelsX) { // jos y pikseleiden maara suurempaa kuin x piksleiden
                scale = maxSize / pixelsY // lasketaan scale korkeus pikseleiden suhteen
            }
            // lasketaan uudet pixelsX ja pixelsY maarat
            pixelsX = Math.floor(scale * pixelsX);
            pixelsY = Math.floor(scale * pixelsY);
        }
        img.width = pixelsX;
        img.height = pixelsY;
    }
    
    redraw(callback) {
        callback(this.heights,this.minmaxh);
    }
    
    isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }
    
    isFileZip(file) {
        return file && file['type'] === 'application/x-zip-compressed';
    }
}

var myLayout = new GoldenLayout(layout, '#container3D');

// User input component
myLayout.registerComponent('User input', UserInput);

// Controller 3D component
myLayout.registerComponent('Controller 3D', function( container, componentState) {
    container.getElement().html( $( createInput3dController(0, 0, function() {
        window._fileInput.redraw(draw3dModelFromUserImg);
    }, true, true) ) )
});

// Texture viewer component
myLayout.registerComponent('Texture viewer', function( container, componentState) {
    container.getElement().html( $( createTextureController(0, 0, () => {
        window._fileInput.redraw(drawTextureFromUserImg);
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
	element.className = "draggableToggleBtnActive";
	
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

$(document).ready(function() {
    addMenuItem( userInputComponent.title, userInputComponent );
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
});

myLayout.init();
