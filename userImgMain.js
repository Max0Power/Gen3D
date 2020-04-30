/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 14.10.2019, GoldenLayout
 * @version 24.10.2019, React, Zip
 * @version 26.04.2020, jQuery.i18n
 * @version 30.04.2020, React removed
 */

"use strict";

function initiateSite() {
	textures.setSelectOption(0); // ei anna maailman mittakaavassa skaalattavia tekstuureita!
}


/**
 * Piirtaa seka tekstuurin seka 3d mallin kayttajan antamasta kuvasta
 */
function drawTextureAnd3dModelFromUserImg(heights,minmax=[0,1] ) {
	// TEXTUURIN PIIRTO:
	drawTextureFromUserImg(heights,minmax);

	// 3D MALLIN PIIRTO:
	draw3dModelFromUserImg(heights,minmax);
}


/**
 * Piirtaa tekstuurin kayttajan syottamasta kuvasta
 */
function drawTextureFromUserImg(heights,minmax=[0,1]) {
	var selectedTexture = document.getElementById("selectTextureImg").value;
	textures.drawTexture(selectedTexture, heights, minmax);
}


/**
 * Piirtaa pelkan 3d mallin kayttajan syotteista
 */
function draw3dModelFromUserImg(heights, minmax=[0,1]) {
    // Tarvittaessa heights matriisin pienennys
    	var maxSize = parseInt(document.getElementById("input_modelMaxVertices").value, 10);
	//var maxSize = 200; // max size kanvakelle seka 3d mallille
	var pixelsX = heights.length; // monta pikselia korkeuksiisa on
	var pixelsY = heights[0].length;
	// jos pixeleiden maara on suurempaa kuin sallittu maara
	if (pixelsX > maxSize || pixelsY > maxSize) {
		var scale = maxSize / pixelsX; // otetaan skaalaus, jolla skaalataan matriisi, (leveys ja korkeus pysyy samana)
		if (pixelsY > pixelsX) { // jos y pikseleiden maara suurempaa kuin x piksleiden
			scale = maxSize / pixelsY // lasketaan scale korkeus pikseleiden suhteen
		}
		// lasketaan uudet pixelsX ja pixelsY maarat
		pixelsX = Math.floor(scale * pixelsX);
		pixelsY = Math.floor(scale * pixelsY);
		// pienennetaan korkeus matriisia ja haetaan minMaxH siita
		heights = decreaseHeightsMatrix(heights, pixelsX, pixelsY);
	}
	// ------------------------------------------------

	// 3d malli parametrit
	var quadSize = parseFloat(document.getElementById('input_modelQuadSize').value);
	if (isNaN(quadSize)) quadSize = 1.0;
	if (quadSize < 0.1) quadSize = 0.1;
	if (quadSize >1000) quadSize = 1000;
	document.getElementById('input_modelQuadSize').value = quadSize;

	var maxHeight = parseFloat(document.getElementById('input_modelMaxHeight').value);
	if (isNaN(maxHeight)) maxHeight = 1.0;
	if (maxHeight < 0) maxHeight = 0;
	if (maxHeight >10000) maxHeight = 10000;
	document.getElementById('input_modelMaxHeight').value = maxHeight;

	var selectedTexture3D = document.getElementById("selectedTexture3D").value; // valittu tekstuuri 3d mallille

	// heights, heights_minMaxH ,quadSize, max_model_height, texture(int)
	generateMesh(heights, minmax, quadSize, maxHeight, selectedTexture3D);
	drawMesh();
}

var heights;
var minmaxh;

function redraw(callback) {
    callback(heights, minmaxh);
}

/*
 * Luo input kontrollerin, johon kayttaja voi syottaa malliksi luotavan kuvan
 */
