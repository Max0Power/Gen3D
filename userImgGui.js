"use strict"

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
            id: 'User input',
            title: 'User input',
            width: 28,
            height: 100,
            isClosable: false,
            component: 'User input',
            props: { }
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

class UserInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src: ''};
        
        this.heights;
        this.minmaxh;
        
        this.handleUpload = this.handleUpload.bind(this);
        this.handleLoadedImg = this.handleLoadedImg.bind(this);
        this.redraw = this.redraw.bind(this);
        
        window.fileInput = this;
    }
    
    render() {
        return (
            <React.Fragment>
                <label>Supported fileformats: </label>
                <br />
                <p>png, jpg, gif, hgt.zip</p>
                <input type='file' onChange={this.handleUpload} />
                <img id={this.props.id} src={this.state.src} onLoad={this.handleLoadedImg} />
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
                that.heights = fillAllDataHoles(data);
                that.minmaxh = getHeightsMatrixMinMaxH(that.heights);
                
                drawTextureAnd3dModelFromUserImg(that.heights, that.minmaxh);
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

// tallenna muutos evästeisiin ja päivitä ikkuna
myLayout.on('stateChanged', function() {
    window.dispatchEvent(new Event('resize'));
});

// päivitä komponentit ikkunan mukaan
$(window).resize(function () {
    const container = document.getElementById("container3D");
    myLayout.updateSize(container.clientWidth, container.clientHeight);
});

// User input component
myLayout.registerComponent('User input', UserInput);

// Controller 3D component
myLayout.registerComponent('Controller 3D', function( container, componentState) {
    container.getElement().html( $( createInput3dController(0, 0, () => {
        window.fileInput.redraw(draw3dModelFromUserImg);
    }), true, false) )
});

// Texture viewer component
myLayout.registerComponent('Texture viewer', function( container, componentState) {
    container.getElement().html( $( createTextureController(0, 0, () => {
        window.fileInput.redraw(drawTextureFromUserImg);
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

myLayout.init();
