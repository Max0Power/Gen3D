/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

"use strict";

/* Site instructions */

/**
 * Returns the element where the World Map 3D instructions
 * have been written
 * @returns {object} instructions element
 */
function worldInstructions() {
	let spot = document.createElement("div");
	spot.setAttribute("id", "instructions");
	makeTitle(spot, "World Map 3D");
	createText(spot, 
		"With World Map 3D, you can create 3D models and texture images of areas all around the world. "
	);
	componentInstructions(spot, ["map", "controller 3d", "texture viewer", "texture editor"]);
	generalSiteInstructions(spot);
	return spot;
}

/**
 * Returns the element where the noise instructions have
 * been written
 * @returns {object} instructions element
 */
function noiseInstructions() {
	let spot = document.createElement("div");
	spot.setAttribute("id", "instructions");
	makeTitle(spot, "Noise");
	createText(spot, 
		"With noise, you can create patterns by randomizing or changing the different settings. " +
		"Once you find a pattern that suits your wants and needs, you can create 3D model out of it " + 
		"and/or use the texture image of it."
	);
	componentInstructions(spot, ["noise controller", "controller 3d", "texture viewer", "texture editor"]);
	generalSiteInstructions(spot);
	return spot;
}

/**
 * Returns the element where the user image instructions
 * have been written
 * @returns {object} instructions element
 */
function userImgInstructions() {
	let spot = document.createElement("div");
	spot.setAttribute("id", "instructions");
	makeTitle(spot, "User image");
	createText(spot, 
		"With 3D generator for user images, you can use your own images to make 3D models and texture images. " +
		"For example, you can use a texture image you already have to create a 3D model out of, " +
		"or just use a random image of yours to see what kind of a 3D model it would produce. "
	);
	componentInstructions(spot, ["user input", "controller 3d", "texture viewer", "texture editor"]);
	generalSiteInstructions(spot);
	return spot;
}

/**
 * Adds general site instructions
 * @param {object} place - place for the instructions
 */
function generalSiteInstructions(place) {
	makeSmallerTitle(place, "Data size and user experience");
	createText(place, 
		"For a smooth user experience, please consider the size of the images or areas you use. " +
		"Too large data may take a long time to process, or even fail. "
	);
	makeSmallerTitle(place, "Downloading");
	createText(place, 
		"To download the 3D object in an .obj file format, click 'Download .obj file'. "
	);
	createText(place, 
		"To download the texture image, right click on the image in the texture viewer " + 
		"and save the image onto your computer. "
	);
	createText(place, 
		"You can freely use the .obj files and texture images you create using our generator. "
	);
	makeSmallerTitle(place, "Responsibility");
	createText(place, 
		"We take no responsibility for anything. " + 
		"You, the user, take full responsibility for everything you do, " +
		"including all the files you upload and download. "
	);
}

/* Component instructions */

/**
 * Adds instructions for the 3D model viewer
 * to the place specified by the parameter.
 * @param {object} place - place for the instructions
 */
function instructions3DModel(place) {
	makeSmallerTitle(place, "3D model viewer");
	createText(place, 
		"Behind all the components of the site, there is the 3D model viewer. " +
		"You can use it to see what the model looks like. " +
		"Click on the 3D model, and then use the following controls for the model viewer to view it: " 
	);
	createText(place, 
		"You can change the viewing angle by dragging with your mouse using the left mouse button. " +
		"For moving the viewing position, you can either " +
		"a) drag using the right mouse button or " +
		"b) press down the control button and then drag using the left mouse button. "
	);
	createText(place, 
		"Zooming in or out can be done by using the scroll wheel of your mouse, " + 
		"or even quicker by pressing the scroll wheel button and moving your mouse up or down. "
	);
}

/**
 * Adds component instructions for the map
 * to the place specified by the parameter.
 * @param {object} place - place for the instructions
 */
