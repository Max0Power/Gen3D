/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/**
 * Muuntaa desimaaliosan minuuteiksi ja sekunteiksi
 * @param ddd   asteluku desimaalilukuna
 * @return      asteet, minuutit ja sekuntit
 * @example
 *   laskeDms(0.269164) === [0,16,8.9904]
 *   laskeDms(6.602783) === [6,36,10.0188]
 *   laskeDms(-1.230374) ==== [-1,13,49.3464]
 *   
 *   laskeDms(0.5) === [0,30,0]
 *   laskeDms(-0.5) === [-0,30,0]
 *   
 *   laskeDms(2.001) === [2,0,3.6]
 *   laskeDms(1.999) === [1,59,56.4]
 */
function laskeDms(ddd) {
    const ddd_pos = Math.abs(ddd);
    const neg = ddd < 0 ? true : false
    
    var deg = Math.floor(ddd_pos);
    const _min = (ddd_pos-deg)*(60);
    
    const min = Math.floor(_min);
    const _sec = (_min-min)*(60);
    
    const sec = Math.round(_sec*10000)/10000;
    deg = neg ? -deg : deg;
    
    return [deg,min,sec];
}

/**
 * Palauttaa latitudea vastaavan rivi-indeksin
 * @param lat   latituden asteet, minuutit ja sekuntit
 * @return      rivi-indeksi matriisiin
 * @example
 *   laskeI([0,16,8.9904]) === 877
 *   laskeI([-1,13,49.3464]) === 276
 *   
 *   laskeI([0,0,0]) === 1200
 *   laskeI([0,30,0]) === 600
 *   laskeI([0,59,59]) === 0
 */
 // > laskeI([0,0,0])
 // 1200
function laskeI(lat) {
    const arc_sec = (lat[1]*60)+lat[2];
    const i = 1200 - Math.round(arc_sec/3);
    
    /* koska -0 eri kuin +0 */
    if (Object.is(lat[0],-0)) {
        return 1200-i;
    }
    
    return lat[0] < 0 ? (1200-i) : i;
}

/**
 * Palauttaa longitudea vastaavan sarake-indeksin
 * @param lng   longituden asteet, minuutit ja sekuntit
 * @return      sarake-indeksi matriisiin
 * @example
 *   laskeJ([6,36,10.0188]) === 723
 *   laskeJ([-1,13,49.3464]) === 924
 *   
 *   laskeJ([0,0,0]) === 0
 *   laskeJ([0,30,0]) === 600
 *   laskeJ([0,59,59]) === 1200
 */
function laskeJ(lng) {
    const arc_sec = (lng[1]*60)+lng[2];
    const j = Math.round(arc_sec/3);
    
    /* koska -0 eri kuin +0 */
    if (Object.is(lng[0],-0)) {
        return 1200-j;
    }
    
    return lng[0] < 0 ? (1200-j) : j;
}

/**
 * Palauttaa kahden tavun jonosta korkeuden
 * @param i   rivi
 * @param j   sarake
 * @return    indeksi taulukkoon
 * @example
 *   laskeK(0,0) === 0
 *   laskeK(0,2) === 4
 *   
 *   laskeK(1,0) === 2402
 *   laskeK(1,2) === 2406
 *   
 *   laskeK(2,1) === 4806
 *   laskeK(1200,1200) === 2884800
 */
function laskeK(i,j) {
    return (i*1201+j)*2;
}

/**
 * Funktio latitudien vertailuun
 * @param lat_1   latitude desimaalilukuna
 * @param lat_2   latitude desimaalilukuna
 * @return        negatiivista kun lat_1 suurempi
 * @example
 *   [0.269164,6.602783].sort(vertaaLat) === [6.602783,0.269164]
 *   [8.723145,-1.230374].sort(vertaaLat) === [8.723145,-1.230374]
 */
function vertaaLat(lat_1,lat_2) {
    return lat_2 - lat_1;
}

/**
 * Funktio longitudien vertailuun
 * @param lng_1   longitude desimaalilukuna
 * @param lng_2   longitude desimaalilukuna
 * @return        negatiivista kun lng_1 pienempi
 * @example
 *   [0.269164,6.602783].sort(vertaaLng) === [0.269164,6.602783]
 *   [8.723145,-1.230374].sort(vertaaLng) === [-1.230374,8.723145]
 */
function vertaaLng(lng_1,lng_2) {
    return lng_1 - lng_2;
}

/**
 * Järjestää asteluvut pohjoisesta etelään ja lännestä itään
 * @param latlng_1   aste desimaalilukuna
 * @param latlng_2   aste desimaalilukuna
 * @return           negatiivista, kun parametrit järjestyksessä
 * @example
 *   [[-1.230374,8.723145],[0.269164,6.602783]].sort(vertaaLatLng)
 *     === [[0.269164,6.602783],[-1.230374,8.723145]]
 */
function vertaaLatLng(latlng_1,latlng_2) {
    if (latlng_1[0] !== latlng_2[0]) {
        return vertaaLat(latlng_1[0],latlng_2[0]);
    }
    
    return vertaaLng(latlng_1[1],latlng_2[1]);
}

/*
 * Ei käytössä!
 * Palauttaa astelukujen rajaaman neliön lävistäjän pituuden
 * @param latlng_1   latitude tai longitude desimaalina
 * @param latlng_2   latitude tai longitude desimaalina
 * @return           astelukujen etäisyys
 */
