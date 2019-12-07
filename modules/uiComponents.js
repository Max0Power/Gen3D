/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 14.10.2019, GoldenLayout
 */

"use strict";

 /**
  * Numero laatikko, jolle tulee parametreina:
  * id -> syottolaatikon id
  * value -> aloitus arvo laatikkoon
  * step -> askelluksen suuruus, kun klikkaillaan -+ painikkeita
  * min -> minimi arvo, jonka laatikkoon voi syottaa
  * max -> maksimi arvo, jonka laatikkoon voi syottaa
  * isOnlyInteger -> bool arvo, joka maarittelee kayttaako laatikko pelkastaan Integer arvoja
  * Palauttaa komponentin, jossa on syottolaatikko ja painikkeet arvojen muunteluun
  */
function numberBox(id, value, step, min, max, isOnlyInteger) {
	// jos sallii vain integerit, muutetaan annetut arvot integereiksi
	if (isOnlyInteger) {
		value = parseInt(value, 10);
		step = parseInt(step, 10);
		min = parseInt(min, 10);
		max = parseInt(max, 10);
	}
	
	var div = document.createElement("DIV"); // komponentin container
	div.className = "numberBoxComponent";
	
	var inputBox =  document.createElement("INPUT"); // syotelaatikko
	inputBox.className = "userInputBox";
	inputBox.id = id; // asetetaan id
	inputBox.value = value; // oletus arvo
	inputBox.onblur = function(){increaseInputVal(0)}; // kun kayttaja poistuu laatikosta -> validointi
	div.appendChild(inputBox);
	
	var timer; // <- timer olio
	var timerRunning = false; // <- kertoo onko timer kaynnissa, joka kasvattaa automaattisesti inputin sisaltoa, jos hiiri on pohjassa
	
	/////////////////////////////////////////////////////////////////////////////////////////////////
	var btnMinus = document.createElement("BUTTON");
	btnMinus.appendChild(document.createTextNode("-"));
	btnMinus.className = "decreaseBtn";
	// Kun kayttaja klikkaa increase buttonia:
	btnMinus.onmousedown = function(event) {
		increaseInputVal(-step); // normaali tapahtuma: vahennetaan laatikon arvoa
		// jos timer ei ole kaynnissa, niin silloin voidaan aloittaa timer, joka vahentaa input arvoa
		if (!timerRunning) {
			timerRunning = true; // asetetaan timer kayntiin
			timer_increase_input(200, -step); // kutsutaan timerin functiota, joka kasvasttaa kiihtyen valueta annetulla stepilla
		}
	};
	// jos hiiri nousee ylos -> lopetetaan timer
	btnMinus.onmouseup = function(event) {
		timerRunning = false;
		clearTimeout(timer);
	};
	// jos hiiri lahtee laatikon alueelta -> lopetetaan timer
	btnMinus.onmouseleave = function(event) {
		timerRunning = false;
		clearTimeout(timer);
	};
	
	div.appendChild(btnMinus);
	/////////////////////////////////////////////////////////////////////////////////////////////////	
	var btnPlus = document.createElement("BUTTON");
	btnPlus.appendChild(document.createTextNode("+"));
	btnPlus.className = "increaseBtn";
	btnPlus.onmousedown = function(event) {
		increaseInputVal(step);
		if (!timerRunning) {
			timerRunning = true;
			timer_increase_input(200, step);
		}
	};
	btnPlus.onmouseup = function(event) {
		timerRunning = false;
		clearTimeout(timer);
	};
	btnPlus.onmouseleave = function(event) {
		timerRunning = false;
		clearTimeout(timer);
	};
	div.appendChild(btnPlus);
	/////////////////////////////////////////////////////////////////////////////////////////////////

	return div;
	
	
	/**
	 * Kasvatetaan input laatikon arvoa annetulla num parametrilla
	 * huolehtii samalla, etta arvo on validi
	 */
	function increaseInputVal(num) {
		var val = parseFloat(inputBox.value.replace(',', '.')); // otetaan arvo, muutetaan tarvittessa pilkut pisteiksi
		if (isOnlyInteger) val = parseInt(inputBox.value.replace(',', '.'), 10); // laatikon arvo integerina, jos pelkka integer
		// jos arvo on Nan, niin asetetaan laatikon arvo suoraan perusarvoon
		if (isNaN(val)) {
			val = value;
			num = 0;
		}
		val += num; // kasvatetaan lukua kayttajan antamalla parametrilla
		if (val < min) val = min;
		if (val > max) val = max;
		inputBox.value = val; // asetetaan uusi arvo
	}
	
	
	/**
	 * Muuttaa input laatikon arvoa kiihtyvalla vauhdilla, kun timer on kaynnissa
	 * eli, kun kayttaja painaa pohjassa kasvata nappia
	 */
	function timer_increase_input(interval, num_to_increase) {
		// asetetaan timeOut, joka triggeroi seuraavan funktion, intervallin saavuttessa 0:
		timer = setTimeout(function(){
			// jos, timer on viela kaynnissa, intervallin saavuttaessa 0
			if (timerRunning) {
				interval -= 10; // nopeutetaan intervallia
				if (interval < 50) interval = 50; // minimi interval, eli suurin mahdollinen nopeus
				increaseInputVal(num_to_increase); // kasvatetaan inputlaatikon lukua
				timer_increase_input(interval, num_to_increase); // kutsutaan funktiota uudestaan
			}
		}, interval);
	}
}