function componentInstructionsMap(place) {
	makeSmallerTitle(place, "Map");
	createText(place, 
		"You can move on the map by dragging with your mouse using the left mouse button, " +
		"or by clicking the map and then using the arrow keys on your keyboard. " +
		"To zoom in or out, use either the the scroll wheel of your mouse " +
		"or the '+' and '-' buttons near the top left corner of the map."
	);
	createText(place, 
		"To choose an area for the 3D model and texture image, " +
		"you can click on the map to place the square, " + 
		"drag the existing square with your left mouse button " +
		"or you can manually change the latitude and longitude to change where the area is. " +
		"The latitude and longitude values point to the middle of the square. " +
		"The size input controls the size of the area, " +
		"specifically latitudes in height and longitudes in width. "
	);
	createText(place, 
		"Once you have chosen the area you want to use to make the 3D model and texture image, " +
		"click the 'Generate 3D' button. " +
		"You can also only do one or the other by clicking 'Update model' from 3D controller component " +
		"or 'Update image' from texture viewer. "
	);
	createText(place, 
		"The chosen area is always a square, despite what it may seem the further north or south " +
		"it is placed from the equator. " +
		"Because Earth is sphere-shaped, flattening it out needs the use of map projection. " +
		"It, however, is not a perfect representation of a sphere and causes some distortion. " +
		"This distortion can be seen in the area chooser but not the output area. " +
		"The output area will always be square-shaped. " 
	);
	createText(place, 
		"Keep in mind that the data used by the generator may not be perfect. " +
		"There may be areas that do not have height data for the generator to use. " +
		"Some, but not all, of these empty spots are filled by an algorithm " +
		"which may cause them to appear strange depending on how much it had to fill. "
	);
}

/**
 * Adds component instructions for the 3D controller
 * to the place specified by the parameter.
 * @param {object} place - place for the instructions
 */
function componentInstructionsController3D(place) {
	makeSmallerTitle(place, "Controller 3D");
	createText(place, 
		"In the 3D controller, you can change the quad size, maximum height and the texture of the 3D model. " + 
		"To change these, choose a value you want and then click 'Update model'. "
	);
	createText(place, 
		"Quad (quadrangle) size controls the size of the triangles that the polygon mesh consist of, " +
		"which defines the shape of the 3D model. " + 
		"Increasing quad size value expands the 3D model. "
	);
	createText(place, 
		"Maximum height input controls the maximum height of the 3D model. " + 
		"Changing this value scales the heights of the area according to the new range " + 
		"controlled by the max height. "
	);
	createText(place, 
		"In the texture selection, you can change the texture displayed on the 3D model. " +
		"You can choose between pink wireframe, grayscale, red-black, noise terrain or world terrain. " +
		"If you have created new textures with the texture editor, these will also be available for choosing. "
	);
}

/**
 * Adds component instructions for the noise controller
 * to the place specified by the parameter.
 * @param {object} place - place for the instructions
 */
function componentInstructionsNoiseController(place) {
	makeSmallerTitle(place, "Noise controller");
	createText(place, 
		"You can use width and height inputs to change the size of both the texture image and the 3D model. " +
		"With the noise parameters, you can control all sorts of things: "
	);
	createText(place, 
		"Scale can be used to zoom in on the pattern. " +
		"Smaller values produce staticky patterns and higher values produce blurry patterns. " +
		"It is good to find a wanted middleground between these extremes. "
	);
	createText(place, 
		"Seeds act as initializers for the pseudorandom numbers used in noise. " +
		"They seemingly randomize it, but putting the same value again will produce the same output. " +
		"This way, you can keep track of seeds that you find suitable for the noise pattern " +
		"and reuse them. "
	);
	createText(place, 
		"Octaves input value refers to the number of octaves in the noise. " +
		"The higher the number, the more it creates details in the noise pattern " +
		"but the less each increase makes an influence. " +
		"The higher the number, the longer the calculation time becomes. "
	);
	createText(place, 
		"Persistence controls the amount of influence each increase in the number of octaves has. "
	);
	createText(place, 
		"Lacunarity affects the frequency (the height differences) for each increase in the number of octaves. "
	);
	createText(place, 
		"Offset X controls the horizontal offset from the middle of the pattern. " +
		"Likewise, offset Y controls the vertical offset from the middle of the pattern. "
	);
	createText(place, 
		"To display the changes made to values of these inputs, " + 
		"you can use the 'Update model' button in 3D controller component and/or " + 
		"'Update image' button in texture viewer component. "
	);
}

/**
 * Adds component instructions for the texture viewer
 * to the place specified by the parameter.
 * @param {object} place - place for the instructions
 */
function componentInstructionsTextureViewer(place) {
	makeSmallerTitle(place, "Texture viewer");
	createText(place, 
		"Texture viewer displays a texture image of the 3D model. " + 
		"You can change between the different texture options, which are " +
		"grayscale, red-black, noise terrain and world terrain. " +
		"If you have created new textures with the texture editor, these will also be available for choosing. "
	);
	createText(place, 
		"To update the image, click the 'Update image' button. "
	);
}

/**
 * Adds component instructions for the texture editor
 * to the place specified by the parameter.
 * @param {object} place - place for the instructions
 */
