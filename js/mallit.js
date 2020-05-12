/*jshint esnext: true */
/*jshint -W097 */
/*global laskeRivit */
/*global laskeSumma */
/*global laskeSarakkeet */
/*global laskeAsteet */
/*global File */

"use strict";

/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/**
 * TODO: käytä korjausta
 * Palauttaa kartan file-oliot kahden pisteen väliltä
 * @param latlng_1   asteet desimaaleina
 * @param latlng_2   asteet desimaaleina
 * @param max        file-olioiden max koko yhteensä
 * @return           file-oliot ilman korkeuksia
 * @example
 *   fileTehtaat([0.269164,6.602783],[-1.230374,7.723145])
 *     === N00E006,N00E007,S01E006,S01E007,S02E006,S02E007
 */
function fileTehtaat(latlng_1,latlng_2,max=200) {
    /*
    var askelI = (Math.abs(latlng_1[0]-latlng_2[0])*1201-1)/(max-1);
    var askelJ = (Math.abs(latlng_1[1]-latlng_2[1])*1201-1)/(max-1);
    */
    
    const rows = laskeRivit(latlng_1[0],latlng_2[0]).reduce(laskeSumma); // js/matriisi.js, js/kaavat.js
    const cols = laskeSarakkeet(latlng_1[1],latlng_2[1]).reduce(laskeSumma); // js/matriisi.js, js/kaavat.js
    
    var askelI = Math.max(1, Math.floor(rows/max)); // max > 0
    var askelJ = Math.max(1, Math.floor(cols/max)); // max > 0
    
    const as = laskeAsteet(latlng_1,latlng_2); // js/kaavat.js
    
    var t = [];
    for (var i = 0; i < as.length; i++) {
        t[i] = new File(as[i],latlng_1,latlng_2); // modules/File.js
        t[i].setHeightAndWidth(askelI,askelJ); // modules/File.js
        //t[i].setJakojaannos(apui[i],apuj[i])
    }
    
    return t;
    
    function laskeKorjaus(pituus,askel,korjaus) {
        var jakojaannos = (pituus-1)%askel;
        var korjattu = askel-1-korjaus-jakojaannos;
        
        return korjattu;
    }
}

/**
 * Palauttaa leafletin metodin getBounds() pisteet latlng
 * @param bounds   leafletin käyttämät _northEast ja _southWest
 * @return         vasen yläkulma ja oikea alakulma desimaaleina
 * @example
 *   const a = {_northEast: {lat: 0.3399321605918826, lng: 6.589933016685593}, _southWest: {lat: 0.16006783940811178, lng: 6.410066983314443}}
 *   
 *   const b = {_northEast: {lat: 0.6996608029593605, lng: 6.949665083535207}, _southWest: {lat: -0.19966080295935348, lng: 6.050334916464829}}
 *   
 *   getBoundsSovitin(a) === [[0.3399321605918826,6.410066983314443],
 *     [0.16006783940811178,6.589933016685593]]
 *   getBoundsSovitin(b) === [[0.6996608029593605,6.050334916464829],
 *     [-0.19966080295935348,6.949665083535207]]
 */
function getBoundsSovitin(bounds) {
    const latlng_1 = [bounds._northEast.lat,bounds._southWest.lng];
    const latlng_2 = [bounds._southWest.lat,bounds._northEast.lng];
    
    return [latlng_1,latlng_2];
}
