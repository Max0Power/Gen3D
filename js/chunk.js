"use strict"

/**
 * Lasketaan ositetun matriisin alkioiden määrän per ositus
 * @param total   montako riviä ja saraketta on matriisissa
 * @param lkm     kuinka moneen osaan matriisi ositetaan
 * @return        alimatriisin koko sekä päällekkäisyys
 * @example
 *   laskeChunk(5,4) === [2,1]
 *   laskeChunk(5,3) === [3,2]
 *   laskeChunk(4,3) === [2,1]
 *   laskeChunk(4,2) === [3,2]
 *   laskeChunk(5,2) === [3,1]
 *   laskeChunk(5,1) === [5,0]
 *   laskeChunk(4,1) === [4,0]
 *
 *   laskeChunk(1201,8) === [151,1]
 *   laskeChunk(1201,1) === [1201,0]
 */
function laskeChunk(total,lkm) {
    const chunk = math.ceil((total + lkm-1) / lkm);
    const overlap = lkm <= 1 ? 0 : (chunk * lkm - total) / (lkm-1);

    return [chunk,overlap];
}

/**
 * Ovatko koordinaatit annetun neliön sisäpuolella
 * @param position   koordinaatit joita tutkitaan
 * @param square     neliön keskipiste johon verrataan
 * @param treshold   neliön sivun pituus eli koko
 * @return           true jos sisällä, muuten false
 *
 * Huom! Jos treshold 0, niin neliö ei koskaan siirry,
 * joten ei myöskään kannattaisi päivittää. ks. Huom!
 *
 * @example
 *   Huom! insideSquare([0,0],[0,0],0) === true
 *   Huom! insideSquare([0,0.5],[0,0],0) === true
 *   insideSquare([0,0.5],[0,0],1) === true
 *   insideSquare([0,0.6],[0,0],1) === false
 *   insideSquare([0,1],[0,0],2) === true
 *   insideSquare([0,1.1],[0,0],2) === false
 *   insideSquare([-0.6,0],[1,0],1) === false
 *   insideSquare([-0.5,0],[1,0],1) === false
 *   insideSquare([-0.5,0],[0,0],1) === true
 *   insideSquare([-0.6,0],[0,0],1) === false
 */
function insideSquare(position,square,treshold) {
    const inside = !range(position.length,0).some(i => {
	return math.abs(position[i]-square[i]) > treshold/2;
    });

    return treshold === 0 ? true : inside;
}

/**
 * Palauttaa neliön keskipisteen, joka sisältää
 * annetut koordinaatit. Neliöt eivät koskaan
 * leikkaa toisiaan, mutta kattavat koordinaatiston.
 *
 * @param position   koordinaatit joita tutkitaan
 * @param square     neliön keskipiste johon verrataan
 * @param treshold   neliön sivun pituus eli koko
 * @return           koordinaatit sisältävä neliö
 *
 * Huom! Jos hyppää neliön reunalle, niin pyöristyksen
 * vuoksi valitaan sitä seuraava neliö. ks Huom!
 *
 * @example
 *   replaceSquare([0,0],[0,0],0) === [0,0]
 *   replaceSquare([0,0.4],[0,0],1) === [0,0]
 *   Huom! replaceSquare([0,0.5],[0,0],1) === [0,0]
 *   replaceSquare([0,0.6],[0,0],1) === [0,1]
 *   replaceSquare([0,1],[0,0],2) === [0,0]
 *   replaceSquare([0,1.1],[0,0],2) === [0,2]
 *   replaceSquare([-0.4,0],[1,0],1) === [0,0]
 *   Huom! replaceSquare([-0.5,0],[0,0],1) === [0,0]
 *   Huom! replaceSquare([-0.5,0],[1,0],1) === [-1,0]
 *   replaceSquare([-0.6,0],[1,0],1) === [-1,0]
 *   replaceSquare([-0.6,0],[0,0],1) === [-1,0]
 */
function replaceSquare(position,square,treshold) {
    const zero = treshold === 0 ? 1 : treshold;
    
    return range(square.length,0).map(i => {
	var diff = position[i] - square[i];
	var sign = diff / Math.abs(diff);
	var fact = Math.round(Math.abs(diff) / zero);
	var tmp = square[i] + sign * fact * treshold;

	return Math.abs(diff) > treshold/2 ? tmp : square[i];
    });
}