/*
function laskeAsteidenEtaisyys(latlng_1,latlng_2) {
    var a = Math.abs(latlng_1[0]-latlng_2[0]);
    var b = Math.abs(latlng_1[1]-latlng_2[1]);
    
    return sqrt(pow(a,2)+pow(b,2));
}
*/

/**
 * @example
 *   range(0,1) === []
 *   range(1,1) === [1]
 *   range(1,0) === [0]
 *   range(2,0) === [0,1]
 */
function range(size, start) {
    return [...Array(size).keys()].map(i => start + i);
}

/**
 * @example
 *   [2,0,-1,3].reduce(laskeMin) === -1
 *   Math.min(...[2,0,-1,3]) === -1
 */
function laskeMin(min,num) {
    return num < min ? num : min;
}

/**
 * @example
 *   [2,0,-1,3].reduce(laskeMax) === 3
 *   Math.max(...[2,0,-1,3]) === 3
 */
function laskeMax(max,num) {
    return num > max ? num : max;
}

/**
 * Laskee kahden numeron summan
 * @param sum   numero
 * @param num   numero
 * @return      sum + num
 * @example
 *   [0].reduce(laskeSumma) === 0
 *   [1,2,3].reduce(laskeSumma) === 6
 */
function laskeSumma(sum, num) {
    return sum + num;
}

/**
 * @example
 *   laskeYlaAla(0.269164,6.602783) === [6.602783,0.269164]
 *   laskeYlaAla(8.723145,-1.230374) === [8.723145,-1.230374]
 */
function laskeYlaAla(lat_1,lat_2) {
    return [lat_1,lat_2].sort(vertaaLat);
}

/**
 * @example
 *   laskeVasOik(0.269164,6.602783) === [0.269164,6.602783]
 *   laskeVasOik(8.723145,-1.230374) === [-1.230374,8.723145]
 */
function laskeVasOik(lng_1,lng_2) {
    return [lng_1,lng_2].sort(vertaaLng);
}

/**
 * Palauttaa astelukujen rajaaman neliön vasemman yläkulman
 * @param latlng_1   koordinaatit desimaaleina
 * @param latlng_2   koordinaatit desimaaleina
 * @return           vasemman yläkulman koordinaatit
 * @example
 *   laskeVasYla([-1.230374,6.602783],[0.269164,8.723145])
 *     === [0.269164,6.602783]
 */
function laskeVasYla(latlng_1,latlng_2) {
    const lats = laskeYlaAla(latlng_1[0],latlng_2[0]);
    const lngs = laskeVasOik(latlng_1[1],latlng_2[1]);
    
    return [lats[0],lngs[0]];
}

/**
 * Palauttaa astelukujen rajaaman neliön oikean alakulman
 * @param latlng_1   koordinaatit desimaaleina
 * @param latlng_2   koordinaatit desimaaleina
 * @return           oikean alakulman koordinaatit
 * @example
 *   laskeOikAla([-1.230374,6.602783],[0.269164,8.723145])
 *     === [-1.230374,8.723145]
 */
function laskeOikAla(latlng_1,latlng_2) {
    const lats = laskeYlaAla(latlng_1[0],latlng_2[0]);
    const lngs = laskeVasOik(latlng_1[1],latlng_2[1]);
    
    return [lats[1],lngs[1]];
}

/**
 * Palauttaa kahden pisteen väliset asteparit taulukossa
 * @param latlng_1   asteet desimaaleina
 * @param latlng_2   asteet desimaaleina
 * @return           asteparit parametrien väliltä
 * @example
 *   laskeAsteet([-0.230374,6.602783],[0.269164,7.723145])
 *     === [[0,6],[0,7],[-1,6],[-1,7]]
 */
function laskeAsteet(latlng_1,latlng_2) {
    const vas_yla = (laskeVasYla(latlng_1,latlng_2)).map(Math.floor);
    const oik_ala = (laskeOikAla(latlng_1,latlng_2)).map(Math.floor);
    
    var t = [];
    for (var i = oik_ala[0]; i <= vas_yla[0]; i++) {
        for (var j = vas_yla[1]; j <= oik_ala[1]; j++) {
            t.push([i,j]);
        }
    }
    
    return t.sort(vertaaLatLng);
}

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
    if (lkm < 1 || total < 2 || total <= lkm) {
	throw new Error("Virhe!");
    }
    
    // total = (chunk * lkm) - (overlap * (lkm-1))
    // chunk = ((lkm-1) * overlap + total) / lkm
    const chunk = math.ceil((total + lkm-1) / lkm);
    var overlap = (chunk * lkm - total) / (lkm-1);
    overlap = isNaN(overlap) ? 0 : overlap; // div-by-zero
    
    return [chunk,overlap];
}

/**
 * Ovatko koordinaatit annetun neliön sisäpuolella
 * @param position   koordinaatit joita tutkitaan
 * @param square     neliön keskipiste johon verrataan
 * @param treshold   neliön sivun pituus eli koko
 * @return           true jos sisällä, muuten false
 * @example
 *   insideSquare([0,0],[0,0],0) === true
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
    return math.abs(position[0] - square[0]) <= treshold / 2 &&
	math.abs(position[1] - square[1]) <= treshold / 2;
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
    var result = square.slice();

    for (var i = 0; i < square.length; i++) {
	var diff = position[i] - square[i];
	if (math.abs(diff) > treshold / 2) {
	    var sign = diff / math.abs(diff);
	    var fact = math.round(math.abs(diff) / treshold);
	    result[i] += sign * fact * treshold;
	}
    }

    return result;
}
