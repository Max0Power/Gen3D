/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 14.10.2019, GoldenLayout
 */

window.onload = function() {
	textures.setSelectOption(0); // ei anna maailman mittakaavassa skaalattavia tekstuureita!
}


/**
 * Piirtaa pelkan 3d mallin kayttajan syotteista
 */
function draw3dModelFromUserImg() {
	var img = document.getElementById('myImg').src;
	if (!img) return; // jos kuvaa ei ole olemassa
	var heights = getImageData(img);

	// ------------------------------------------------ Tarvittaessa heights matriisin pienennys
    var maxSize = parseInt(document.getElementById("input_modelMaxVertices").value, 10);
	//var maxSize = 200; // max size kanvakelle seka 3d mallille
	var pixelsX = heights.length; // monta pikselia korkeuksiisa on
	var pixelsY = heights[0].length;
	// jos pixeleiden maara on suurempaa kuin sallittu maara
	if (pixelsX > maxSize || pixelsY > maxSize) {
		scale = maxSize / pixelsX; // otetaan skaalaus, jolla skaalataan matriisi, (leveys ja korkeus pysyy samana)
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
	generateMesh(heights, [0.0,1.0], quadSize, maxHeight, selectedTexture3D);
	drawMesh();
}


/**
 * Piirtaa tekstuurin kayttajan syottamasta kuvasta
 */
function drawTextureFromUserImg() {
	var img = document.getElementById('myImg').src;
	if (!img) return; // jos kuvaa ei ole olemassa
	var heights = getImageData(img);

	var selectedTexture = document.getElementById("selectTextureImg").value;
	textures.drawTexture(selectedTexture, heights, [0, 1]);
}


/**
 * Piirtaa seka tekstuurin seka 3d mallin kayttajan antamasta kuvasta
 */
function drawTextureAnd3dModelFromUserImg() {
	// KORKEUKSIEN HAKU:
	var img = document.getElementById('myImg').src;
	if (!img) return; // jos kuvaa ei ole olemassa
	var heights = getImageData(img);

	// TEXTUURIN PIIRTO:
	var selectedTexture = document.getElementById("selectTextureImg").value;
	textures.drawTexture(selectedTexture, heights, [0, 1]);

	// 3D MALLIN PIIRTO:
	// ------------------------------------------------ Tarvittaessa heights matriisin pienennys
	var maxSize = 200; // max size kanvakelle seka 3d mallille
	var pixelsX = heights.length; // monta pikselia korkeuksiisa on
	var pixelsY = heights[0].length;
	// jos pixeleiden maara on suurempaa kuin sallittu maara
	if (pixelsX > maxSize || pixelsY > maxSize) {
		scale = maxSize / pixelsX; // otetaan skaalaus, jolla skaalataan matriisi, (leveys ja korkeus pysyy samana)
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
	generateMesh(heights, [0.0,1.0], quadSize, maxHeight, selectedTexture3D);
	drawMesh();
}


/**
 * Luo input kontrollerin, johon kayttaja voi syottaa malliksi luotavan kuvan
 */
function createUserInputImgController() {
	var container = document.createElement("DIV"); // uloin divi

	var userInput = document.createElement("INPUT"); // kayttajan syote
	userInput.setAttribute("type", "file");
	container.appendChild(userInput);

	var imgDiv = document.createElement("DIV");
	container.appendChild(imgDiv);
	var img = document.createElement("IMG"); // kuva elementti, johon kayttajan syottama kuva asetetaans
	img.id = "myImg";

	imgDiv.appendChild(img);

	// kun kayttaja on syottanyt kuvan:
	userInput.onchange = function(event) {

		// tarkistus, TODO tee paremmaksi
		if (userInput.files.length > 0) {
			img.src = URL.createObjectURL(userInput.files[0]); // asetetaan imagelle source
			// kun kuva on ladattu:
			img.onload = function(event) {

				// skaalataan kayttajan kuva pienempaan kokoon tarvittaessa:
				var maxSize = 200;
				var pixelsX = img.width;
				var pixelsY = img.height;
				if (pixelsX > maxSize || pixelsY > maxSize) {
					scale = maxSize / pixelsX; // otetaan skaalaus, jolla skaalataan matriisi, (leveys ja korkeus pysyy samana)
					if (pixelsY > pixelsX) { // jos y pikseleiden maara suurempaa kuin x piksleiden
						scale = maxSize / pixelsY // lasketaan scale korkeus pikseleiden suhteen
					}
					// lasketaan uudet pixelsX ja pixelsY maarat
					pixelsX = Math.floor(scale * pixelsX);
					pixelsY = Math.floor(scale * pixelsY);
				}
				img.width = pixelsX;
				img.height = pixelsY;

				// generoidaan naytettava tekstuuri ja 3d malli:
				drawTextureAnd3dModelFromUserImg();
			};
		}
	};

	return container;
}