/**
 * Palauttaa välin arvot järjestyksessä
 * @param from   välin alkupiste
 * @param to     välin päätepiste
 * @return       välin arvot taulukossa
 * @example
 *   rangeFromTo(0,0) === [0]
 *   rangeFromTo(0,1) === [0,1]
 *   rangeFromTo(0,-1) === [0,-1]
 *   rangeFromTo(-1,-2) === [-1,-2]
 *   rangeFromTo(1,2) === [1,2]
 *   rangeFromTo(-1,1) === [-1,0,-1]
 *   rangeFromTo(1,0) === [1,0]
 *   rangeFromTo(-1,0) === [-1,0]
 *   rangeFromTo(1,-1) === [1,0,-1]
 */
function rangeFromTo(from,to) {
    const diff = to - from;
    const abs = Math.abs(diff);
    const sign = diff === 0 ? 1 : diff / abs;

    return range(abs+1,0).map(i => from + sign * i); // js/kaavat.js
}

/**
 * Palauttaa välin koordinaatit järjestyksessä
 * @param from   välin alkupiste
 * @param to     välin päätepiste
 * @return       välin koordinaatit taulukossa
 * @param   alkupiste
 * @example
 *   rangeFromToArray([],[]) === []
 *   rangeFromToArray([0,0],[0,0]) === [[0,0]]
 *
 *   rangeFromToArray([0,0],[0,1]) === [[0,0],[0,1]]
 *   rangeFromToArray([0,0],[1,0]) === [[0,0],[1,0]]
 *   rangeFromToArray([0,0],[1,1]) === [[0,0],[0,1],[1,0],[1,1]]
 *
 *   rangeFromToArray([1,1],[0,0]) === [[1,1],[1,0],[0,1],[0,0]]
 *   rangeFromToArray([1,0],[0,0]) === [[1,0],[0,0]]
 *   rangeFromToArray([0,1],[0,0]) === [[0,1],[0,0]]
 */
function rangeFromToArray(from,to) {
    const rows = rangeFromTo(from[0],to[0]);
    const cols = rangeFromTo(from[1],to[1]);

    const result = [];
    rows.forEach(row => {
	cols.forEach(col => {
	    result.push([row,col]);
	});
    });

    return result;
}

/**
 * Palauttaa taulukossa osaneliöiden koordinaatit,
 * jotka muodostavat `chunk x chunk` -kokoisen neliön,
 * jonka keskipisteen koordinaatit ovat `square`
 *
 * @param square   neliön keskipiste
 * @param chunk    neliö jakautuu n-osaan
 * @return         neliöt joista chunk koostuu
 * @example

 *   rangeSquare([],0) === []
 *   rangeSquare([0,0],-1) === [[0,0]]
 *   rangeSquare([0,0],0) === [[0,0]]
 *   rangeSquare([0,0],1) === [[0,0]]
 *   rangeSquare([0,0],-2) === rangeSquare([0,0],2)
 *   rangeSquare([0,0],2) === rangeSquare([0,0],3)
 *   rangeSquare([0,0],3) === [[-1,-1],[-1,0],[-1,1],
 *     [0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]]
 */
function rangeSquare(square,chunk) {
    const half = Math.floor(Math.abs(chunk) / 2);
    const leftbottom = square.map(val => val-half);
    const righttop = square.map(val => val+half);

    return rangeFromToArray(leftbottom,righttop);
}

/**
 * Tarkistaa ovatko taulukot samat
 * @param fstarr   eka taulukko
 * @param sndarr   toka taulukko
 * @return         ovatko samat
 * @example
 *   arrayEquals([],[]) === true
 *   arrayEquals([1],[]) === false
 *   arrayEquals([],[0]) === false
 *   arrayEquals([1],[1]) === true
 *   arrayEquals([1],[12]) === false
 */
function arrayEquals(fstarr,sndarr) {
    return range(fstarr.length,0)
        .map(i => fstarr[i] === sndarr[i])
        .every(item => item === true);
}

/**
 * Suodattaa matriisin dupliikatti-taulukot, 
 * jotka sisältyvät usemapaan kertaan
 * @param set   suodatettava matriisi
 * @return      suodatettu matriisi
 * @example
 *   matriisiSuodata([[]]) === [[]]
 *   matriisiSuodata([[0,0],[1,1]]) === [[0,0],[1,1]]
 *   matriisiSuodata([[1,1],[1,1]]) === [[1,1]]
 */
function matriisiSuodata(set) {
    return set.filter((arr,i) => {
	return !set.slice(i+1).some(cur => {
	    return arrayEquals(arr,cur);
	});
    });
}

