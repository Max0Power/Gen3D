/**
 * Joukko merkkijonoaliohjelmia Ohjelmointi 2-kurssin käyttöön
 * @author Vesa Lappalainen
 * @version 1.3, 12.08.2008
 * 
 * Funktioita tiedostonimien ja asteiden käsittelyyn
 * @author Harri Linna
 * @version 20.10.2018
 */

/*
 * Ei käytössä!
 * Palauttaa negatiivista, jos ensimmäisenä parametrina
 * on pohjoisempi ja/tai läntisempi asteluku
 * @param tiedosto_1   tiedostonimi
 * @param tiedosto_2   tiedostonimi
 * @return             astelukujen järjestys
 * @example
 *   ["S01W001","N00W001","N00E000"].sort(vertaaTiedostonimet)
 *     === ["N00W001","N00E000","S01W001"]
 */
/*
function vertaaTiedostonimet(tiedosto_1,tiedosto_2) {
    const latlng_1 = annaAsteet(tiedosto_1);
    const latlng_2 = annaAsteet(tiedosto_2);
    
    return vertaaLatLng(latlng_1,latlng_2);
}
*/

/*
 * Ei käytössä!
 * Palauttaa kaikki tiedostonimet parametrien väliltä
 * @param latlng_1   desimaalipari
 * @param latlng_2   desimaalipari
 * @return           tiedostonimet taulukossa
 * @example
 *   annaTiedostonimet([-0.230374,6.602783],[0.269164,7.723145])
 *     === ["N00E006","N00E007","S01E006","S01E007"]
 */
/*
function annaTiedostonimet(latlng_1,latlng_2) {
    return laskeAsteet(latlng_1,latlng_2).map(annaTiedostonimi);
}
*/

/**
 * Palauttaa asteita vastaavan tiedostonimen
 * @param asteet   lat ja lng taulukossa
 * @return         tiedostonimi merkkijonona
 * @example
 *   annaTiedostonimi([0,6]) === "N00E006"
 *   annaTiedostonimi([-1,-2]) === "S01W002"
 */
function annaTiedostonimi(asteet) {
    var nimi = "";
    
    const lat = asteet[0];
    const lng = asteet[1];
    
    nimi += lat < 0 ? "S" : "N";
    nimi += fmt(""+Math.abs(lat),2,"0");
    
    nimi += lng < 0 ? "W" : "E";
    nimi += fmt(""+Math.abs(lng),3,"0");
    
    return nimi;
}

/*
 * Ei käytössä!
 * Palauttaa tiedostonimen sisältävät asteet
 * @param tiedostonimi   tiedostonimi päätteen kanssa tai ilman
 * @return               pos jos N tai E, neg jos S tai W
 * @example
 *   annaAsteet("N00E006") === [0,6]
 *   annaAsteet("S01W002") === [-1,-2]
 */
/*
function annaAsteet(tiedostonimi) {
    var lat = parseInt(tiedostonimi.substr(1,3));
    lat = tiedostonimi.charAt(0) === "N" ? lat : -lat;
    
    var lng = parseInt(tiedostonimi.substr(4,7));
    lng = tiedostonimi.charAt(3) === "E" ? lng : -lng;
    
    return [lat,lng];
}
*/

/**
 * Palauttaa jonon s muotoiltuna vähintään len-pituiseksi
 * <pre>
 * Esim:  fmt("2",3,'0')  => "002"
 *        fmt("2",-3,' ') => "2  "
 * </pre>
 * @param s      muotoiltava jono
 * @param len    pituus, negatiivisella vasempaan laitaan, pos. oikeaan
 * @param fillch merkki jolla täytetään
 * @return       muotoiltu jono
 * 
 * @example
 *   fmt("",3,' ')     === "   "  
 *   fmt("",3,'0')     === "000"  
 *   fmt("2",3,'0')    === "002"  
 *   fmt("2",-3,' ')   === "2  "
 *   fmt("1234",3,'0') === "1234" 
 */
function fmt(s,len,fillch) {
    const needs = Math.abs(len)-s.length;
    if (needs <= 0) return s;
    const fill = tayta(""+fillch,needs);
    if (len < 0) return s+fill;
    return fill+s;
}

/**
 * Palauttaa jonon s muotoiltuna vähintään len-pituiseksi
 * <pre>
 * Esim:  fmt("2",3)  => "  2"
 *        fmt("2",-3) => "2  "
 * </pre>
 * @param s     muotoiltava jono
 * @param len   pituus, negatiivisella vasempaan laitaan, pos. oikeaan
 * @return      muotoiltu jono
 * 
 * @example
 * <pre name="test">
 *   fmt("2",3)    === "  2"  
 *   fmt("2",-3)   === "2  "
 *   fmt("1234",3) === "1234" 
 * </pre>
 */
function tayta(s,n) {
    const pituus = n*s.length;
    if (pituus === 0) return "";
    var jono = s;
    while (2*jono.length < pituus) jono += s;
    jono += jono.substr(0,pituus-jono.length);
    return jono;
}