var DRAGGABLE_Z_INDEX = 8;

/**
 * Luo raahattavan komponentin, johon asetetaan paramerina annettu sisalto (contenElm)
 * Palauttaa lopuksi luodun komponentitn
 * headerTxt raahattavan "ikkunan" ylapalkin teksti
 * position, paikka [x,y], johon ikkuna luodaan, esim [0,0];
 */
function draggableUiComponent(headerTxt, position, contentElm) {
    
    // luodaan container, joka on kehys raahattavalle elementille
	var container = document.createElement("DIV");
	container.className="draggable"; // asetetaan tyyppi raahattavaksi
        fitToContainer(container); // käytetään koko tila

        container.id = headerTxt; // löytyy dokumentista otsikolla
        /*
	var header = document.createElement("DIV"); // header komponentti, eli ylapalkki
	header.className = "draggableHeader"; // asetetaan class, joka maarittelee ylapalkin tyylin
	header.textContent = headerTxt; // asetetaan teksti
	container.appendChild(header);
	*/
	
	var contentDiv = document.createElement("DIV"); // Luodaan divi, johon tulee parametrina annettu sisalto
	contentDiv.appendChild(contentElm);
	contentDiv.className="draggableContainer"; // luokka, joka maarittelee sislto laatikon tyylin
	container.appendChild(contentDiv);
        fitToContainer(contentDiv); // käytetään koko tila
	
        /*
	var show_hide = true;
	
	var tools_toggleBtn = document.createElement("BUTTON");
	tools_toggleBtn.textContent = headerTxt;
	tools_toggleBtn.className = "draggableToggleBtnActive";
	
	tools_toggleBtn.onclick = function(event) {
		show_hide = !show_hide;
		if (show_hide) {
			tools_toggleBtn.className = "draggableToggleBtnActive";
			container.style.display = 'block'; // show, ikkunan nakyviin
		}
		else {
			tools_toggleBtn.className = "draggableToggleBtnInactive";
			container.style.display = 'none'; // show, ikkuna pois nakyvista
		}
	}
	document.getElementById("tools").appendChild(tools_toggleBtn);
	
	// buttoni HEADER osassa, jolla voi sulkea ikkunan
	var btn = document.createElement("BUTTON");
	btn.textContent = "x";
	btn.className = "draggableHeaderBtn"; // oma tyyli luokka
	btn.onclick = function(event) {
		tools_toggleBtn.className = "draggableToggleBtnInactive";
		container.style.display = 'none'; // show, ikkunan sisalto nakyviin
		show_hide = false;
	};
	header.appendChild(btn);
	*/
	
	return container;
}


/**
 * Luo yleisesti kaikissa ikkunoissa kaytettavan tekstureControllerin
 * Se on raahattava elementti, joka generoi annetuista korkeuksista katseltavan/ladattavan tekstuurin
 */
function createTextureController(top, left, callback) {
	var container = document.createElement("DIV");
	
	// --------------------------- TextureSelection
	
	let label = container.appendChild(document.createElement("label"));
	label.appendChild(document.createTextNode("Texture: "));
	
	var selectDiv = document.createElement("DIV");
	container.appendChild(selectDiv);
	var selectElm = document.createElement("SELECT");
	selectElm.id = "selectTextureImg";
	selectDiv.appendChild(selectElm);
	
	// vaihtoehtoiset tekstuurit, jotka voidaan piirtaa
	var names = textures.getTextureNamesForImg(); // antaa option mukaiset tekstuurit, esim pelkastaan valille 0-1 skaalautuvat | selectOption = 0
	for (var i = 0; i < names.length; i++) {
		var opt = document.createElement("OPTION");
		opt.appendChild(document.createTextNode(names[i]));
		opt.value = names[i];
		selectElm.appendChild(opt); // lisataan luotu valintas
	}
	
	// ---------------------------
	
	var canvas = document.createElement("CANVAS");
	canvas.id = "canv";
	container.appendChild(canvas);
	
	var btn_container = document.createElement("DIV");
	container.appendChild(btn_container);
	
	var btn_drawModel = document.createElement("BUTTON"); // buttoni, joka piirtaa grayscalen ja 3d mallin
	btn_drawModel.appendChild(document.createTextNode("Update image"));
	btn_drawModel.onclick = function(event) {
		callback(); // funktio, jolla piirretaan grayscale
	};
	btn_container.appendChild(btn_drawModel);

	return draggableUiComponent("Texture viewer", [top, left], container);
}


/**
 * Kaikissa ikkunoissa kaytettava raahattava komponentti, jolla voi vaikuttaa 3d mallin piirtymiseen
 */