/**
 * Kaksiulotteisten taulukoiden leikkaus,
 * eli taulukot jotka sisältyvät molempiin
 * @param fstset   eka kaksiulotteinen taulukko
 * @param sndset   toka kaksiulotteinen taulukko
 * @return         leikkaus eli yhteiset alkiot
 * @example
 *   matriisiLeikkaus([[]],[[]]) === [[]]
 *   matriisiLeikkaus([[0,0],[0,1]],[[1,0],[1,1]]) === []
 *   matriisiLeikkaus([[0,0],[0,1]],[[1,0],[0,1]]) === [[0,1]]
 *   matriisiLeikkaus([[0,0]],[[0,0],[1,1]]) === [[0,0]]
 *   matriisiLeikkaus([[0,0]],[[0,0],[0,0]]) === [[0,0]]
 *   matriisiLeikkaus([[0,0],[0,0]],[[0,0]]) === [[0,0]]
 */
function matriisiLeikkaus(fstset,sndset) {
    const intersect = fstset.filter(fstarr => {
	return sndset.some(sndarr => {
	    return arrayEquals(fstarr,sndarr);
	});
    });

    return matriisiSuodata(intersect);
}

/**
 * Palauttaa ensimmäisen ja toisen matriisin erotuksen
 * eli matriisin, jonka taulukot sisältyvät vain toiseen
 * Huom! Parametrien järjestyksellä on merkitystä!
 * 
 * @param fstset   matriisi josta poistetaan
 * @param sndset   matriisi jolla poistetaan
 * @return         matriisi fstset ilman sndset alkioita
 * @example
 *   matriisiErotus([[]],[[]]) === []
 *   matriisiErotus([[0,0],[0,1]],[[1,0],[1,1]]) === [[0,0],[0,1]]
 *   matriisiErotus([[0,0],[0,1]],[[1,0],[0,1]]) === [[0,0]]
 *   matriisiErotus([[0,0]],[[0,0],[1,1]]) === []
 *   matriisiErotus([[0,0],[1,1]],[[0,0]]) === [[1,1]]
 */
function matriisiErotus(fstset,sndset) {
    const intersect = matriisiLeikkaus(fstset,sndset);

    return fstset.filter(fstarr => {
	return !intersect.some(sndarr => {
	    return arrayEquals(fstarr,sndarr);
	});
    });
}

/**
 * Skaalaa taulukon arvot alaspäin annettulla arvolla.
 * Funktiota kannattaa kutsua ennen koordinaattien 
 * käsittelyä, jotta laskut olisivat yksinkertaisempia
 * 
 * @param square     skaalattavat arvot taulukossa
 * @param treshold   arvo johon skaalataan alaspäin
 * @return           skaalatut arvot taulukossa
 * @example
 *   descale([0,128],0) === [0,128]
 *   descale([0,128],128) === [0,1]
 *   descale([256,128],128) === [2,1]
 *   descale([-256,-128],128) === [-2,-1]
 */
function descale(square,treshold) {
    const ratio = treshold === 0 ? 1 : treshold;    
    return square.map(val => val / ratio);
}

/**
 * Laskee päällekkäisten koordinaattien
 * sijoittumisen koordinaatin etäisyyden
 * ja päällekkäisten arvojen määrän mukaan
 * @param square    siirrettävät koordinaatit
 * @return          siirretyt koordinaatit
 * @example
 *   doscale([],1) === []
 *   doscale([0,1],0) === [0,0]
 *   doscale([0,1],1) === [0,1]
 *   doscale([1,2],2) === [2,4]
 *   doscale([-1,-2],2) === [-2,-4]
 */
function doscale(square,treshold) {
    return square.map(val => val * treshold);
}

/**
 * Skaalaa taulukon arvot ylöspäin annettuun arvoon.
 * Funktiota kannattaa kutsua koordinaattien käsittelyn
 * jälkeen, jotta laskut olisivat yksinkertaisempia
 * 
 * @param square     skaalattavat arvot taulukossa
 * @param treshold   arvo johon skaalataan ylöspäin
 * @return           skaalatut arvot taulukossa
 * @example
 *   doscaleArray([],128) === []
 *   doscaleArray([[0,0]],128) === [[0,0]]
 *   doscaleArray([[1,2],[-1,2]],0) === [[0,0],[0,0]]
 *   doscaleArray([[1,2],[-1,2]],1) === [[1,2],[-1,2]]
 *   doscaleArray([[2,1],[-2,-1]],128) === [[256,128],[-256,-128]]
 */
function doscaleArray(squares,treshold) {
    return squares.map(arr => doscale(arr,treshold));
}
