/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

"use strict";

/**
 * Luo tekstuuri editor komponentin ja lisaa sen samalla raahattavaan ikkunaan.
 */
function createTextureEditor(posLeft, posTop) {
    
    var textureNames = textures.getAllTextureNamesForImg();
    var selectedTextureIndex = 0;
    
    var gradientColor = textures.getGradientColorFromName(textureNames[selectedTextureIndex]);
    var isBetween0And1 = textures.getIsBetween0And1FromName(textureNames[selectedTextureIndex]);
    
    var knobs = gradientColor.getRangeValues();
    var colors = gradientColor.getColors();
    
    var notMovableIndex1 = 0;
    var notMovableIndex2 = colors.length - 1;
    
    var rangeMin = 0;
    var rangeMax = 1;
    if (!isBetween0And1) {
	rangeMin = 0;
	rangeMax = 10000;
    }
    
    var knobWidth = 8;
    var selectedKnobIndex = 0;
    
    // ELEMENTTIEN LUONTI || ELEMENTTIEN LUONTI || ELEMENTTIEN LUONTI || ELEMENTTIEN LUONTI
    
    var all = document.createElement("DIV");

    var container = document.createElement("DIV");
    container.className = "flexable";
    all.appendChild(container);
    
    var span1 = document.createElement("SPAN");
    span1.className = "form-group";

    //var label1 = container.appendChild(document.createElement("label"));
    var label1 = span1.appendChild(document.createElement("label"));
    label1.appendChild(document.createTextNode("Texture:"));

    //var selectDivTexture = document.createElement("DIV");
    //container.appendChild(selectDivTexture);
    var selectElmTexture = document.createElement("SELECT");
    selectElmTexture.className = "form-control btn-default";
    //selectDivTexture.appendChild(selectElmTexture);
    span1.appendChild(selectElmTexture);
    container.appendChild(span1);

    var span11 = document.createElement("SPAN");
    span11.className = "form-group";

    var addTextureBtn = document.createElement("BUTTON");
    addTextureBtn.className = "form-control btn-default";
    addTextureBtn.appendChild(document.createTextNode("New texture"));
    //selectDivTexture.appendChild(addTextureBtn);
    span11.appendChild(addTextureBtn);
    container.appendChild(span11);
    
    // ------------------------------ Range to world scale
    
    var span2 = document.createElement("SPAN");
    span2.className = "form-group flexable";
    
    //var isScaledToWorldDiv = document.createElement("DIV");
    //isScaledToWorldDiv.className = "form-check";
    //container.appendChild(isScaledToWorldDiv);
    var isScaledToWorldLabel = document.createElement("LABEL");
    isScaledToWorldLabel.id = "crange";
    //isScaledToWorldLabel.setAttribute("for", "worldScale");
    isScaledToWorldLabel.appendChild(document.createTextNode("Range to world scale: "));
    //isScaledToWorldDiv.appendChild(isScaledToWorldLabel);
    span2.appendChild(isScaledToWorldLabel);
    var isScaledToWorldInput = document.createElement("INPUT");
    isScaledToWorldInput.className = "form-control";
    isScaledToWorldInput.setAttribute("type", "checkbox");
    //isScaledToWorldDiv.appendChild(isScaledToWorldInput);
    span2.appendChild(isScaledToWorldInput);
    container.appendChild(span2);
    
    // ------------------------------ Slider
    
    var canvasSpan = document.createElement("SPAN");
    canvasSpan.className = "form-group flexable";

    var canvasDiv = document.createElement("DIV");
    canvasDiv.id = "cslider";
    //canvasDiv.style.marginTop = "10px";
    //canvasDiv.style.marginBottom = "10px";
    //container.appendChild(canvasDiv);
    canvasSpan.appendChild(canvasDiv);
    container.appendChild(canvasSpan);
    var canvas = document.createElement("CANVAS");
    var ctx = canvas.getContext("2d");
    canvas.width= 255;
    canvas.height = 20;
    canvasDiv.appendChild(canvas);
    
    var sliderArea = [knobWidth/2, canvas.width - (knobWidth/2)];
    
    // ------------------------------ AddColorPane

    var inputDiv = document.createElement("SPAN");
    inputDiv.className = "form-group";
    
    //var selectDivColor = document.createElement("DIV");
    //selectDivColor.className = "form-group";
    //inputDiv.appendChild(selectDivColor);
    var selectElmColor = document.createElement("SELECT");
    selectElmColor.className = "form-control btn-default";
    //selectDivColor.appendChild(selectElmColor);
    inputDiv.appendChild(selectElmColor);
    container.appendChild(inputDiv);

    var inputDiv2 = document.createElement("SPAN");
    inputDiv2.className = "form-group";

    var addColorBtn = document.createElement("BUTTON");
    addColorBtn.className = "form-control btn-default";
    addColorBtn.appendChild(document.createTextNode("Add"));
    //selectDivColor.appendChild(addColorBtn);
    inputDiv2.appendChild(addColorBtn);
    container.appendChild(inputDiv2);

    var inputDiv3 = document.createElement("SPAN");
    inputDiv3.className = "form-group";

    var removeColorBtn = document.createElement("BUTTON");
    removeColorBtn.className = "form-control btn btn-default";
    removeColorBtn.appendChild(document.createTextNode("Remove"));
    //selectDivColor.appendChild(removeColorBtn);
    inputDiv3.appendChild(removeColorBtn);
    container.appendChild(inputDiv3);
    
    var inputDiv4 = document.createElement("SPAN");
    inputDiv4.className = "form-group";

    var inputboxRange = document.createElement("INPUT");
    inputboxRange.id = "inputrange";
    inputboxRange.type = "number";
    inputboxRange.step = "any";
    inputboxRange.min = 0;
    inputboxRange.max = 1;
    inputboxRange.required = true;
    inputboxRange.oninput = function(e) {
        e.target.reportValidity();
    }
    inputboxRange.className = "form-control btn-default";
    inputboxRange.value = 0;
    //inputDiv.appendChild(inputboxRange);
    inputDiv4.appendChild(inputboxRange);
    container.appendChild(inputDiv4);
    
    // ------------------------------ Color RGB
    
    var span3 = document.createElement("SPAN");
    span3.className = "form-group";

    //var label2 = container.appendChild(document.createElement("label"));
    var label2 = span3.appendChild(document.createElement("label"));
    label2.appendChild(document.createTextNode("Color RGB: "));
    
    //var inputDiv2 = document.createElement("DIV");
    //container.appendChild(inputDiv2);
    var inputboxColorR = document.createElement("INPUT");
    inputboxColorR.type = "number";
    inputboxColorR.step = 1;
    inputboxColorR.min = 0;
    inputboxColorR.max = 255;
    inputboxColorR.required = true;
    inputboxColorR.oninput = function(e) {
        e.target.reportValidity();
    }
    inputboxColorR.className = "rgbInputBox form-control btn-default"
    //inputDiv2.appendChild(inputboxColorR);
    span3.appendChild(inputboxColorR);
    container.appendChild(span3);

    var span4 = document.createElement("SPAN");
    span4.className = "form-group";
    
    //var labelComma1 = inputDiv2.appendChild(document.createElement("label"));
    //var labelComma1 = span3.appendChild(document.createElement("label"));
    //labelComma1.appendChild(document.createTextNode(","));
    var inputboxColorG = document.createElement("INPUT");
    inputboxColorG.type = "number";
    inputboxColorG.step = 1;
    inputboxColorG.min = 0;
    inputboxColorG.max = 255;
    inputboxColorG.required = true;
    inputboxColorG.oninput = function(e) {
        e.target.reportValidity();
    }
    inputboxColorG.className = "rgbInputBox form-control btn-default";
    //inputDiv2.appendChild(inputboxColorG);
    span4.appendChild(inputboxColorG);
    container.appendChild(span4);

    var span5 = document.createElement("SPAN");
    span5.className = "form-group";

    //var labelComma2 = inputDiv2.appendChild(document.createElement("label"));
    //var labelComma2 = span3.appendChild(document.createElement("label"));
    //labelComma2.appendChild(document.createTextNode(","));
    var inputboxColorB = document.createElement("INPUT");
    inputboxColorB.type = "number";
    inputboxColorB.step = 1;
    inputboxColorB.min = 0;
    inputboxColorB.max = 255;
    inputboxColorB.required = true;
    inputboxColorB.oninput = function(e) {
        e.target.reportValidity();
    }
    inputboxColorB.className = "rgbInputBox form-control btn-default";
    //inputDiv2.appendChild(inputboxColorB);
    span5.appendChild(inputboxColorB);
    container.appendChild(span5);
    
    // ------------------------------ Color Picker

    var cspan = document.createElement("SPAN");
    cspan.className = "form-group flexable";
    //container.appendChild(colorpicker_create("colpic", [255,255,20], colors[selectedKnobIndex], onColorChanged));
    cspan.appendChild(colorpicker_create("colpic", [255,255,20], colors[selectedKnobIndex], onColorChanged));
    all.appendChild(cspan);
	
    // ONCLICK JA ONCHANGE TAPAHTUMAT || ONCLICK JA ONCHANGE TAPAHTUMAT || ONCLICK JA ONCHANGE TAPAHTUMAT
	
	selectElmTexture.onchange = function(event) { // tekstuurin vaihto
		gradientColor.sort();
		selectedTextureIndex = this.selectedIndex;
		
		gradientColor = textures.getGradientColorFromName(textureNames[selectedTextureIndex]);
		isBetween0And1 = textures.getIsBetween0And1FromName(textureNames[selectedTextureIndex]);
		rangeMin = 0;
		rangeMax = 1;
		if (!isBetween0And1) {
			rangeMin = 0;
			rangeMax = 10000;
		}
		
		knobs = gradientColor.getRangeValues();
		colors = gradientColor.getColors();
		
		notMovableIndex1 = 0;
		notMovableIndex2 = colors.length - 1;
		
		selectedKnobIndex = 0;
		inputboxRange.value = knobs[selectedKnobIndex];
		setRemoveButton();
		setIsScaledToWorld();
		updateColorSelection();
		updateColorSlider();
		setColorRGBInputs();
		colorpicker_setColor("colpic", colors[selectedKnobIndex], onColorChanged);
	};
	
	addTextureBtn.onclick = function(event) {
		textures.addDefaultCustomTexture();
		textureNames = textures.getAllTextureNamesForImg();
		
		selectedTextureIndex = textureNames.length - 1;
		
		gradientColor = textures.getGradientColorFromName(textureNames[selectedTextureIndex]);
		isBetween0And1 = textures.getIsBetween0And1FromName(textureNames[selectedTextureIndex]);
		
		knobs = gradientColor.getRangeValues();
		colors = gradientColor.getColors();
		
		notMovableIndex1 = 0;
		notMovableIndex2 = colors.length - 1;
		
		rangeMin = 0;
		rangeMax = 1;
		
		selectedKnobIndex = 0;
		
		setIsScaledToWorld();
		setRemoveButton();
		updateTextureSelection();
		update3dAndImageTextureOptions();
		selectElmTexture.selectedIndex = selectedTextureIndex;
		updateColorSelection();
		updateColorSlider();	
		setColorRGBInputs();
		colorpicker_setColor("colpic", colors[selectedKnobIndex], onColorChanged);
	};
	
	isScaledToWorldInput.onclick = function(event) {
		if (!this.checked) {
			textures.setIsValueBetween0And1(textures.getIndexFromName(textureNames[selectedTextureIndex]), true);
			isBetween0And1 = true;
			rangeMin = 0;
			rangeMax = 1;
			for (var i = 0; i < knobs.length; i++) {
				knobs[i] = knobs[i] / 10000;
			}
			
		}else {
			textures.setIsValueBetween0And1(textures.getIndexFromName(textureNames[selectedTextureIndex]), false);
			isBetween0And1 = false;
			rangeMin = 0;
			rangeMax = 10000;
			for (var i = 0; i < knobs.length; i++) {
				knobs[i] = knobs[i] * 10000;
			}
		}
		
		update3dAndImageTextureOptions();
		inputboxRange.value = knobs[selectedKnobIndex];
	};
	
	canvas.onclick = function(event) {
		var clickX = event.clientX - canvas.getBoundingClientRect().left; // tallennetaan klikkaukset
		//var clickY = event.clientY - canvas.getBoundingClientRect().top;		
		var updatePlace = true;
		
		for (var i = 0; i < knobs.length; i++) {
			if (Math.abs(clickX - knobValToClick(knobs[i])) <= 8) {
				
				if (selectedKnobIndex != i) updatePlace = false;
				selectedKnobIndex = i;
				i = knobs.length + 1;
				selectElmColor.selectedIndex = selectedKnobIndex;
			}
		}
		
		if (selectedKnobIndex == notMovableIndex1 || selectedKnobIndex == notMovableIndex2) updatePlace = false;
		
		if (updatePlace) {
			knobs[selectedKnobIndex] = clickToKnobValue(clickX);
			var changed = gradientColor.sort();
			selectedKnobIndex = findIndex(changed, selectedKnobIndex);
			selectElmColor.selectedIndex = selectedKnobIndex;
		}
		inputboxRange.value = knobs[selectedKnobIndex];
		
		updateColorSlider();
		setColorRGBInputs();
		colorpicker_setColor("colpic", colors[selectedKnobIndex], onColorChanged);
		setRemoveButton();
	};
	
	inputboxRange.onchange = function(event) {
		var val = parseFloat(this.value.replace(',', '.')); // otetaan arvo, muutetaan tarvittessa pilkut pisteiksi
		if (isNaN(val) || selectedKnobIndex == notMovableIndex1 || selectedKnobIndex == notMovableIndex2) {
			val = knobs[selectedKnobIndex];
		}
		if (val < rangeMin) val = rangeMin;
		if (val > rangeMax) val = rangeMax;
		
		this.value = val;
		knobs[selectedKnobIndex] = val;
		
		var changed = gradientColor.sort();
		selectedKnobIndex = findIndex(changed, selectedKnobIndex);
		selectElmColor.selectedIndex = selectedKnobIndex;
		
		setColorRGBInputs();
		updateColorSlider();
	};
	
	selectElmColor.onchange = function(event) {
		selectedKnobIndex = this.selectedIndex;
		inputboxRange.value = knobs[selectedKnobIndex];
		updateColorSlider();
		setColorRGBInputs();
		colorpicker_setColor("colpic", colors[selectedKnobIndex], onColorChanged)
		setRemoveButton()
	};
	
	inputboxColorR.onchange = function(event) {
		onColorRGBInputsChange()
	};
	inputboxColorG.onchange = function(event) {
		onColorRGBInputsChange()
	};
	inputboxColorB.onchange = function(event) {
		onColorRGBInputsChange()
	};
	
	addColorBtn.onclick = function(event) {
		gradientColor.addColor([0,0,0] , ( (0.05*(rangeMax-rangeMin)) + (Math.random() * 0.95 * (rangeMax-rangeMin) )));
		var changed = gradientColor.sort();
		
		knobs = gradientColor.getRangeValues();
		colors = gradientColor.getColors();
		notMovableIndex1 = 0;
		notMovableIndex2 = colors.length - 1;
		
		selectedKnobIndex = findIndex(changed, colors.length-1);
		updateColorSelection();
		selectElmColor.selectedIndex = selectedKnobIndex;
		inputboxRange.value = knobs[selectedKnobIndex];
		
		setRemoveButton();
		updateColorSlider();
		setColorRGBInputs();
		colorpicker_setColor("colpic", colors[selectedKnobIndex], onColorChanged)
	};
	
	removeColorBtn.onclick = function(event) {
		if (selectedKnobIndex == notMovableIndex1 || selectedKnobIndex == notMovableIndex2) return;
		
		gradientColor.removeColor(selectedKnobIndex);
		knobs = gradientColor.getRangeValues();
		colors = gradientColor.getColors();
		notMovableIndex1 = 0;
		//if (selectedKnobIndex < notMovableIndex2) notMovableIndex2--;
		notMovableIndex2 = colors.length - 1;
		selectedKnobIndex = 0;
		
		setRemoveButton();
		updateColorSelection();
		updateColorSlider();	
		setColorRGBInputs();
		colorpicker_setColor("colpic", colors[selectedKnobIndex], onColorChanged)
	};
	
	// KOMPONENTTIEN ALUSTUS FUNKTIOILLA:
	updateTextureSelection();
	updateColorSelection();
	setColorRGBInputs();
	setRemoveButton();
	setIsScaledToWorld();
	updateColorSlider();
	
	return draggableUiComponent("Texture editor", [posLeft, posTop], all);
	
	// FUNKTIOT || FUNKTIOT || FUNKTIOT || FUNKTIOT || FUNKTIOT
	// funktiot, joilla kontrolloidaan elementteja
	
	function updateColorSlider() {
		
		ctx.moveTo(0,0);
		ctx.fillStyle = "#696969";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, canvas.height/2.0, canvas.width, 1);
		
		for (var i = 0; i < knobs.length; i++) {
			if (i != selectedKnobIndex) {
				drawKnob(knobs[i], "#484848", ("rgb(" + colors[i][0] + ", " + colors[i][1] + ", " + colors[i][2] + ")"));
			}
		}
		
		drawKnob(knobs[selectedKnobIndex], "#000000", ("rgb(" + colors[selectedKnobIndex][0] + ", " + colors[selectedKnobIndex][1] + ", " + colors[selectedKnobIndex][2] + ")"));
		
		function drawKnob(x, bCol, fCol) {		
			x = knobValToClick(x);
			var knobHeight = canvas.height;
			var borderSize = 4;

			ctx.fillStyle = bCol;
			ctx.fillRect(x-(knobWidth/2.0), (canvas.height-knobHeight)/2, knobWidth, knobHeight);
			
			var tmpWidth = knobWidth - borderSize;
			var tmpHeight = knobHeight - borderSize;
			
			ctx.fillStyle = fCol;
			ctx.fillRect(x-(tmpWidth/2.0), (canvas.height-tmpHeight)/2, tmpWidth, tmpHeight);
		}
	}
	
	// paivittaa tekstuuri selectionin valinnat
	function updateTextureSelection() {
		while(selectElmTexture.firstChild) {
			selectElmTexture.removeChild(selectElmTexture.firstChild);
		}
		
		// vaihtoehtoiset tekstuurit, jotka voidaan piirtaa
		for (var i = 0; i < textureNames.length; i++) {
			var opt = document.createElement("OPTION");
			opt.appendChild(document.createTextNode(textureNames[i]));
			opt.value = i; //textureNames[i];
			selectElmTexture.appendChild(opt); // lisataan luotu valintas
		}
	}
	
	// paivittaa color selectionin valinnat
	function updateColorSelection() {	
		while(selectElmColor.firstChild) {
			selectElmColor.removeChild(selectElmColor.firstChild);
		}
		// vaihtoehtoiset tekstuurit, jotka voidaan piirtaa
		for (var i = 0; i < colors.length; i++) {
			var opt = document.createElement("OPTION");
			opt.appendChild(document.createTextNode("Color" + (i+1)));
			opt.value = i;
			selectElmColor.appendChild(opt); // lisataan luotu valintas
		}
	}
	
	// asettaa colorRgb laatikon inputit
	function setColorRGBInputs() {
		inputboxColorR.value = colors[selectedKnobIndex][0];
		inputboxColorG.value = colors[selectedKnobIndex][1];
		inputboxColorB.value = colors[selectedKnobIndex][2];
	}
	
	// kun kayttaja muuttaa color inputtejen arvoja
	function onColorRGBInputsChange() {
		var valR = parseInt(inputboxColorR.value.replace(',', '.'), 10);
		var valG = parseInt(inputboxColorG.value.replace(',', '.'), 10);
		var valB = parseInt(inputboxColorB.value.replace(',', '.'), 10);
		
		if (isNaN(valR)) {
			valR = colors[selectedKnobIndex][0];
		}
		if (isNaN(valR)) {
			valG = colors[selectedKnobIndex][1];
		}
		if (isNaN(valR)) {
			valB = colors[selectedKnobIndex][2];
		}
		if (valR < 0) valR = 0;
		if (valR > 255) valR = 255;
		if (valG < 0) valG = 0;
		if (valG > 255) valG = 255;
		if (valB < 0) valB = 0;
		if (valB > 255) valB = 255;
		
		inputboxColorR.value = valR;
		inputboxColorG.value = valG;
		inputboxColorB.value = valB;
		colors[selectedKnobIndex] = [valR, valG, valB];
		
		updateColorSlider();
		colorpicker_setColor("colpic", colors[selectedKnobIndex], onColorChanged)
	}
	
	// kun kayttaja vaihtaa varia esim colorpickerilla
	function onColorChanged(newCol) {
		colors[selectedKnobIndex] = newCol;
		setColorRGBInputs();
		updateColorSlider();
	}
	
	// katsoo voiko kayttaja poistaa varin
	function setRemoveButton() {
		if (selectedKnobIndex == notMovableIndex1 || selectedKnobIndex == notMovableIndex2) removeColorBtn.disabled = true;
		else removeColorBtn.disabled = false;
	}
	
	function setIsScaledToWorld() {
		if(!textures.getIsBetween0And1FromName(textureNames[selectedTextureIndex])) {
			isScaledToWorldInput.checked = true;
		}
		else isScaledToWorldInput.checked = false;
		
		if (textureNames[selectedTextureIndex].indexOf("Custom") == -1) {
			isScaledToWorldInput.disabled = true;
		}
		else isScaledToWorldInput.disabled = false;
	}
	
	// paivittaa 3d controllerin ja textureviewerissa kaytettavat tekstuurit
	function update3dAndImageTextureOptions() {
		// texture viewerin tekstuuri valinnat:
		var textureViewerOptions = document.getElementById("selectTextureImg");
		var selectedTexture1 = textureViewerOptions.selectedIndex;
		while(textureViewerOptions.firstChild) {
			textureViewerOptions.removeChild(textureViewerOptions.firstChild);
		}
		var namesNew1 = textures.getTextureNamesForImg();
		for (var i = 0; i < namesNew1.length; i++) {
			var opt = document.createElement("OPTION");
			opt.appendChild(document.createTextNode(namesNew1[i]));
			opt.value = namesNew1[i];
			textureViewerOptions.appendChild(opt); // lisataan luotu valintas
		}
		textureViewerOptions.selectedIndex = selectedTexture1;
		
		// 3d controllerin tekstuurivalinnat:
		var texture3DOptions = document.getElementById("selectedTexture3D");
		var selectedTexture2 = texture3DOptions.selectedIndex;
		while(texture3DOptions.firstChild) {
			texture3DOptions.removeChild(texture3DOptions.firstChild);
		}
		var namesNew2 = textures.getTextureNamesFor3d();
		for (var i = 0; i < namesNew2.length; i++) {
			var opt = document.createElement("OPTION");
			opt.appendChild(document.createTextNode(namesNew2[i]));
			opt.value = namesNew2[i];
			texture3DOptions.appendChild(opt); // lisataan luotu valintas
		}
		texture3DOptions.selectedIndex = selectedTexture2;
		
		
	}
	
	// APUFUNKTIOT | APUFUNKTIOT | APUFUNKTIOT | APUFUNKTIOT | APUFUNKTIOT | APUFUNKTIOT | APUFUNKTIOT | APUFUNKTIOT
	// hyodyllisia apunfunktioita:
	
	function clickToKnobValue(x) {
		if (x < sliderArea[0] ) x = sliderArea[0];
		if (x > sliderArea[1] ) x = sliderArea[1];	
		return (rangeMin + ((x - sliderArea[0]) / (sliderArea[1] - sliderArea[0]) * (rangeMax - rangeMin)));
	}
	
	function knobValToClick(val) {
		val = (val - rangeMin) / (rangeMax - rangeMin);
		return (sliderArea[0] + (val * (sliderArea[1]-sliderArea[0])));
	}	
	
	// etsii taulukosta kyseisen arvon val ja palauttaa sen indeksin
	function findIndex(array, val) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == val) return i;
		}
		return 0;
	}		
}


