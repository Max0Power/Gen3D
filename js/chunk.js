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
	return Math.abs(position[i]-square[i]) > treshold/2;
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
 *   rangeSquare([0,0],-2) === [[-0.5,-0.5],...,[0.5,0.5]]
 *   rangeSquare([0,0],2) === [[-0.5,-0.5],...,[0.5,0.5]]
 *   rangeSquare([0,0],3) === [[-1,-1],...,[1,1]]
 */
function rangeSquare(square,chunk) {
    const odd = Math.floor(Math.abs(chunk) / 2);
    const even = Math.abs(chunk)/2 - 0.5;

    // parillinen vaiko pariton
    var either = chunk % 2 === 0 ? even : odd;
    const leftbottom = square.map(val => val - either);
    const righttop = square.map(val => val + either);

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
 * Skaalaa taulukon arvot alaspäin annettulla arvolla.
 * Funktiota kannattaa kutsua ennen koordinaattien 
 * käsittelyä, jotta laskut olisivat yksinkertaisempia
 * 
 * @param square     skaalattavat arvot taulukossa
 * @param treshold   arvo johon skaalataan alaspäin
 * @return           skaalatut arvot taulukossa
 * @example
 *   descaleArray([],128) === []
 *   descaleArray([[0,0]],128) === [[0,0]]
 *   descaleArray([[128,256],[-128,256]],0) === [[0,0],[0,0]]
 *   descaleArray([[128,256],[-128,256]],1) === [[1,2],[-1,2]]
 *   descaleArray([[256,128],[-256,-128]],128) === [[2,1],[-2,-1]]
 */
function descaleArray(squares,treshold) {
    return squares.map(arr => descale(arr,treshold));
}

/**
 * Laskee päällekkäisten koordinaattien
 * sijoittumisen koordinaatin etäisyyden
 * ja päällekkäisten arvojen määrän mukaan
 * @param square     skaalattavat arvot taulukossa
 * @param treshold   arvo johon skaalataan ylöspäin
 * @return           skaalatut arvot taulukossa
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

/**
 * Suorittaa koordinaattien siirtämisen
 * @param squares    siirrettävät kordinaatit
 * @param transits   koordinaattien siirtomäärät
 * @return           siirretyt koordinaatit
 * @example
 *   transitArray([],[]) === []
 *   transitArray([[-256,-128]],[[-2,-1]]) === [[-254,-127]]
 *   transitArray([[256,128]],[[2,1]]) === [[254,127]]
 *   transitArray([[-128,128]],[[-2,2]]) === [[-126,126]]
 *   transitArray([[-256,256]],[[-4,4]]) === [[-252,252]]
 */
function transitArray(squares,transits) {
    return range(squares.length,0).map(i => {
	var x = squares[i][0] - transits[i][0];
	var z = squares[i][1] - transits[i][1];

	return [x,z];
    });
}

/**
 * Chunkien tärkein funktio, joka laskee käytännössä kaiken!
 * 
 * Huom! Jos tulee ongelmia, katso debuggerilla mihin asti
 * tulokset näyttävät oikein ja tarkista kyseinen funktio.
 * 
 * @example
 *   getChunks([0,0],3,128,1) === [[-127,-127],...,[127,127]]
 *   getChunks([0,0],5,128,1) === [[-254,-254],...,[254,254]]
 *   getChunks([0,0],2,128,2) === [[-62,-62],...,[62,62]]
 *   getChunks([0,0],4,128,2) === [[-186,-186],...,[186,186]]
 *   
 *   getChunks([0,0],3,128,2) === [[-126,-126],...,[126,126]]
 *   getChunks([0,0],5,128,2) === [[-250,-250],...,[250,250]]
 */
function getChunks(position,square,chunk,treshold,overlay) {
    // etsii vanhat chunkit (välitulos)
    const oldsquare = square.slice();
    var oldsquares = descale(oldsquare,treshold);
    oldsquares = rangeSquare(oldsquares,chunk);
    oldsquares = doscaleArray(oldsquares,treshold);

    // etsii uusien chunkien päivitysalueen sekä
    // uudet ja osittain vanhat chunkit (välitulos)
    const newsquare = replaceSquare(position,oldsquare,treshold);
    var newsquares = descale(newsquare,treshold);
    newsquares = rangeSquare(newsquares,chunk);
    newsquares = doscaleArray(newsquares,treshold);

    // etsii poistettavat ja lisättävät koordinaatit
    const intersect = matriisiLeikkaus(oldsquares,newsquares);
    const olddiffer = matriisiErotus(oldsquares,intersect);
    const newdiffer = matriisiErotus(newsquares,intersect);

    // etsii poistettavien chunkien todelliset koordinaatit
    var oldtransits = descaleArray(olddiffer,treshold);
    oldtransits = doscaleArray(oldtransits,overlay);
    oldtransits = transitArray(olddiffer,oldtransits);

    // etsii lisättävien chunkien todelliset koordinaatit
    var newtransits = descaleArray(newdiffer,treshold);
    newtransits = doscaleArray(newtransits,overlay);
    newtransits = transitArray(newdiffer,newtransits);

    // palauttaa vanhojen ja uusien chunkien koordinaatit
    // sekä uudelleen päivitysalueen keskipisteen, johon
    // kameran sijaintia ja päivitysaluetta tulee verrata
    return [newsquare,oldtransits,newtransits];
}

function resolveOffsets() {
    throw new Error("Not implemented error!");
    // TODO: ratkaise chunkien kaipaamat offsetit
}