function createInput3dController(top, left, callback, isMax=false, interpolate=false) {
	var container = document.createElement("DIV");
	
	var quadSizeTxt = document.createElement("LABEL"); // quadSize
	quadSizeTxt.textContent = "Quad size:";
	container.appendChild(quadSizeTxt);
	var quadSizeInp = numberBox("input_modelQuadSize", 1, 0.5, 0.1, 1000, false);
	container.appendChild(quadSizeInp);
	quadSizeTxt.setAttribute("for", "input_modelQuadSize");
	
	var modelHTxt = document.createElement("LABEL"); // mallin maksimi korkeus
	modelHTxt.textContent = "Model max height:";
	container.appendChild(modelHTxt);
	var modelHInp = numberBox("input_modelMaxHeight", 20, 1, 0, 10000, false);
	container.appendChild(modelHInp);
	modelHTxt.setAttribute("for", "input_modelMaxHeight");
    
    if (isMax) {
        var maxlabel = document.createElement("label");
        maxlabel.textContent = "Model max vertices: ";
        container.appendChild(maxlabel);
        var maxvertices = numberBox("input_modelMaxVertices", 200, 1, 20, 1201, true);
        container.appendChild(maxvertices);
        maxlabel.setAttribute("for", "input_modelMaxVertices");
    }
       
        // --------------------------- InterpolationSelection

        if (interpolate) {
            var intlabel = document.createElement("label");
            intlabel.textContent = "Interpolation algorithm: ";
            container.appendChild(intlabel);
            
            var seldiv = document.createElement("DIV");
            container.appendChild(seldiv);
            
            var sel = document.createElement("SELECT");
            sel.id = "selectedIntAlg";
            seldiv.appendChild(sel);
            
            var options = ["Linear","Very slow"];
            for (var i = 0; i < options.length; i++) {
		var opt = document.createElement("OPTION");
		opt.appendChild(document.createTextNode(options[i]));
		opt.value = i;
		sel.appendChild(opt);
            }
	}

	// --------------------------- TextureSelection

	let label = container.appendChild(document.createElement("label"));
	label.appendChild(document.createTextNode("Texture: "));
	
	var selectDiv = document.createElement("DIV");
	container.appendChild(selectDiv);
	var selectElm = document.createElement("SELECT");
	selectElm.id = "selectedTexture3D";
	selectDiv.appendChild(selectElm);
	
	var names = textures.getTextureNamesFor3d();
	for (var i = 0; i < names.length; i++) {
		var opt = document.createElement("OPTION");
		opt.appendChild(document.createTextNode(names[i]));
		opt.value = names[i];
		selectElm.appendChild(opt);
	}

	selectElm.selectedIndex = "1";

	// ---------------------------
	
	var btn_drawModel = document.createElement("BUTTON");
	btn_drawModel.appendChild(document.createTextNode("Update model"));
	btn_drawModel.onclick = function(event) {
		callback();
	};
	container.appendChild(btn_drawModel);
	
	var btn_download = document.createElement("BUTTON"); 
	btn_download.appendChild(document.createTextNode("Download .obj file"));
	btn_download.onclick = function(event) {
		downloadObj(); // funktio, jolla paivitetaan 3d malli
	};
	container.appendChild(btn_download);

	return draggableUiComponent("Controller 3D", [top, left], container);
}

/*
 * ---------------------------------------------------------------------------
 * Konsoli alustettu 11.10.2019
 * Konsoliin voi tulostaa tekstia, jonka kayttaja nakee helposti.
 * ---------------------------------------------------------------------------
 */

var con; // konsolin komponentti (TextArea), jolla tekstit esitetaan

/**
 * Luo raahattavan ikkunan, joka toimii konsolina.
 * Konsoliin voi tulostaa tekstia, jonka kayttaja nakee helposti.
 */
function createConsoleWindow(top, left, callback) {
	
	// -------------------------- Container for console
	
	var container = document.createElement("DIV");
	container.style.width = "200px";
	container.style.height = "200px";
	
	// --------------------------- Console text area ja sen tyylit
	
	con = document.createElement("TEXTAREA");
	con.style.width = "100%";
	con.style.height = "100%";
	con.style.resize = "none";
	con.style.overflow = "auto";
	con.style.whiteSpace = "pre";
	con.style.backgroundColor = "black";
	con.style.color = "white";
	con.readOnly = true; 
	con.value = "Hello, welcome to Gen3D!";
	container.appendChild(con);
	

	return draggableUiComponent("Console", [top, left], container); // tehdaan console raahattavaksi komponentiksi
}


/**
 * Lisaa konsoliin uuden tekstirivin.
 */
function consoleAdd(txt) {
	if (con != null) {
		con.value += txt + '\n' ;
	}
}

function fitToContainer(container){
    // Make it visually fill the  positioned parent
    container.style.width ='100%';
    container.style.height='100%';
    // ...then set the internal size to match
    container.width  = container.offsetWidth;
    container.height = container.offsetHeight;
}