function componentInstructionsTextureEditor(place) {
	makeSmallerTitle(place, "Texture editor");
	createText(place, 
		"You can edit existing texture or create new ones using the texture editor. " +
		"Use texture selection to choose an existing one, or click 'New texture' to create a new one. "
	);
	createText(place, 
		"The option 'Range to world scale' can only be changed for new textures. " + 
		"When checked, the range of colors is scaled in global world height scale, " +
		"otherwise it is scaled locally. " +
		"Textures that range to world scale can only be used in the world map 3D generator. "
	);
	createText(place, 
		"The range of colors can be used to visualize how the colors change in the range of the texture. " +
		"You can click on a color and move it to a different spot in the range. " +
		"You cannot, however, move colors at the beginning and the end of the range. "
	);
	createText(place, 
		"Use the color selection input to choose which color you are about to edit. " +
		"You can also add a new color or remove an existing one. " +
		"The input below that is for the position of the color in the range. " +
		"You can change this manually, or simply move it with your mouse in the range. "
	);
	createText(place, 
		"Color RBG inputs are for red, blue and green values, " +
		"which can range between 0 and 255. " +
		"You can manually input these values, or " + 
		"you can use the color picker to pick a color of your choosing. "
	);
}

/**
 * Adds component instructions for the user input
 * to the place specified by the parameter.
 * @param {object} place - place for the instructions
 */
function componentInstructionsUserInput(place) {
	makeSmallerTitle(place, "User input");
	createText(place, 
		"Click the upload button to upload the image you want to create a 3D model and texture image out of. "
	);
}

/* Functions */

 /**
 * Does everything after page has loaded
 */
window.onload = function() {
	let place = document.getElementById("instructions");
	displayInstructions(place);
}

/**
 * Displays information about the site and its components
 * in a place in the document specified by the parameter.
 * @param {object} place - place in the document
 */
function displayInstructions(place) {
	let title = document.createElement("h1");
	title.appendChild(document.createTextNode("Instructions"));
	place.appendChild(title);
	let site = document.URL.substring(document.URL.lastIndexOf("/")+1);
	place.appendChild(siteInstructions(site));
}

/**
 * Returns the instructions for the specific site
 * @param {string} site - site
 * @returns {object} instructions
 */
function siteInstructions(site) {
	// Create text based on site
	let text;
	switch (site) {
		case "world.html":
			text = worldInstructions();
			break;
		case "noise.html":
			text = noiseInstructions();
			break;
		case "userImg.html":
			text = userImgInstructions();
			break;
		default:
			break;
	}
	return text;
}

/**
 * Adds component instructions for the given components
 * to the place specified by the parameter.
 * @param {object} place - place for the instructions
 * @param {[]} components - array of component names
 */
function componentInstructions(place, components) {
	// makeTitle(place, "Components");
	createText(place, 
		"The blue buttons near the top left corner of the site are the components you can use. " +
		"Click on them to show or hide the components on the site. " +
		"You can also move these components as you want. " + 
		"If you lose a component, click on its blue button to return it to the screen. "
	);
	for (let i of components) {
		switch (i) {
			case "map":
				componentInstructionsMap(place);
				break;
			case "controller 3d":
				componentInstructionsController3D(place);
				break;
			case "noise controller":
				componentInstructionsNoiseController(place);
				break;
			case "texture viewer":
				componentInstructionsTextureViewer(place);
				break;
			case "texture editor":
				componentInstructionsTextureEditor(place);
				break;
			case "user input":
				componentInstructionsUserInput(place);
				break;
			default:
				break;
		}
	}
	instructions3DModel(place);
}

/* Helper functions */

/**
 * Makes a title element with the given title text in the
 * place specified by the parameter
 * @param {object} place - place for the title element
 * @param {string} title - title text
 */
function makeTitle(place, title) {
	let titleElem = document.createElement("h2");
	titleElem.appendChild(document.createTextNode(title));
	place.appendChild(titleElem);
}

/**
 * Makes a smaller title element with the given title text
 * in the place specified by the parameter
 * @param {object} place - place for the title element
 * @param {string} title - title text
 */
function makeSmallerTitle(place, title) {
	let titleElem = document.createElement("h3");
	titleElem.appendChild(document.createTextNode(title));
	place.appendChild(titleElem);
}

/**
 * Makes a text element with the given text in the
 * place specified by the parameter
 * @param {object} place - place for the title element
 * @param {string} text - text
 */
function createText(place, text) {
	let textElem = document.createElement("p");
	textElem.appendChild(document.createTextNode(text));
	place.appendChild(textElem);
}