/**
 * Luo colorpickerin annetuilla parametreilla:
 * id: elementin id
 * sizes: [canvas1Width, canvas1Height, canvas2Height]
 * col: [0-255,0-255,0-255]
 * callback: funktio, jota kutsutaan, kun kayttaja muuttaa varia, antaa parametrina uuden valitun varin
 */
function colorpicker_create(id, sizes, col, callback) {

	// kanvaksien klikkauksien kuuntelijat
	var canvas1_clickX = sizes[0];
	var canvas1_clickY = 0;
	var canvas2_clickX = sizes[0];
	var canvas2_clickY = sizes[2]/2.0;
	
	
	var mainColor = [255,0,0]; // mainColor, joka osoittaa mika vari on valittuna canvas2:sta [255,0,0] -> [255,255,0].....
	// canvas1:sen liukuvarit:
	const canvas1_grad1 = new GradientColor([[255,255,255], [0,0,0]], [0,1]); // valkoisesta mustaan
	const canvas1_grad2 = new GradientColor([mainColor, [0,0,0]], [0,1]); // maincolorista mustaan
	// canvas2:sen liukuvarit:
	var canvas2_grad1Colors = [[255,0,0], [255,255,0], [0,255,0], [0,255,255], [0,0,255], [255,0,255], [255,0,0]];
	const canvas2_grad1 = new GradientColor(canvas2_grad1Colors, [0, (1.0/6.0), (2.0/6.0), (3.0/6.0), (4.0/6.0), (5.0/6.0), 1.0 ]);
	
	// komponenttien luonti:
	var container = document.createElement("DIV"); // container, johon komoponentit
	container.id = id;
	var canvas1_div = document.createElement("DIV"); // canvas1:sen div
	container.appendChild(canvas1_div);
	var canvas2_div = document.createElement("DIV"); // canvas2:sen div
	container.appendChild(canvas2_div);
	
	var canvas1 = document.createElement("CANVAS"); // canvas1
	canvas1.id = id + "Canvas1";
	canvas1.width = sizes[0];
	canvas1.height = sizes[1];
	canvas1_div.appendChild(canvas1);
	canvas1.onclick = function(event) {
		canvas1_clickX = event.clientX - canvas1.getBoundingClientRect().left; // tallennetaan klikkaukset
		canvas1_clickY = event.clientY - canvas1.getBoundingClientRect().top;
		// lasketaan klikattu vari:
		var rgb1 = canvas1_grad1.getColor(canvas1_clickY/canvas1.height);
		var rgb2 = canvas1_grad2.getColor(canvas1_clickY/canvas1.height);
		const tmpGrad = new GradientColor([rgb1, rgb2], [0,1]);
		//console.log("Clicked color: " + tmpGrad.getColor(canvas1_clickX/canvas1.width)); // klikattu vari
		
		updateCanvas1(); // paivitetaan kanvas1, johon tulee uusi klikkauspiste
		
		callback(tmpGrad.getColor(canvas1_clickX/canvas1.width)); // callback, johon annetaan uusi valittu vari
	};
	
	var canvas2 = document.createElement("CANVAS"); // canvas2
	canvas2.id = id + "Canvas2";
	canvas2.width = sizes[0];
	canvas2.height = sizes[2];
	canvas2_div.appendChild(canvas2);
	canvas2.onclick = function(event) {
		canvas2_clickX = event.clientX - canvas2.getBoundingClientRect().left; // tallennetaan klikkaus
		//canvas2_clickY = event.clientY - canvas2.getBoundingClientRect().top;
		mainColor = canvas2_grad1.getColor(canvas2_clickX / canvas2.width); // asetetaan uusi mainColor
		canvas1_grad2.set([mainColor, [0,0,0]], [0,1]); // paivitetaan canvas1 liukuvari
		
		// lasketaan uusi aktiivinen vari
		var rgb1 = canvas1_grad1.getColor(canvas1_clickY/canvas1.height);
		var rgb2 = canvas1_grad2.getColor(canvas1_clickY/canvas1.height);
		const tmpGrad = new GradientColor([rgb1, rgb2], [0,1]);
		//console.log("Clicked color: " + tmpGrad.getColor(canvas1_clickX/canvas1.width)); // klikattu vari
		
		updateCanvas1(); // paivitetaan canvas1:nen uuden mainColorin mukaiseksi
		updateCanvas2(); // paivitetaan canvas2:seen uusi klikkauskohta 
		
		callback(tmpGrad.getColor(canvas1_clickX/canvas1.width)); // callback, johon annetaan uusi valittu vari
	};
	
	setColor(col); // asetetaan parametrina annettu vari pickeriin
	
	return container; // palautetaan colorpicker komponentti
	
	// APUFUNKTIOT
	function updateCanvas1() {	
		var ctx1=canvas1.getContext("2d");
		for (var steps = 0; steps <= canvas1.width; steps++) {
			var grd1=ctx1.createLinearGradient(0,0,canvas1.width,0);
			
			var rgb1 = canvas1_grad1.getColor(steps/canvas1.width);
			var rgb2 = canvas1_grad2.getColor(steps/canvas1.width);
			grd1.addColorStop(0,"rgb(" + rgb1[0] + ", " + rgb1[1] + ", " + rgb1[2] + ")");
			grd1.addColorStop(1,"rgb(" + rgb2[0] + ", " + rgb2[1] + ", " + rgb2[2] + ")");
			ctx1.fillStyle=grd1;
			ctx1.fillRect(0,steps,canvas1.width,1);
		}
		
		// klikattu piste
		setClickedPoint(ctx1, canvas1_clickX, canvas1_clickY);
	}
	
	function updateCanvas2() {
		var ctx2 = canvas2.getContext("2d");
		var grd2=ctx2.createLinearGradient(0,0, canvas2.width,0);
		for (var i = 0; i + 1 < canvas2_grad1Colors.length; i++) {
			var rgb1 = canvas2_grad1Colors[i];
			var rgb2 = canvas2_grad1Colors[i+1];
			grd2.addColorStop( (i/(canvas2_grad1Colors.length-1)),"rgb(" + rgb1[0] + ", " + rgb1[1] + ", " + rgb1[2] + ")");
			grd2.addColorStop(((i+1)/(canvas2_grad1Colors.length-1)),"rgb(" + rgb2[0] + ", " + rgb2[1] + ", " + rgb2[2] + ")");
		}	
		ctx2.fillStyle=grd2;
		ctx2.fillRect(0,0, canvas2.width,canvas2.height);
		
		// klikattu piste
		setClickedPoint(ctx2, canvas2_clickX, canvas2_clickY);
	}
	
	
	function setClickedPoint(ctx, clickX, clickY) {
		ctx.strokeStyle="#ffffff";
		ctx.lineWidth= 3;
		ctx.beginPath();
		ctx.arc(clickX, clickY, 4, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.strokeStyle="#000000";
		ctx.lineWidth= 3;
		ctx.beginPath();
		ctx.arc(clickX, clickY, 7, 0, 2 * Math.PI);
		ctx.stroke();
	}
	
	
	function setColor(col) {
		// etsitaan colorin max ja min index:
		var max_index = 0;
		var min_index = 0;
		for (var i = 1; i < col.length; i++) {
			if (col[i] > col[max_index]) max_index = i;
			if (col[i] < col[min_index]) min_index = i;
		}
		// etsitaan colorin middle index:
		var midle_index = 0;
		if (max_index > min_index) midle_index = max_index - 1;
		if (min_index > max_index) midle_index = midle_index -1;
		
		canvas1_clickX = 255 - col[min_index]; // asetetaan canvas1_clickX
		if (col[min_index] == col[max_index]) canvas1_clickX = 0; // jos min ja max on samat, niin X koordinaatti 0:llaan
		canvas1_clickY = 255 - col[max_index]; // asetetaan canvas1_clickY
		
		// luodaan liukuvari, joka kay lapi kaikki varit maxin ja minimien valilla:
		var ma = col[max_index];
		var mi = col[min_index];
		var grad_tmp_colors = [[ma,mi,mi], [ma,ma,mi], [mi,ma,mi], [mi,ma,ma], [mi,mi,ma], [ma,mi,ma], [ma,mi,mi]];
		const grad_tmp = new GradientColor(grad_tmp_colors, [0, (1.0/6.0), (2.0/6.0), (3.0/6.0), (4.0/6.0), (5.0/6.0), 1.0 ]);
		var steps = (grad_tmp_colors.length-1) * (ma - mi); // lasketaan kuinka monta steppia syntyy
		// kaydaan liukuvarin varit lapi ja katsotaan mista kohdin kayttajan syottama vari loytyy:
		for (var i = 0; i <= steps; i++) {
			var col_tmp = grad_tmp.getColor(i/steps);
			if (col[0] == col_tmp[0] && col[1] == col_tmp[1] && col[2] == col_tmp[2]) { // jos varit tasmaa
				canvas2_clickX = (i / steps) * canvas2.width; // asetetaan canvas2_clickX
			}
		}
		
		mainColor = canvas2_grad1.getColor(canvas2_clickX / 255.0); // asetetaan uusi mainColor
		canvas1_grad2.set([mainColor, [0,0,0]], [0,1]); // paivitetaan canvas1_grad2
		
		updateCanvas1(); // paivitetaan molemmat kanvakset
		updateCanvas2();
	}
}


/**
 * Paivittaa colorpickeriin uuden varin, joutuu luomaan uudestaan kaikki elementit komponentin sisaan, jotta klikkausien kuuntelu pysyy ajantasalla
 * id: elementin id
 * col: [0-255,0-255,0-255]
 * callback: funktio, jota kutsutaan, kun kayttaja muuttaa varia, antaa parametrina uuden valitun varin
 */
function colorpicker_setColor(id, col, callback) {
	var container = document.getElementById(id);
	
	// vanhan colorpickerin tiedot:
	var canvas1Width = document.getElementById(id + "Canvas1").width;
	var canvas1Height = document.getElementById(id + "Canvas1").height;
	var canvas2Height = document.getElementById(id + "Canvas2").height;
	
	// tyhjennetaan vanha colorpicker
	while(container.firstChild) {
		container.removeChild(container.firstChild);
	}
	
	// kanvaksien klikkauksien kuuntelijat
	var canvas1_clickX = canvas1Width;
	var canvas1_clickY = 0;
	var canvas2_clickX = canvas1Width;
	var canvas2_clickY = canvas2Height/2.0;
	
	
	var mainColor = [255,0,0]; // mainColor, joka osoittaa mika vari on valittuna canvas2:sta [255,0,0] -> [255,255,0].....
	// canvas1:sen liukuvarit:
	const canvas1_grad1 = new GradientColor([[255,255,255], [0,0,0]], [0,1]); // valkoisesta mustaan
	const canvas1_grad2 = new GradientColor([mainColor, [0,0,0]], [0,1]); // maincolorista mustaan
	// canvas2:sen liukuvarit:
	var canvas2_grad1Colors = [[255,0,0], [255,255,0], [0,255,0], [0,255,255], [0,0,255], [255,0,255], [255,0,0]];
	const canvas2_grad1 = new GradientColor(canvas2_grad1Colors, [0, (1.0/6.0), (2.0/6.0), (3.0/6.0), (4.0/6.0), (5.0/6.0), 1.0 ]);
	
	// komponenttien luonti:
	var canvas1_div = document.createElement("DIV"); // canvas1:sen div
	container.appendChild(canvas1_div);
	var canvas2_div = document.createElement("DIV"); // canvas2:sen div
	container.appendChild(canvas2_div);
	
	var canvas1 = document.createElement("CANVAS"); // canvas1
	canvas1.id = id + "Canvas1";
	canvas1.width = canvas1Width;
	canvas1.height = canvas1Height;
	canvas1_div.appendChild(canvas1);
	canvas1.onclick = function(event) {
		canvas1_clickX = event.clientX - canvas1.getBoundingClientRect().left; // tallennetaan klikkaukset
		canvas1_clickY = event.clientY - canvas1.getBoundingClientRect().top;
		// lasketaan klikattu vari:
		var rgb1 = canvas1_grad1.getColor(canvas1_clickY/canvas1.height);
		var rgb2 = canvas1_grad2.getColor(canvas1_clickY/canvas1.height);
		const tmpGrad = new GradientColor([rgb1, rgb2], [0,1]);
		//console.log("Clicked color: " + tmpGrad.getColor(canvas1_clickX/canvas1.width)); // klikattu vari
		
		updateCanvas1(); // paivitetaan kanvas1, johon tulee uusi klikkauspiste
		
		callback(tmpGrad.getColor(canvas1_clickX/canvas1.width)); // callback, johon annetaan uusi valittu vari
	};
	
	var canvas2 = document.createElement("CANVAS"); // canvas2
	canvas2.id = id + "Canvas2";
	canvas2.width = canvas1Width;
	canvas2.height = canvas2Height;
	canvas2_div.appendChild(canvas2);
	canvas2.onclick = function(event) {
		canvas2_clickX = event.clientX - canvas2.getBoundingClientRect().left; // tallennetaan klikkaus
		//canvas2_clickY = event.clientY - canvas2.getBoundingClientRect().top;
		mainColor = canvas2_grad1.getColor(canvas2_clickX / canvas2.width); // asetetaan uusi mainColor
		canvas1_grad2.set([mainColor, [0,0,0]], [0,1]); // paivitetaan canvas1 liukuvari
		
		// lasketaan uusi aktiivinen vari
		var rgb1 = canvas1_grad1.getColor(canvas1_clickY/canvas1.height);
		var rgb2 = canvas1_grad2.getColor(canvas1_clickY/canvas1.height);
		const tmpGrad = new GradientColor([rgb1, rgb2], [0,1]);
		//console.log("Clicked color: " + tmpGrad.getColor(canvas1_clickX/canvas1.width)); // klikattu vari
		
		updateCanvas1(); // paivitetaan canvas1:nen uuden mainColorin mukaiseksi
		updateCanvas2(); // paivitetaan canvas2:seen uusi klikkauskohta 
		
		callback(tmpGrad.getColor(canvas1_clickX/canvas1.width)); // callback, johon annetaan uusi valittu vari
	};
	
	setColor(col); // asetetaan parametrina annettu vari pickeriin
	
	// APUFUNKTIOT
	
	function updateCanvas1() {	
		var ctx1=canvas1.getContext("2d");
		for (var steps = 0; steps <= canvas1.width; steps++) {
			var grd1=ctx1.createLinearGradient(0,0,canvas1.width,0);
			
			var rgb1 = canvas1_grad1.getColor(steps/canvas1.width);
			var rgb2 = canvas1_grad2.getColor(steps/canvas1.width);
			grd1.addColorStop(0,"rgb(" + rgb1[0] + ", " + rgb1[1] + ", " + rgb1[2] + ")");
			grd1.addColorStop(1,"rgb(" + rgb2[0] + ", " + rgb2[1] + ", " + rgb2[2] + ")");
			ctx1.fillStyle=grd1;
			ctx1.fillRect(0,steps,canvas1.width,1);
		}
		
		// klikattu piste
		setClickedPoint(ctx1, canvas1_clickX, canvas1_clickY);
	}
	
	function updateCanvas2() {
		var ctx2 = canvas2.getContext("2d");
		var grd2=ctx2.createLinearGradient(0,0, canvas2.width,0);
		for (var i = 0; i + 1 < canvas2_grad1Colors.length; i++) {
			var rgb1 = canvas2_grad1Colors[i];
			var rgb2 = canvas2_grad1Colors[i+1];
			grd2.addColorStop( (i/(canvas2_grad1Colors.length-1)),"rgb(" + rgb1[0] + ", " + rgb1[1] + ", " + rgb1[2] + ")");
			grd2.addColorStop(((i+1)/(canvas2_grad1Colors.length-1)),"rgb(" + rgb2[0] + ", " + rgb2[1] + ", " + rgb2[2] + ")");
		}	
		ctx2.fillStyle=grd2;
		ctx2.fillRect(0,0, canvas2.width,canvas2.height);
		
		// klikattu piste
		setClickedPoint(ctx2, canvas2_clickX, canvas2_clickY);
	}
	
	
	function setClickedPoint(ctx, clickX, clickY) {
		ctx.strokeStyle="#ffffff";
		ctx.lineWidth= 3;
		ctx.beginPath();
		ctx.arc(clickX, clickY, 4, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.strokeStyle="#000000";
		ctx.lineWidth= 3;
		ctx.beginPath();
		ctx.arc(clickX, clickY, 7, 0, 2 * Math.PI);
		ctx.stroke();
	}
	
	
	function setColor(col) {
		// etsitaan colorin max ja min index:
		var max_index = 0;
		var min_index = 0;
		for (var i = 1; i < col.length; i++) {
			if (col[i] > col[max_index]) max_index = i;
			if (col[i] < col[min_index]) min_index = i;
		}
		// etsitaan colorin middle index:
		var midle_index = 0;
		if (max_index > min_index) midle_index = max_index - 1;
		if (min_index > max_index) midle_index = midle_index -1;
		
		canvas1_clickX = 255 - col[min_index]; // asetetaan canvas1_clickX
		if (col[min_index] == col[max_index]) canvas1_clickX = 0; // jos min ja max on samat, niin X koordinaatti 0:llaan
		canvas1_clickY = 255 - col[max_index]; // asetetaan canvas1_clickY
		
		// luodaan liukuvari, joka kay lapi kaikki varit maxin ja minimien valilla:
		var ma = col[max_index];
		var mi = col[min_index];
		var grad_tmp_colors = [[ma,mi,mi], [ma,ma,mi], [mi,ma,mi], [mi,ma,ma], [mi,mi,ma], [ma,mi,ma], [ma,mi,mi]];
		const grad_tmp = new GradientColor(grad_tmp_colors, [0, (1.0/6.0), (2.0/6.0), (3.0/6.0), (4.0/6.0), (5.0/6.0), 1.0 ]);
		var steps = (grad_tmp_colors.length-1) * (ma - mi); // lasketaan kuinka monta steppia syntyy
		// kaydaan liukuvarin varit lapi ja katsotaan mista kohdin kayttajan syottama vari loytyy:
		for (var i = 0; i <= steps; i++) {
			var col_tmp = grad_tmp.getColor(i/steps);
			if (col[0] == col_tmp[0] && col[1] == col_tmp[1] && col[2] == col_tmp[2]) { // jos varit tasmaa
				canvas2_clickX = (i / steps) * canvas2.width; // asetetaan canvas2_clickX
			}
		}
		
		mainColor = canvas2_grad1.getColor(canvas2_clickX / 255.0); // asetetaan uusi mainColor
		canvas1_grad2.set([mainColor, [0,0,0]], [0,1]); // paivitetaan canvas1_grad2
		
		updateCanvas1(); // paivitetaan molemmat kanvakset
		updateCanvas2();
	}
}
