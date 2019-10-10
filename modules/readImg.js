/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

"use strict";

function getImageData(url) {
	var img = new Image();
	img.src = url;
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d'); // piirtaa kuvan
	
	var width = img.naturalWidth;
	var height = img.naturalHeight;
	
	canvas.width = width;
	canvas.height = height;
	ctx.drawImage(img, 0, 0);
	
	var imgData = ctx.getImageData(0, 0, width, height).data;
	var heights = new Array(width);
	for (var x = 0; x < width; x++) {
		var h_tmp = new Array(height); // luodaan taulukko, joka vastaa yhta pystyrivia valitulta alueelta
		for (var y = 0; y < height; y++) {
			var pixelIndex = (x + (y * width)) * 4; // lasketaan pikselin indeksi, kuvan datasta
			h_tmp[y] = imgData[pixelIndex] / 255; // lasketaan korkeus
		}
		heights[x] = h_tmp; // asetetaan luotu pystyrivi heights taulukkoon
	}
	
	return heights;
}