function createUserInputImgController() {
    var container = document.createElement("DIV"); // uloin divi
    container.setAttribute("id", "User input");
    container.setAttribute("class", "draggableContainer");
    
    // // // //

    var div1 = container.appendChild(document.createElement("DIV"));
    div1.setAttribute("class", "flexable");

    var span1 = div1.appendChild(document.createElement("SPAN"));
    span1.setAttribute("class", "form-group");
    
    var label1 = span1.appendChild(document.createElement("LABEL"));
    label1.appendChild(document.createTextNode("Supported file formats:"));
    label1.setAttribute("data-i18n", "usr-in-lbl-file-formats");

    span1.appendChild(document.createElement("BR"));

    var p1 = span1.appendChild(document.createElement("P"));
    p1.appendChild(document.createTextNode(".png, .jpg, .jpeg, .gif, .hgt.zip"));
    p1.setAttribute("class", "deftext");
    p1.setAttribute("data-i18n", "usr-in-p-file-formats");

    // // // //

    var span2 = div1.appendChild(document.createElement("SPAN"));
    span2.setAttribute("class", "form-group");

    var label2 = span2.appendChild(document.createElement("LABEL"));
    label2.appendChild(document.createTextNode("File system explorer:"));
    label2.setAttribute("data-i18n", "usr-in-lbl-file-system");

    span2.appendChild(document.createElement("BR"));

    var label21 = span2.appendChild(document.createElement("LABEL"));
    label21.appendChild(document.createTextNode("Choose file"));
    label21.setAttribute("for", "file_input");
    label21.setAttribute("class", "form-control btn btn-default");
    label21.setAttribute("data-i18n", "usr-in-btn-file-formats");

    var input2 = span2.appendChild(document.createElement("INPUT")); // kayttajan syote
    input2.setAttribute("id", "file_input");
    input2.setAttribute("type", "file");

    // kun kayttaja on syottanyt kuvan:
    input2.onchange = function(e) {
	handleUpload(e);
    };

    // // // //
    
    var span3 = container.appendChild(document.createElement("SPAN"));
    span3.setAttribute("class", "form-group");

    var img3 = span3.appendChild(document.createElement("IMG")); // kuva elementti, johon kayttajan syottama kuva asetetaan
    img3.setAttribute("class", "img-center");
    img3.id = "User input";
    img3.setAttribute("src", "");
    img3.onload = function(e) {
	handleLoadedImg(e);
    };

    return draggableUiComponent("User input", [0,0], container);

    // // // //

    function handleUpload(e) {
	// tarkistus
        if (!e.target.files[0]) return;

        const file = e.target.files[0];
        var start = Date.now(); // for message

        if (isFileImage(file)) {
            img3.src = URL.createObjectURL(file); // asetetaan imagelle source

	    // kun kuva on ladattu:
            lueTiedostoImage(file,(data) => {
                heights = data;
                minmaxh = [0,1];

		// generoidaan naytettava tekstuuri ja 3d malli:
                redraw(drawTextureAnd3dModelFromUserImg);
                ready(start); // message
            });
        }

        if (isFileZip(file)) {
            const format = file.type.split('/')[1];
            img3.setAttribute("src", ""); // tyhjä taustakuva

            lueTiedostoZip(file, {name:file.name}, (data) => {
                var select = document.getElementById( 'selectedIntAlg' );
                var intalg = select.options[select.selectedIndex].value;
                heights = data;

                var maxSize = parseInt(document.getElementById("input_modelMaxVertices").value, 10);
                if (data.length > maxSize) {
                    heights = decreaseHeightsMatrix(data, maxSize, maxSize);
                }

                switch (intalg) {
                  case '0':
                    heights = fillWeightedAverage(heights);
                    minmaxh = getHeightsMatrixMinMaxH(heights);

                    redraw(drawTextureAnd3dModelFromUserImg);
                    ready(start); // message
                    break;
                  case '1':
                    heights = fillAllDataHoles(heights);
                    minmaxh = getHeightsMatrixMinMaxH(heights);

                    redraw(drawTextureAnd3dModelFromUserImg);
                    ready(start); // message
                    break;
                  case '2':
                    const worker = new Worker('js/thread.js'); // js/thread.js
                    worker.addEventListener('message', function(e) {
                        heights = e.data;
                        minmaxh = getHeightsMatrixMinMaxH(heights); // modules/DataController.js
                        redraw(drawTextureAnd3dModelFromUserImg);

                        ready(start); // message
                        worker.terminate();
                    });
                    consoleLog("This may take a while...");
                    worker.postMessage(heights);
                    break;
                  case '3':
                    heights = kaanteinenEtaisyys(heights);
                    minmaxh = getHeightsMatrixMinMaxH(heights);
                    redraw(drawTextureAnd3dModelFromUserImg);
                    ready(start); // message
                    break;
                  default:
                    throw new Error("Virhe interpoloinnissa");
                }
            });
        }

        function ready(start) {
            const ms = Date.now() - start;
            const s = Math.floor(ms/1000);
            //console.log("Time elapsed "+ s +" second(s)");
            consoleLog("Time elapsed "+ s +" second(s)");
        }
    }

    function handleLoadedImg(e) {
        var img = e.target;

        // skaalataan kayttajan kuva pienempaan kokoon tarvittaessa:
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

    function isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }

    function isFileZip(file) {
        var zip = file && file['type'] === 'application/x-zip-compressed';
        return file && (zip || file['type'] === 'application/zip');
    }
}
