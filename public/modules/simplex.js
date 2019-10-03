/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * Simplex funktio pohjautuu Stefan Gustavsonin julkaisemaan artikkeliin: Simplex noise demystified (2005-03-22), joka loytyy osoitteesta:
 * http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf, artikkelin algoritmi on tehty javalla ja kaannetty tahan versioon javascriptiksi tehostetusti.
 */

"use strict"; 
 
 /**
  * Generoi noise mapin annetuilla parametreilla, toteutuksessa on kaytetty YouTubesta loytyvaa tutoriaalia: Otsikko: Procedural Landmass Generation (E03: Octaves), sivu: https://www.youtube.com/watch?v=MRNFcywkUSA
  * tekijä: Sebastian Lague, julkaistu: 10.2.2016.
  * Eli generoi matriisin, joka sisaltaa arvoja valilta 0-1, tassa Noise luodaan simplex funktiolla
  */
 function generateNoiseMap(width, height, scale, seed, octaves, persistance, lacunarity, offsets) {
	 
	 // ALUSTUKSET, JOITA KAYTETAAN simplex2D FUNKTIOSSA:
	 
	 // Ken Perlinin kayttama permutaatio:
	 var p = [151,160,137,91,90,15,
	131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
	190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
	88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
	77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
	102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
	135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
	5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
	223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
	129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
	251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
	49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
	138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
	
	var grad3 = [ [1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
	[1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
	[0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1] ];
	
	// To remove the need for index wrapping, double the permutation table length
	var perm = new Array(512);	
	for (var i = 0; i < perm.length; i++) {
		// 0101 & 0000 --> 0000
		// 1001 & 1110 --> 1000
		// 0101 & 0100 --> 0100
		// 0101 & 1111 --> 0101
		// binary & binary on yhdistys operaatio 1 & 1 -> 1 | 0 & 0 -> 0 | 0 & 1 -> 0 | 1 & 0 -> 0
		perm[i] = p[i&255]
	}

	// NOISE FUNKTIO, pohjautuu Stefan Gustavsonin julkaisemaan artikkeliin
	function simplex2D(xin, yin) {
		/**
		 * Pistetulo, simplex2D funktion apufunktio
		 */
		function dot2(vec1, vec2) {
			return (vec1[0] * vec2[0]) + (vec1[1] * vec2[1]);
		}
		
		// Skew the input space to determine which simplex cell we're in
		var s = (xin + yin) * (0.5 * (Math.sqrt(3.0) - 1.0)); // Hairy factor for 2D
		var i = Math.floor(xin + s); // pyoristaa alaspain lahimpaan integeriin
		var j = Math.floor(yin + s);
		
		var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
		var x_y_i = [0, 0, 0];
		x_y_i[0] = [xin - (i - ((i + j) * G2)), yin - (j -  ((i + j) * G2))]; // The x,y distances from the cell origin
		
		// For the 2D case, the simplex shape is an equilateral triangle.
		// Determine which simplex we are in.
		var i1 = 0, j1 = 1; // upper triangle, YX order: (0,0)->(0,1)->(1,1) // Offsets for second (middle) corner of simplex in (i,j) coords
		if (x_y_i[0][0] > x_y_i[0][1]) { // lower triangle, XY order: (0,0)->(1,0)->(1,1
			i1 = 1;
			j1 = 0;
		}
		
		// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
		// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
		// c = (3-sqrt(3))/6
		x_y_i[1] = [x_y_i[0][0] - i1 + G2, x_y_i[0][1] - j1 + G2]; // Offsets for middle corner in (x,y) unskewed coords
		x_y_i[2] = [x_y_i[0][0] - 1.0 + 2.0 * G2, x_y_i[0][1] - 1.0 + 2.0 * G2]; // Offsets for last corner in (x,y) unskewed coords
		
		// Work out the hashed gradient indices of the three simplex corners
		var g_i = [perm[(i & 255)+perm[(j & 255)]] % 12, perm[(i & 255)+i1+perm[(j & 255)+j1]] % 12, perm[(i & 255)+1+perm[(j & 255)+1]] % 12];
		
		// Calculate the contribution from the three corners
		var n_i = [0, 0, 0]; // noise contributions from three corners
		for (var index = 0; index < 3; index++) {
			var t = 0.5 - x_y_i[index][0]*x_y_i[index][0] - x_y_i[index][1]*x_y_i[index][1];
			if (t < 0) n_i[index] = 0.0;
			else {
				t *= t;
				n_i[index] = t * t * dot2(grad3[g_i[index]], x_y_i[index]);
			}
		}
		
		// Add contributions from each corner to get the final noise value.
		// The result is scaled to return values in the interval [-1,1].
		return 70.0 * (n_i[0] + n_i[1] + n_i[2]);	
	}
	
	// generateNoiseMap FUNKTION TOIMINTA ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	if (scale <= 0) scale = 0.001; // scale ei voi olla <= 0
	
	var octave_offsets = new Array(octaves);
	/* taysin randomit octaavien offsetit (jos seedilla luodut offsetit ei ole kaytossa!)
	for (var i = 0; i < octaves; i++) {
		var off_x = Math.floor(Math.random() * 200001 - 100000); // [-100000, 100000]
		var off_y = Math.floor(Math.random() * 200001 - 100000); // [-100000, 100000]
		octave_offsets[i] = [off_x + offsets[0], off_y + offsets[1]];
	}*/
	
	const prng = new LCG(seed); // luodaan Linear congruential generator, joka antaa offsetit oktaaveille annetulla seedilla
	for (var i = 0; i < octaves; i++) {
		var off_x = Math.floor(prng.next() * 200001 - 100000); // [-100000, 100000]
		var off_y = Math.floor(prng.next() * 200001 - 100000); // [-100000, 100000]
		octave_offsets[i] = [off_x + offsets[0], off_y + offsets[1]]; // asetetaan oktaavin offsetit
	}
	
	var minNoiseHeight = 100000; // pidetaan tallessa generoidun noisen min ja max height, jotta noiseMap saadaan muutettua valille [0-1]
	var maxNoiseHeight = -100000;
	
	// generoidaan ensiksi noise matriisiin, saa arvoja valilta [-1,1]
	var noiseMap = new Array(width); // vaaka rivi, johon tallenntaan pysty taulukot
	for (var x = 0; x < width; x++) {
		var noiseMap_tmp = new Array(height); // pysty rivi,johon generoidaan arvot
		for (var y = 0; y < height; y++) {
			
			// noise parametreja
			var amplitude = 1.0;
			var frequency = 1.0; // tiheys, milta valilta noisen arvoja kerataan
			var noiseHeight = 0; // kerrytetaan lopullinen noisen generoitu korkeus tahan	

			// oktaavit maarittalavat lopulta lopullisen noiseHeightin:
			for (var i = 0; i < octaves; i++) {
				
				var noiseX = (x - (0.5 * width)) / scale * frequency + octave_offsets[i][0]; // noisen x-koordinaatti
				var noiseY = (y - (0.5 * height)) / scale * frequency + octave_offsets[i][1]; // noisen y-koordinaatti
				
				noiseHeight += (simplex2D(noiseX, noiseY) * amplitude); // otetaan noise arvo, ja kasvaetetaan noiseHeightia
				
				amplitude *= persistance; // kasitellaan amplitude ja frequency kayttajan syotteilla
				frequency *= lacunarity;
			}
			
			// pidetaan generoidun noisen maksimi ja minimi korkeutta ylla
			if (noiseHeight < minNoiseHeight) minNoiseHeight = noiseHeight;
			if (noiseHeight > maxNoiseHeight) maxNoiseHeight = noiseHeight;
			
			noiseMap_tmp[y] = noiseHeight; // asetetaan generoitu noiseHeight
		}
		
		noiseMap[x] = noiseMap_tmp; // asetetaan pystyrivi noisemappiin
	}
	
	// kaydaan noiseMap uudestaan lapi ja asetetaan arvot valille 0-1
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			noiseMap[x][y] = (noiseMap[x][y] - minNoiseHeight) / (maxNoiseHeight - minNoiseHeight); // inverse lerp valille [0-1]
		}
	}
	
	return noiseMap; // palautetaan lopuksi generoitu noiseMap
 }
 
 
/**
 * Linear congruential generator, eli luo "random" luokan, joka palauttaa samalla seedilla aina samat arvot jarjestyksessa
 * metodia next() kutsuttaessa. Vertaus c# systemin randomiin seedilla
 * Tehty wikipedian pohjalta:  https://en.wikipedia.org/wiki/Linear_congruential_generator
 * @author Jussi Parviainen
 * @version 26.10.2018
 */
class LCG {
	constructor(seed) {
		this.x_n = seed; // start value tai seed | arvo valilta 0 <= x_n < m
		this.m = 16777216; // modulus 2^24 | isompaa kuin 0
		this.a = 1049213; // multiplier | arvo valilta: 0 < a < m
		this.c = 4194627; // increment | arvo valilta 0 <= c < m
	}
	
	/**
	 * Antaa seuraavan luvun LGC:sta
	 * luku on valilta [0-1]
	 */
	next() {
		this.x_n = (this.a * this.x_n + this.c) % this.m; // lasketaan x_n arvo
		return this.x_n / this.m; // muunnetaan valille [0-1] ja palautetaan
	}
}