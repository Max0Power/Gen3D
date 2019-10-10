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
    
    const rows = laskeRivit(latlng_1[0],latlng_2[0]).reduce(laskeSumma);
    const cols = laskeSarakkeet(latlng_1[1],latlng_2[1]).reduce(laskeSumma);
    
	var askelI = Math.max(1, Math.floor(rows/max)); // max > 0
	var askelJ = Math.max(1, Math.floor(cols/max)); // max > 0
	
    const as = laskeAsteet(latlng_1,latlng_2); // js/kaavat.js
    
    var t = [];
    for (var i = 0; i < as.length; i++) {
        t[i] = new File(as[i],latlng_1,latlng_2);
        t[i].setHeightAndWidth(askelI,askelJ); // modules/File.js
        //t[i].setJakojaannos(apui[i],apuj[i])
    }
    
    return t;
    
    function laskeKorjaus(pituus,askel,korjaus) {
        var jakojaannos = (pituus-1)%askel;
        var korjaus = askel-1-korjaus-jakojaannos
        
        return korjaus;
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
/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/**
 * Palautetaan oletus, jos aste N välin ulkopuolella
 * Olettaa, että aste sisältyy välille [lat_1,lat_2]
 * @param aste    pohjoiskoordinaatti N
 * @param lat_1   latitude desimaalina
 * @param lat_2   latitude desimaalina
 * @return        rivi-indeksit latitudeille
 * @example
 *   laskeYlaAlaIndeksit(0,0.269164,-0.230374) === [877,1200]
 *   laskeYlaAlaIndeksit(-1,0.269164,-0.230374) === [0,276]
 */
function laskeYlaAlaIndeksit(aste,lat_1,lat_2) {
    const lats = laskeYlaAla(lat_1,lat_2);
    
    var indeksit = [0,1200];
    
    if (aste === Math.floor(lats[0])) {
        indeksit[0] = laskeI(laskeDms(lats[0])); // js/kaavat.js
    } 
    if (aste === Math.floor(lats[1])) {
        indeksit[1] = laskeI(laskeDms(lats[1])); // js/kaavat.js
    }
    
    return indeksit;
}

/**
 * Palauttaa taulukon rivi-indeksit parametrien väliltä
 * @param lat_1   latitude desimaalina
 * @param lat_2   latitude desimaalina
 * @return        rivi-indeksit taulukossa
 * @example
 *   laskeKaikkiYlaAlaIndeksit(0.269164,-0.230374)
 *     === [877,1200],[0,276]
 */
function laskeKaikkiYlaAlaIndeksit(lat_1,lat_2) {
    [yla,ala] = laskeYlaAla(lat_1,lat_2).map(Math.floor);
    
    /* Taulukoi asteet pohjoisesta etelään */
    var t = range(Math.abs(yla-ala)+1,ala).sort(vertaaLat);
    
    /* Palauttaa asteita vastaavat rivi-indeksit */
    return t.map(x => { return laskeYlaAlaIndeksit(x,lat_1,lat_2); });
}

/**
 * Palauttaa pohjoiskoordinaattien rivi-indeksien
 * lukumäärän pohjoisesta etelään taulukoittain
 * @param lat_1   pohjoisempi latitude desimaalina
 * @param lat_2   eteläisempi latitude desimaalina
 * @return        matriisin rivien sisältämien rivien lkm
 * @example
 *   laskeRivit(0.269164,-0.230374) === [324,277]
 *   laskeRivit(0.269164,-0.230374).reduce(laskeSumma) === 601
 */
function laskeRivit(lat_1,lat_2) {
    var t = laskeKaikkiYlaAlaIndeksit(lat_1,lat_2);
    
    /* Laskee rivien lukumäärän kahden rivi-indeksin väliltä */
    return t.map(([yla,ala]) => { return Math.abs(yla-ala)+1; });
}

/**
 * @example
 *   laskeVasOikIndeksit(6,6.602783,8.723145) === [723, 1200]
 *   laskeVasOikIndeksit(7,6.602783,8.723145) === [0, 1200]
 *   laskeVasOikIndeksit(8,6.602783,8.723145) === [0, 868]
 */
function laskeVasOikIndeksit(aste,lng_1,lng_2) {
    const lngs = laskeVasOik(lng_1,lng_2);
    
    var indeksit = [0,1200];
    
    if (aste === Math.floor(lngs[0])) {
        indeksit[0] = laskeJ(laskeDms(lngs[0])); // js/kaava.js
    }
    if (aste === Math.floor(lngs[1])) {
        indeksit[1] = laskeJ(laskeDms(lngs[1])); // js/kaava.js
    }
    
    return indeksit;
}

/**
 * @example
 *   laskeKaikkiVasOikIndeksit(6.602783,8.723145)
 *     === [723,1200],[0,1200],[0,868]
 */
function laskeKaikkiVasOikIndeksit(lng_1,lng_2) {
    [vas,oik] = laskeVasOik(lng_1,lng_2).map(Math.floor);
    
    /* Taulukoi asteet lännestä itään */
    var t = range(Math.abs(oik-vas)+1,vas).sort(vertaaLng);
    
    /* Palauttaa asteita vastaavat sarake-indeksit */
    return t.map(x => { return laskeVasOikIndeksit(x,lng_1,lng_2); });
}

/**
 * @example
 *   laskeSarakkeet(6.602783,8.723145) === [478,1201,869]
 *   laskeSarakkeet(6.602783,8.723145).reduce(laskeSumma) === 2548
 */
function laskeSarakkeet(lng_1,lng_2) {
    var t = laskeKaikkiVasOikIndeksit(lng_1,lng_2);
    
    /* Laskee sarakkeiden lukumäärän kahden sarake-indeksin väliltä */
    return t.map(([vas,oik]) => { return Math.abs(oik-vas)+1; });
}

/**
 * Palauttaa asteita vastaavan matriisin kentän
 * indeksit, joista lähtien korkeudet sisätyvät
 * parametrien rajaamien koordinaattien välille
 * @param asteet     matriisin rivi- ja sarake-indeksit
 * @param latlng_1   koordinaatti desimaalina
 * @param latlng_2   koordinaatti desimaalina
 * @return           koordinaattien alku indeksit
 * @example
 *   laskeVasYlaIndeksit([0,6],[0.269164,6.602783],
 *     [-1.230374,8.723145]) ===  [877,723]
 *     
 *     laskeVasYlaIndeksit([-2,8],[0.269164,6.602783],
 *     [-1.230374,8.723145]) === [0,0]
 */
function laskeVasYlaIndeksit(asteet,latlng_1,latlng_2) {
    const vasYla = laskeVasYla(latlng_1,latlng_2); // js/kaavat.js
    
    var indeksit = [0,0];
    
    if (asteet[0] === Math.floor(vasYla[0])) {
        indeksit[0] = laskeI(laskeDms(vasYla[0])); // js/kaavat.js
    }
    if (asteet[1] === Math.floor(vasYla[1])) {
        indeksit[1] = laskeJ(laskeDms(vasYla[1])); // js/kaavat.js
    }
    
    return indeksit;
}

/**
 * Ei käytössä!
 * Palauttaa asteita vastaavat vasemmat yläindeksit
 * @param latlng_1   koordinaatti desimaalina
 * @param latlng_2   koordinaatti desimaalina
 * @return           koordinaattien alku indeksit
 * @example
 *   laskeKaikkiVasYlaIndeksit([0.269164,6.602783],[-0.230374,7.723145])
 *     === [877,723],[877,0],[0,723],[0,0]
 */
function laskeKaikkiVasYlaIndeksit(latlng_1,latlng_2) {
    var asteet = laskeAsteet(latlng_1,latlng_2);
    
    return asteet.map(x => { return laskeVasYlaIndeksit(x,latlng_1,latlng_2); });
}

/**
 * Palauttaa asteita vastaavan matriisin kentän
 * indeksit, joihin korkeudet sisätyvät viimeistään
 * parametrien rajaamien koordinaattien välille
 * @param asteet     matriisin rivi- ja sarake-indeksit
 * @param latlng_1   koordinaatti desimaalina
 * @param latlng_2   koordinaatti desimaalina
 * @return           koordinaattien loppu indeksit
 * @example
 *   laskeOikAlaIndeksit([0,6],[0.269164,6.602783],
 *     [-1.230374,8.723145]) ===  [1200,1200]
 *     
 *   laskeOikAlaIndeksit([-2,8],[0.269164,6.602783],
 *     [-1.230374,8.723145]) === [276, 868]
 */
function laskeOikAlaIndeksit(asteet,latlng_1,latlng_2) {
    const oikAla = laskeOikAla(latlng_1,latlng_2); // js/kaavat.js
    
    var indeksit = [1200,1200];
    
    if (asteet[0] === Math.floor(oikAla[0])) {
        indeksit[0] = laskeI(laskeDms(oikAla[0])); // js/kaavat.js
    }
    if (asteet[1] === Math.floor(oikAla[1])) {
        indeksit[1] = laskeJ(laskeDms(oikAla[1])); // js/kaavat.js
    }
    
    return indeksit;
}

/**
 * Ei käytössä!
 * Palauttaa asteita vastaavat oikeat alaindeksit
 * @param latlng_1   koordinaatti desimaalina
 * @param latlng_2   koordinaatti desimaalina
 * @return           koordinaattien alku indeksit
 * @example
 *   laskeKaikkiOikAlaIndeksit([0.269164,6.602783],[-0.230374,7.723145])
 *     === [1200,1200],[1200,868],[276,1200],[276,868]
 */
function laskeKaikkiOikAlaIndeksit(latlng_1,latlng_2) {
    var asteet = laskeAsteet(latlng_1,latlng_2);
    
    return asteet.map(x => { return laskeOikAlaIndeksit(x,latlng_1,latlng_2); });
}

/**
 * @example
 *   laskeSkaalatutRivit(0.269164,-0.230374,200) === [107,92]
 *   laskeSkaalatutRivit(0.269164,-0.230374,200)
 *     .reduce(laskeSumma) === 199
 */
function laskeSkaalatutRivit(lat_1,lat_2,max) {
    var t = laskeRivit(lat_1,lat_2);
    
    /* Kaikkien rivien lukumäärä */
    const summa = t.reduce(laskeSumma);
    const k = max/summa;
    
    /* Suhteuta rivimäärät max arvoon */
    return t.map(x => { return Math.floor(k*x); });
}

/**
 * @example
 *   laskeSkaalatutSarakkeet(6.602783,8.723145,200) === [37,94,68]
 *   laskeSkaalatutSarakkeet(6.602783,8.723145,200)
 *     .reduce(laskeSumma) === 199
 */
function laskeSkaalatutSarakkeet(lng_1,lng_2,max) {
    var t = laskeSarakkeet(lng_1,lng_2);
    
    /* Kaikkien sarakkeiden lkm */
    const summa = t.reduce(laskeSumma);
    const k = max/summa;
    
    /* Suhteuta sarakemäärät max arvoon */
    return t.map(x => { return Math.floor(k*x); });
}

/**
 * @example
 *   const m = [[1,2,3],[1,2,3],[1,2,3]]
 *   rajaaMatriisi(m,[0,0],[2,2]) === [[1,2,3],[1,2,3],[1,2,3]]
 *   rajaaMatriisi(m,[1,0],[2,1]) === [[1,2],[1,2]]
 *   rajaaMatriisi(m,[1,2],[2,2]) === [[3],[3]]
 */
function rajaaMatriisi(m,vasYla,oikAla) {
    var t = [];
    for (var i = vasYla[0]; i <= oikAla[0]; i++) {
        t[i-vasYla[0]] = [];
        for (var j = vasYla[1]; j <= oikAla[1]; j++) {
            t[i-vasYla[0]][j-vasYla[1]] = m[i][j];
        }
    }
    
    return t;
}

/**
 * Palauttaa kutistetun matriisin
 * @param m     rajattava neliömatriisi
 * @param max   uuden neliömatriisin koko
 * @return      max kokoinen matriisi m
 * @example
 *   const m = [[1,2,3],[1,2,3],[1,2,3]]
 *   kutistaMatriisi(m,0,0) === []
 *   kutistaMatriisi(m,1,2) === [1,2]
 *   kutistaMatriisi(m,2,1) === [[2],[2]]
 *   kutistaMatriisi(m,3,3) === [[1,2,3],[1,2,3],[1,2,3]]
 */
function kutistaMatriisi(m,imax,jmax,ikorjaus,jkorjaus) {
    const cond = [imax < 1,jmax < 1];
    if (cond[0] && cond[1]) {
        return m;
    }
    if (cond[0]) {
        imax = 1;
    }
    if (cond[1]) {
        jmax = 1;
    }
    
    /*
    const is = Math.floor(m.length/imax);
    const ik = Math.floor(is/2)+Math.floor((m.length%imax)/2);
    
    const js = Math.floor(m[0].length/jmax);
    const jk = Math.floor(js/2)+Math.floor((m[0].length%jmax)/2);
    */
    
    var t = [];
    var apui = 0;
    //for (var i = ikorjaus; i < m.length; i+=imax,apui++) {
    for (var i = 0; i < m.length; i+=imax,apui++) {
        var apuj = 0;
        //var y = ik+i*is;
        t[apui] = [];
        //for (var j = jkorjaus; j < m[0].length; j+=jmax,apuj++) {
        for (var j = 0; j < m[0].length; j+=jmax,apuj++) {
            //var x = jk+j*js;
            //t[apui][apuj] = m[Math.round(i)][Math.round(j)];
            t[apui][apuj] = m[i][j];
        }
    }
    
    return t;
}

/**
 * Palauttaa parametrien mukaisen matriisin
 * @param rivit       rivien lkm
 * @param sarakkeet   sarakkeiden lkm
 * @param oletus      oletusarvo
 * @return            täytetty matriisi
 * @example
 *   luoMatriisi(0,0,0) === []
 *   luoMatriisi(2,0,0) === [[],[]]
 *   luoMatriisi(0,2,0) === []
 *   luoMatriisi(2,2,0) === [[0,0],[0,0]]
 *   luoMatriisi(2,2,2) === [[2,2],[2,2]]
 */
function luoMatriisi(rivit,sarakkeet,oletus) {
    var t = new Array(rivit).fill(new Array(sarakkeet));
    return t.map(x => x.fill(oletus));
}

/**
 * @param ts       yhdistettävät matriisi taulukossa
 * @param vasYla   vasemman yläkulman asteet
 * @param oikAla   oikean alakulman asteet
 * @return         yhdistetty matriisi
 * @example
 *   const a = [[1,2,3],[1,2,3]]
 *   const b = [[4,5],[4,5]]
 *   const c = [[1,2,3],[1,2,3],[1,2,3]]
 *   const d = [[4,5],[4,5],[4,5]]
 *   var ts = [a,b,c,d]
 *   
 *   const result = (new Array(5)).fill(range(5,1))
 *   
 *   yhdistaMatriisit(ts,[0,0],[1,1]) === result
 *   yhdistaMatriisit(ts,[-1,1],[0,2]) === result
 *   yhdistaMatriisit(ts,[2,-1],[3,0]) === result
 */
function yhdistaMatriisit(ts,vasYla,oikAla) {
    const is = Math.abs(oikAla[0]-vasYla[0]);
    const js = Math.abs(oikAla[1]-vasYla[1]);
    
    var t = null;
    for (var i = 0; i <= is; i++) {
        var u = null;
        for (var j = 0; j <= js; j++) {
            u = yhdistaRivit(u,ts[i*(1+js)+j]);
        }
        t = yhdistaSarakkeet(t,u);
    }
    
    return t;
}

/**
 * @example
 *   const a = [[1,2,3],[1,2,3]]
 *   const b = [[4,5],[4,5]]
 *
 *   const c = [[1,2,3],[1,2,3],[1,2,3]]
 *   const d = [[4,5],[4,5],[4,5]]
 *   
 *   yhdistaRivit(null,a) === [[1,2,3],[1,2,3]]
 *   yhdistaRivit(a,b) === [[1,2,3,4,5],[1,2,3,4,5]]
 *   yhdistaRivit(c,d) === [[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]]
 */
function yhdistaRivit(a,b) {
    return a ? range(a.length,0).map(x => [...a[x],...b[x]]) : b;
}

/**
 * @example
 *   const ab = [[1,2,3,4,5],[1,2,3,4,5]]
 *   const cd = [[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]]
 *   
 *   yhdistaSarakkeet(null,ab) === ab
 *   yhdistaSarakkeet(ab,cd) === [[1,2,3,4,5],[1,2,3,4,5],
 *     [1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]]
 */
function yhdistaSarakkeet(a,b) {
    return a ? [...a,...b] : b;
}

/**
 * @example
 *   lineaari([[2,2,1],[3,-32768,-32768],[-32768,1,2]])
 *     === [[2,2,1],[3,2,2],[2,1,2]]
 *   lineaari([[2,2,1],[3,2,2],[2,1,2]])
 *     === [[2,2,1],[3,2,2],[2,1,2]]
 */
function lineaari(t) {
    var empty = [];
    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j] === -32768) {
                empty.push([i,j]);
            }
        }
    }
    
    /* ei interpoloitavaa */
    if (empty.length < 1) {
        return t;
    }
    
    var A = [];
    var b = [];
    var apu;
    for (var k = 0; k < empty.length; k++) {
        apu = kertoimet(t,empty,k);
        A[k] = apu[0];
        b[k] = apu[1];
    }
    
    /* käänteismatriisi */
    const At = math.inv(A); // lib/math.js
    /* ratkaistaan arvot */
    const x = math.multiply(At,b); // lib/math.js
    
    for (var l = 0; l < empty.length; l++) {
        t[empty[l][0]][empty[l][1]] = Math.round(x[l]);
    }
    
    return t;
    
    function kertoimet(t,empty,k) {
        const i = empty[k][0];
        const j = empty[k][1];
        var f = (new Array(empty.length)).fill(0);
        var y = 0;
        
        var ind = [[i+1,j],[i,j+1],[i-1,j],[i,j-1]];
        
        f[k] = ind.length;
        f[k] -= (i === 0 || i === t.length-1) ? 1 : 0;
        f[k] -= (j === 0 || j === t[i].length-1) ? 1 : 0;
        
        ind.map(p => {
            const conds = [0 <= p[0], p[0] < t.length, 0 <= p[1], p[1] < t.length];
            
            var indeksi = laskeIndeksi(empty,p);
            if (conds.reduce((a,b) => a && b)) {
                if (indeksi < 0) {
                    y += t[p[0]][p[1]];
                } else {
                    f[indeksi] = -1;
                }
            }
        });
        
        return [f,y];
        
        function laskeIndeksi(empty,p) {
            for (var i = 0; i < empty.length; i++) {
                if (p[0] === empty[i][0] && p[1] === empty[i][1]) {
                    
                    return i;
                }
            }
            
            return -1;
        }
    }
}

function tuplavarmistus(t) {
    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j] === -32768) {
                t[i][j] = 0;
            }
        }
    }
    
    return t;
}
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
/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/*
 * Ei käytössä!
 * Lukee korkeusarvot monesta paikallisesta tiedostosta
 * @param tiedostot    resurssihallinnasta valitut tiedostot
 * @param callback     funktio vastaanottaa korkeusarvot
 * @example
 *   <input type="file" multiple onchange="lueTiedostot(this.files,tulosta,true)" />
 */
/*
function lueTiedostot(tiedostot,callback) {
    for (var i = 0; i < tiedostot.length; i++) {
        lueTiedosto(tiedostot[i],callback);
    }
}
*/

/*
 * Ei käytössä!
 * Lukee korkeusarvot paikallisesta tiedostosta
 * @param tiedosto    resurssihallinnasta valittu tiedosto
 * @param callback    funktio vastaanottaa korkeusarvot
 */
/*
function lueTiedosto(tiedosto,callback) {
    var lukija = new FileReader();
    lukija.onprogress = function(e) {
        console.log(Math.floor(100 * e.loaded / e.total) + " % luettu tiedostosta " + tiedosto.name);
    };
    lukija.onload = function() {
        callback(lukija.result,tiedosto);
    };
    lukija.onerror = errorListener;
    lukija.readAsArrayBuffer(tiedosto);
}
*/

/**
 * Lukee korkeusarvot tiedostosta verkkoyhteyden ylitse
 * @param url         tiedoston url
 * @param callback    funktio vastaanottaa korkeusarvot
 */
function lueTiedostoUrl(url,file,callback) {
	const XMLHttpRequest = require("xhr2").XMLHttpRequest;
	const filename = url.split('/').pop();
	
    const request = new XMLHttpRequest();
    request.onprogress = function(e) {
        if (e.loaded && e.total) {
            console.log(Math.floor(e.loaded / e.total * 100)+" % luettu tiedostosta "+filename);
        }
    };
    request.onreadystatechange = function() {
        if (this.readyState === 4 && (this.status === 200 || this.status === 0)) {
            if (request.response) {
                callback(request.response,file);
            }
        }
    };
    request.onerror = errorListener;
    request.open("GET", url);
    request.responseType = "arraybuffer";
    request.send();
}

/**
 * Purkaa zip-tiedoston ja kutsuu callback-funktiota
 * @param tiedosto       binäärinen zip-tiedosto
 * @param tiedostonimi   pakatun tiedoston nimi
 * @param callback       funktio vastaanottaa korkeusarvot
 */
function lueTiedostoZip(dataZip,file,callback) {
    zip.workerScriptsPath = "lib/";
    const blob = new Blob([dataZip], {
        type : "ArrayBuffer"
    });
    
    zip.createReader(new zip.BlobReader(blob), function(zipReader) {
        zipReader.getEntries(function(entries) {
            entries[0].getData(new zip.BlobWriter(), function(data) {
                zipReader.close();
                
                const myReader = new FileReader();
                myReader.readAsArrayBuffer(data);
    
                myReader.onload = function(e) {
                    const buffer = e.srcElement.result;
                    callback(lueKorkeudet(buffer),file);
                };
            });
        });
    }, onerror);
}

/*
// TODO: ilman blob-muunnosta
function unzipArrayBuffer(arrayBuffer,callback) {
    zip.workerScriptsPath = "./";
	zip.createReader(new zip.ArrayBufferReader(arrayBuffer), function(zipReader) {
		zipReader.getEntries(function(entries) {
			entries[0].getData(new zip.ArrayBufferWriter(), function(data) {
				zipReader.close();
				callback(data,file);
			});
		});
	}, onerror);
}
*/

function lueTiedostoZipNode(data,file,callback) {
    var buf = toBuffer(data);

    var AdmZip = require('adm-zip');
    var zip = new AdmZip(buf);
    var arr = zip.getEntries()[0].getData();
    
    var arrbuf = toArrayBuffer(arr);
    callback(lueKorkeudet(arrbuf),file);
	
	function toBuffer(ab) {
		var buf = Buffer.alloc(ab.byteLength);
		var view = new Int8Array(ab);
		for (var i = 0; i < buf.length; ++i) {
			buf[i] = view[i];
		}
		return buf;
	}
	
	function toArrayBuffer(buf) {
		var ab = new ArrayBuffer(buf.length);
		var view = new Int8Array(ab);
		for (var i = 0; i < buf.length; ++i) {
			view[i] = buf[i];
		}
		return ab;
	}
}

function lueTiedostoZipNode2(data,files,callback) {
    var buf = toBuffer(data);

    var AdmZip = require('adm-zip');
    var zip = new AdmZip(buf);
    var arrs = zip.getEntries();
	
	for (var i = 0; i < arrs.length; i++) {
		var arr = arrs[i].getData();
		var name = arrs[i].entryName.split('/')[1];
		name = name.split('.')[0];
		
		for (var j = 0; j < files.length; j++) {
			var fname = files[j].getFileName();
			
			if (name === fname) {
				var arrbuf = toArrayBuffer(arr);
				callback(lueKorkeudet(arrbuf),files[j]);
			}
		}
	}
	
	function toBuffer(ab) {
		var buf = Buffer.alloc(ab.byteLength);
		var view = new Int8Array(ab);
		for (var i = 0; i < buf.length; ++i) {
			buf[i] = view[i];
		}
		return buf;
	}
	
	function toArrayBuffer(buf) {
		var ab = new ArrayBuffer(buf.length);
		var view = new Int8Array(ab);
		for (var i = 0; i < buf.length; ++i) {
			view[i] = buf[i];
		}
		return ab;
	}
}

function kirjoitaTiedostoZip(dataHgt,file,callback) {
    dataHgt = kirjoitaKorkeudet(dataHgt);
    const filename = file.getFileName()+".hgt.zip";
    
    zip.workerScriptsPath = "lib/";
    const blob = new Blob([dataHgt], {
        type : "ArrayBuffer"
    });
    
    zip.createWriter(new zip.BlobWriter(), function(zipWriter) {
        zipWriter.add(filename, new zip.BlobReader(blob), function() {
            zipWriter.close(function(data) {
                const myReader = new FileReader();
                myReader.readAsArrayBuffer(data);
    
                myReader.onload = function(e) {
                    const buffer = e.srcElement.result;
                    callback(buffer,file);
                };
            });
        });
    }, onerror);
}

/*
// TODO: ilman blob-muunnosta
function zipArrayBuffer(arrayBuffer,callback) {
    zip.workerScriptsPath = "./";
	zip.createWriter(new zip.ArrayBufferWriter(), function(zipWriter) {
		zipWriter.add(FILENAME, new zip.ArrayBufferReader(arrayBuffer), function() {
			zipWriter.close(callback);
		});
	}, onerror);
}
*/

/**
 * Ilmoittaa virheestä selaimen konsoliin
 */
function errorListener() {
    console.error("Virhe!");
}

/**
 * Palauttaa SMRT3 korkesarvot tavujonosta
 * @param result   korkeusarvot pareittain tavujonossa
 * @return         korkeusarvot matriisissa
 */
function lueKorkeudet(result) {
    const bytes = new DataView(result);
    const koko = Math.sqrt(bytes.byteLength/2);
    
    var t = [];
    for (var i = 0; i < koko; i++) {
        t[i] = [];
        for (var j = 0; j < koko; j++) {
            t[i][j] = bytes.getInt16(laskeK(i,j)); // js/kaavat.js
        }
    }
    
    return t;
}

function kirjoitaKorkeudet(data) {
    const koko = Math.pow(data.length,2)*2;
    const buffer = new ArrayBuffer(koko); // Int8
    const bytes = new DataView(buffer);
    
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            bytes.setInt16(laskeK(i,j),data[i][j]); // js/kaavat.js
        }
    }
    
    return bytes.buffer;
}
/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

"use strict"; 

var interpolationSetting = true;

/**
 * Asetetut korkeudet oliolle kaksiulotteisessa taulukossa!
 * Ottaa parametrina file olioit taulukossa, laskee korkeudet olioille niiden rajaamalta alueilta kaksiulotteiseen
 * taulukkoon. Samalla etsii rajatun alueen pienimman ja korkeimman kohdan ja asettaa sen olioille
 */
function setFileObjects(file_objs, option, callbackFunc) {
	var readedCount = 0; // osoittaa kuinka moni file_objekti on kasitelty
	
	for (var i = 0; i < file_objs.length; i++) {
		var img = new Image(1,1); // luodaan uusi img per file olio
		const f = file_objs[i]; // otetaan indeksissa oleva file olio
		// Tapahtuma, kun kuva on ladattu:
		img.onload = function() {
			readedCount++; // kasvatetaan kasiteltyjen olioiden maaraa	
			var canvas = document.createElement('canvas'); // luodaan canvas, jota kaytetaan pixeleiden lukemiseen
			canvas.width = this.naturalWidth; // asetetaan kuvan koot kanvasille
			canvas.height = this.naturalHeight;
			var ctx = canvas.getContext('2d'); // piirtaa kuvan
			ctx.drawImage(this, 0, 0);
			
			// 1 korkeuksien asetus file oliolle, file olion rajaamalle alueelle, samalla etsitaan myos rajatun alueen pienin ja suurin korkeus:		
			
			// 1.1 pakko hakea maxRGB arvo koko kuvan alueelta, koska ei ole aina 255, esim N00E006 se on 253
			var data_whole_img = ctx.getImageData(0, 0, 1201 , 1201).data;
			var maxRGB = -100000;
			for (var i = 0; i < data_whole_img.length; i+=4) {
				if (data_whole_img[i] > maxRGB) maxRGB = data_whole_img[i]
			}
			
			// 1.2 olion rajaama alue
			var topLeftPixel = f.getTopLeft()
			var bottomRightPixel = f.getBottomRight();
			var pixelsX = bottomRightPixel[0] - topLeftPixel[0] + 1;
			var pixelsY = bottomRightPixel[1] - topLeftPixel[1] + 1;
			
			// 1.3 lasketaan korkeudet yksiulotteiseen taulukkoon, file olion rajaamalta alueelta ja samalla katsotaan kyseisen alueen matalin ja korkein kohta
			var minMaxH = window[f.getFileName()]; // haetaan data.js:sta asetettu min max korkeus kyseiselle filelle (eli koko kuvan alueen pienin ja suurin korkeus)
			var data = ctx.getImageData(topLeftPixel[0], topLeftPixel[1], pixelsX , pixelsY).data; // otetaan kuvan data file olion osoittamalta alueelta

			var heights = new Array(pixelsX); // alustetaan x suuntaan oleva taulukko, johon luodaan y suunnassa olevat taulukot
			var file_minH = 1000000; // minH ja maxH osoittavat matalinta ja korkeinta kohtaa
			var file_maxH = -1000000;
			
			for (var x = 0; x < pixelsX; x++) {
				var h_tmp = new Array(pixelsY); // luodaan taulukko, joka vastaa yhta pystyrivia valitulta alueelta
				for (var y = 0; y < pixelsY; y++) {
					var pixelIndex = (x + (y * pixelsX)) * 4; // lasketaan pikselin indeksi, kuvan datasta
					h_tmp[y] = data[pixelIndex] / maxRGB * (minMaxH[1] - minMaxH[0]) + minMaxH[0]; // lasketaan korkeus
					if (h_tmp[y] < file_minH) file_minH = h_tmp[y]; // katsotaan loytyyko uusi minH tai maxH arvoa
				    if (h_tmp[y] > file_maxH) file_maxH = h_tmp[y];	
				}
				heights[x] = h_tmp; // asetetaan luotu pystyrivi heights taulukkoon
			}
			
			f.setHeights(heights); // asetetaan korkeudet oliolle
			f.setMinMax(file_minH, file_maxH); // asetetaan min ja max korkeus heights alueelta oliolle
			
			//document.body.appendChild(canvas); // jos canvaksen haluaa dumpata bodyyn
			
			// jos kaikki file_oliot on maaritelty
			if (readedCount == file_objs.length) {
				callbackFunc(option, file_objs); // kutsutaan all_File_Objects_Set funktiota --> ohjelma jatkaa eteenpain siita
			}
		};
		// Tapahtuma, jos kuvaa ei voitu ladata:
		img.onerror= function() {
			readedCount++; // kasvatetaan kasiteltyjen olioiden maaraa
			
			// 1 asetetaan min max korkeuksien arvo
			f.setMinMax(0,0); // asetetaan min maxiin 0:llat
			
			// 2 korkeuksien asetus file oliolle, file olion rajaamalle alueelle:
			var topLeftPixel = f.getTopLeft()
			var bottomRightPixel = f.getBottomRight();
			var pixelsX = bottomRightPixel[0] - topLeftPixel[0] + 1;
			var pixelsY = bottomRightPixel[1] - topLeftPixel[1] + 1;
			// alustetaan array tayteen 0:llia
			var heights = new Array(pixelsX);
			for (var x = 0; x < pixelsX; x++) {
				var h_tmp = new Array(pixelsY);
				for (var y = 0; y < pixelsY; y++) {
					h_tmp[y] = 0;
				}
				heights[x] = h_tmp;
			}
			f.setHeights(heights); // asetetaan korkeustaulukko
			
			// jos kaikki file_oliot on maaritelty
			if (readedCount == file_objs.length) {
				callbackFunc(option, file_objs); // kutsutaan all_File_Objects_Set funktiota --> ohjelma jatkaa eteenpain siita
			}
		};
		img.src = "grayscales/" + f.getFileName() + ".jpeg"; // imagen source
	}
}

/**
 * Palauttaa taulukoissa annetuista file_objekteista pienimman ja korkeimman
 * loytyvan korkeuden
 */
function fileObjects_getMinMaxH(file_objs) {
	var minH = 100000;
	var maxH = -100000;
	
	for (var i = 0; i < file_objs.length; i++) {
		if (file_objs[i].getMin() < minH) minH = file_objs[i].getMin();
		if (file_objs[i].getMax() > maxH) maxH = file_objs[i].getMax();
	}
	
    if (minH < 0) {
        minH = 0;
    }
    
	return [minH, maxH];
}

/**
 * Mergettaa taulukossa annetujen file_objektien korkeudet yhteen kaksiuloitteiseen taulukkoon ja
 * palauttaa sen
 */
function mergeFileObjects(file_objs) {
	
	var eastCoords = findEastCoords(file_objs);
	var northCoords = findNorthCoords(file_objs);
	
	var rowHeights = new Array(northCoords.length); // tallennetaan korkeudet riveittain
	var i = 0; // osoitin rowHeightsiin
	// lahdetaan kaymaan pohjoisia lapi suurimmasta alaspain
	for (var y = northCoords.length - 1; y >= 0; y--) {
		var n = northCoords[y]; // otetaan kasiteltava pohjoiskoordinaatti
		var row_tmp = findFileObj(file_objs, n, eastCoords[0]).getHeights(); // kerataan tahan kaikki yhdella rivilla esiintyvat korkeudet, (haetaan vasemmassa reunassa olevan olion korkeudet)
		// kaydaan lapi rivin oliot oikealle pain
		for (var x = 1; x < eastCoords.length; x++) {
			var e = eastCoords[x]; // haetaan kasiteltava ita koordinaatti
			var cur_heights = findFileObj(file_objs, n, e).getHeights(); // haetaan rivin seuraava olio
			row_tmp = mergeX(row_tmp, cur_heights); // mergetetaan yhteen aikaisemmat korkeudet rivilta ja nykyinen kasiteltava korkeus
		}
		// kun yksi rivi on kasitelty, tallennetaan keratyt rivin korkeudet rowHeights taulukkoon
		rowHeights[i] = row_tmp;
		i++; // kasvatetaan indexia
	}
	
	// alustetaan matrixi, johon yhdistetaan kaikki rivejen keratyt korkeudet
	var matrix = rowHeights[0];
	
	// kaydaan loput rivit lapi ja liitetaan ne matrixiin, eli mergetetaan y suunnassa korkeudet
	for (var i = 1; i < rowHeights.length; i++) {
		matrix = mergeY(matrix ,rowHeights[i]); // liitto
	}
	
	// palautetaan lopuksi matriisi
	return matrix;	
	
	// APUFUNKTIOT, eivat nay mergeFileObjects function ulkopuolelle!
	/**
	 * palauttaa olion f_objs taulukosta, jonka poh ja ita vastaa annettuja parametreja
	 * muuten palautta null
	 */
	function findFileObj(f_objs, north, east) {
		for (var i = 0; i < f_objs.length; i++) {
			if (f_objs[i].getNorth() == north && f_objs[i].getEast() == east) return f_objs[i];
		}
		return null;
	}
	
	/**
	 * palauttaa kaikki loytyvat ita koordinaatit taulukossa annetuista file olioista
	 */
	function findEastCoords(f_objs) {
		var eastCoords = [];
		for (var i = 0; i < f_objs.length; i++) {
			var canAdd = true;
			for (var j = 0; j < eastCoords.length; j++) {
				if (eastCoords[j] == f_objs[i].getEast()) canAdd = false;
			}
			if (canAdd) eastCoords.push(f_objs[i].getEast());
		}
		
		eastCoords.sort(sortNumber); // jarjestetaan suuruus jarjestykseen
		
		return eastCoords;
	}
	
	/**
	 * palauttaa kaikki loytyvat pohjois koordinaatit taulukossa annetuista file olioista
	 */
	function findNorthCoords(f_objs) {
		var northCoords = [];
		for (var i = 0; i < f_objs.length; i++) {
			var canAdd = true;
			for (var j = 0; j < northCoords.length; j++) {
				if (northCoords[j] == f_objs[i].getNorth()) canAdd = false;
			}
			if (canAdd) northCoords.push(f_objs[i].getNorth());
		}
		
		northCoords.sort(sortNumber); // jarjestetaan suuruus jarjestykseen
		
		return northCoords;
	}
	
	/**
	 * kaytetaan sortissa, jolla sortataan loytyvat ita ja pohjois koordinaatit
	 */
	function sortNumber(a,b) {
		return a - b;
	}
	
	/**
	 * mergettaa kaksi matriisia yhteen x-akselin linjalla
	 */
	function mergeX(t1, t2) {
		return t1.concat(t2);
	}


	/**
	 * mergettaa kaksi matriisia yhteen y-akselin linjalla
	 */
	function mergeY(t1, t2) {
		for (var i = 0; i < t1.length; i++) {
			for (var j = 0; j < t2[i].length; j++) {
				t1[i].push(t2[i][j]);
			}
		}	
		return t1;
	}
}


/**
 * pienentaa annetun heights matriisiin uuteen kokoon
 * huom newSizeX ja newSizeY tulee olla > 1!!
 * ottaa suoraan vanhan matriisin valilta arvot, ei laske mitaan keskiarvoja korkeuksista
 */
function decreaseHeightsMatrix(heights, newSizeX, newSizeY) {
	if (newSizeX <= 1 || newSizeY <= 1) {
		console.log("new size have to be >= 2!");
		return;
	}
	var new_heights = new Array(newSizeX);
	for (var i = 0; i < newSizeX; i++) {
		var x =  Math.floor((i * (  (heights.length-1) / (newSizeX-1)))); // lasketaan pikselin X coordinaatti
		var h_tmp = new Array(newSizeY);
		for (var j = 0; j < newSizeY; j++) {
			var y =  Math.floor((j * (  (heights[0].length-1) / (newSizeY-1)))); // lasketaan pikselin X coordinaatti
			h_tmp[j] = heights[x][y]; 
		}
		new_heights[i] = h_tmp;
	}
	
	return new_heights;
}


/**
 * palauttaa pieninmman ja suurimman korkeuden parametrina annetusta heights matriisista
 */
function getHeightsMatrixMinMaxH(heights) {
	
	var minH = 1000000;
	var maxH = -1000000;
	
	for (var i = 0; i < heights.length; i++) {
		for (var j = 0; j < heights[0].length; j++) {
			if (heights[i][j] < minH) minH = heights[i][j];
			if (heights[i][j] > maxH) maxH = heights[i][j];
		}
	}
	
    if (minH < 0) {
        minH = 0;
    }
    
	return [minH, maxH];
}


/**
 * Puuttuvien aukkojen taytto kolmen pisteen spline funktiolla, kay matriisin pystyriveittain lapi
 * sivun kaavaa kaytetty: https://www.desmos.com/calculator/yvgfpq2prf 
 */
function fillDataHolesSpline(heights) {
	
	// kaydaan matriisin rivit lapi:
	for (var i = 0; i < heights.length; i++) {
		heights[i] = fill_row(heights[i]); // korjataan pystyrivin puuttuvat korkeudet 
	}
	
	return heights; // palautetaan korkeudet matriisi, jonka aukot on korjattu
	
	/**
	 * APUFUNKTIO:
	 * Tayttaa yhden rivin puuttuvat datat lineaarisesti
	 */
	function fill_row(row) {
		
		var NO_DATA_VALUE = -30000; // value, jota pienemmat tai samat arvot ovat puuttuvia aukkoja datassa
		
		// jos eka alkio on NODATA --> etsitaan seuraava validi korkeus ja alustetaan ensimmainen arvo siksi
		if (row[0] <= NO_DATA_VALUE) {
			for (var i = 1; i < row.length; i++) {
				if (row[i] > NO_DATA_VALUE) {
					row[0] = row[i]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					i = row.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		if (row[1] <= NO_DATA_VALUE) row[1] = row[0]; // jos toka alkio on NODATA (SPLINE tarvitsee aina kaksi arvoa, ennen "aukkoa")
		
		// jos vika alkio on NODATA --> etsitaan edellinen ensimmainen validi korkeus ja alustetaan viimeinen siksi
		if (row[row.length - 1] <= NO_DATA_VALUE) {
			for(var i = row.length - 2; i >= 0; i--) {
				if (row[i] > NO_DATA_VALUE) {
					row[row.length-1] = row[i]; // vika alkio on sama kuin ensimmainen validi korkeus loppu paasta
					i = -1; // lopetetaan silmukka
				}
			}
		}
		
		// taytetaan aukot:
		var lastValidIndex = 1; // <- mika oli edellinen validi korkeus?
		var fill = false; // <- osoittaa pitaako dataa tayttaa
		// kaydaan rivi lapi, aloitetaan kolmannesta alkiosta, koska ensimmaiset kaksi ovat aina validit
		for (var i = 2; i < row.length; i++) {
			// jos kasitetltava korkeus on NO_DATA, asetetaan taytto trueki
			if (row[i] <= NO_DATA_VALUE) {
				fill = true;
			}
			else { // muuten jos kasiteltava data on VALIDI
				// jos dataa ei tarvitse tayttaa:
				if (!fill) {
					lastValidIndex = i; // asetetaan edellinen validi indeksi
				}
				if (fill) { // muuten, jos dataa tarvitsee tayttaa:
				
					var p1 = [lastValidIndex - 1, row[lastValidIndex - 1]]; // splinen vaatimat pisteet
					var p2 = [lastValidIndex, row[lastValidIndex]];
					var apu = p2;
					if (Math.abs(p2[1] - p1[1]) > 0) {
						apu[1] = p1[1];
					}
						
					// p2 = Math.abs(p2[1] - p1[1]) > 1 ? p1[1] + 1 : p2[1];
					var p3 = [i, row[i]];
					
					// taytetaan data viimeisesta validista korkeudesta nykyiseen validiin korkeuteen:
					for (var j = lastValidIndex + 1; j < i; j++) {
						row[j] = spline(p1,apu,p3, j) // taytetaan rivin NODATA arvo uudella arvolla
					}
					fill = false; // taytto on false
					lastValidIndex = i; // asetetaan viimeinen validi arvo
				}
			}
		}
		
		return row; // palautetaan rivi, jonka puuttuvat arvot on paikattu
	}
	
	/**
	 * Spline funktio kolmelle pisteelle, kayttaa suoraan
	 * sivulta https://www.desmos.com/calculator/yvgfpq2prf loytyvaa kaavaa
	 * p1-3 on splinen kayttamat pisteet ja x --> p2.x < x < p3.x
	 */
	function spline(p1,p2,p3,x) {
		var a1 = ( p1[0]*(p2[1]-p3[1]) + p2[0]*(p3[1]-p1[1]) + p3[0]*(p1[1]-p2[1]) ) / ( 2.0*(p1[0]-p2[0])*(p1[0]-p2[0])*(p1[0]-p3[0])*(p2[0]-p3[0]) );
		var b1 = ( p1[0]*p1[0]*(p3[1]-p2[1]) - p1[0]*(p2[0]*(-3*p1[1]+p2[1]+2*p3[1])+3*p3[0]*(p1[1]-p2[1])) + p2[0]*p2[0]*(p3[1]-p1[1]) + p2[0]*p3[0]*(p2[1]-p1[1]) + 2*p3[0]*p3[0]*(p1[1]-p2[1]) ) / ( 2*(p1[0]-p2[0])*(p1[0]-p3[0])*(p2[0]-p3[0]) );
		var a2 = ( (p2[0]-p1[0]) / (p2[0]-p3[0])) * a1; 
		var b2 = ( 2*p1[0]*p1[0]*(p2[1]-p3[1]) + p2[0]*(p1[0]*(p3[1]-p2[1])+p3[0]*(2*p1[1]+p2[1]-3*p3[1])) + 3*p1[0]*p3[0]*(p3[1]-p2[1]) + p2[0]*p2[0]*(p3[1]-p1[1]) + p3[0]*p3[0]*(p2[1]-p1[1]) ) / ( 2*(p1[0]-p2[0])*(p1[0]-p3[0])*(p2[0]-p3[0]) );
		
		return a2*(x-p3[0])*(x-p3[0])*(x-p3[0]) + b2*(x-p3[0]) + p3[1]*x;
	}
}


/**
 * Tayttaa puuttuvat datat korkeus matriisiin lineaarisesti:
 * Eli kaytetaan .hgt fileen josta on tehty matriisi!
 * Lisatty 1.11.2018
 */
function fillDataHolesLinear(heights) {
	
	// kaydaan matriisin rivit lapi:
	for (var i = 0; i < heights.length; i++) {
		heights[i] = fill_row(heights[i]); // korjataan pystyrivin puuttuvat korkeudet 
	}
	
	return heights; // palautetaan korkeudet matriisi, jonka aukot on korjattu
	
	/**
	 * APUFUNKTIO:
	 * Tayttaa yhden rivin puuttuvat datat lineaarisesti
	 */
	function fill_row(row) {
		
		var NO_DATA_VALUE = -30000; // value, jota pienemmat tai samat arvot ovat puuttuvia aukkoja datassa
		
		// jos eka alkio on NODATA --> etsitaan seuraava validi korkeus ja alustetaan ensimmainen arvo siksi
		if (row[0] <= NO_DATA_VALUE) {
			for (var i = 1; i < row.length; i++) {
				if (row[i] > NO_DATA_VALUE) {
					row[0] = row[i]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					i = row.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		// jos vika alkio on NODATA --> etsitaan edellinen ensimmainen validi korkeus ja alustetaan viimeinen siksi
		if (row[row.length - 1] <= NO_DATA_VALUE) {
			for(var i = row.length - 2; i >= 0; i--) {
				if (row[i] > NO_DATA_VALUE) {
					row[row.length-1] = row[i]; // vika alkio on sama kuin ensimmainen validi korkeus loppu paasta
					i = -1; // lopetetaan silmukka
				}
			}
		}
		
		// taytetaan aukot lineaarisesti:
		var lastValidIndex = 0; // <- mika oli edellinen validi korkeus?
		var fill = false; // <- osoittaa pitaako dataa tayttaa
		// kaydaan rivi lapi
		for (var i = 1; i < row.length; i++) {
			// jos kasitetltava korkeus on NO_DATA, asetetaan taytto trueki
			if (row[i] <= NO_DATA_VALUE) {
				fill = true;
			}
			else { // muuten jos kasiteltava data on VALIDI
				// jos dataa ei tarvitse tayttaa:
				if (!fill) {
					lastValidIndex = i; // asetetaan edellinen validi indeksu
				}
				if (fill) { // muuten, jos dataa tarvitsee tayttaa:
					// taytetaan data viimeisesta validista korkeudesta nykyiseen validiin korkeuteen:
					for (var j = lastValidIndex + 1; j < i; j++) {
						var t = (j - lastValidIndex) / (i - lastValidIndex); // lasketaan t, joka on arvo valilta 0-1
						row[j] = ((1.0 - t) * row[lastValidIndex]) + (row[i] * t); // taytetaan rivin NODATA arvo uudella arvolla
					}
					fill = false; // taytto on false
					lastValidIndex = i; // asetetaan viimeinen validi arvo
				}
			}
		}
		
		return row; // palautetaan rivi, jonka puuttuvat arvot on paikattu
	}
}

function fillAllDataHoles(heights) {
	
	// paikataan ensiksi vaakarivien suunnassa
	var fixed1 =  fillDataHolesLinearHorizontal(heights);
	
	// paikataan toiseksi pystyrivien suunnassa
	var fixed2 =  fillDataHolesLinearVertical(heights);
	
	// asetetaan heights matriisin paikattujen matriisien korkeuksien keskuarvot
	for (var x = 0; x < heights.length; x++) {
		for (var y = 0; y < heights[0].length; y++) {
			heights[x][y] = (fixed1[x][y] + fixed2[x][y]) / 2.0; // lasketaan keskiarvo
		}
	}
	
	return heights; // palautetaan lopuksi paikattu matriisi
}





/**
 * Ottaa parametrina korkeusmatriisin ja paikkaa puuttuvat arvot lineaarisesti vaakarivien suunnassa!
 * Eli kaytetaan .hgt fileen josta on tehty matriisi!
 * palauttaa lopuksi paikatun matriisin
 * lisatty 2.11.2018
 */
function fillDataHolesLinearHorizontal(heights) {
	
	var NO_DATA_VALUE = -30000; // value, jota pienemmat tai samat arvot ovat puuttuvia aukkoja datassa
	
	// kaydaan lapi yksi rivi kerrallaan ja paikataan noData arvot:
	for(var y = 0; y < heights[0].length; y++) {
		
		// jos eka alkio on NODATA --> etsitaan seuraava validi korkeus ja alustetaan ensimmainen arvo siksi
		if (heights[0][y] <= NO_DATA_VALUE) {
			for (var x = 1; x < heights.length; x++) {
				if (heights[x][y] > NO_DATA_VALUE) {
					heights[0][y] = heights[x][y]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					break;
					//x = heights.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		// jos vika alkio on NODATA --> etsitaan edellinen ensimmainen validi korkeus ja alustetaan viimeinen siksi
		if (heights[heights.length-1][y] <= NO_DATA_VALUE) {
			for (var x = heights.length-2; x >= 0; x--) {
				if (heights[x][y] > NO_DATA_VALUE) {
					heights[heights.length-1][y] = heights[x][y]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					break;
					//x = heights.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		// taytetaan aukot lineaarisesti:
		var lastValidIndex = 0; // <- mika oli edellinen validi korkeus?
		var fill = false; // <- osoittaa pitaako dataa tayttaa
		for (var x = 0; x < heights.length; x++) { // kaydaan vaakarivi lapi
			// jos kasitetltava korkeus on NO_DATA, asetetaan taytto trueki
			if (heights[x][y] <= NO_DATA_VALUE) {
				fill = true;
			}
			else { // muuten jos kasiteltava data on VALIDI
				// jos dataa ei tarvitse tayttaa:
				if (!fill) {
					lastValidIndex = x; // asetetaan edellinen validi indeksu
				}
				if (fill) { // muuten, jos dataa tarvitsee tayttaa:
					// taytetaan data viimeisesta validista korkeudesta nykyiseen validiin korkeuteen:
					for (var i = lastValidIndex + 1; i < x; i++) {
						var t = (i - lastValidIndex) / (x - lastValidIndex); // lasketaan t, joka on arvo valilta 0-1
                        
                        // interpolointi funktion valintaehto
                        if (interpolationSetting) {
                            heights[i][y] = ((1.0 - t) * heights[lastValidIndex][y]) + (heights[x][y] * t);
                        } else {
                            var t2 = (1.0 - Math.cos(t*Math.PI))/2;
                            heights[i][y] = ((1.0 - t2) * heights[lastValidIndex][y]) + (heights[x][y] * t2); // taytetaan rivin NODATA arvo uudella arvolla
                        }
					}
					fill = false; // taytto on false
					lastValidIndex = x; // asetetaan viimeinen validi arvo
				}
			}
		}
	}
	
	return heights
}

function fillDataHolesLinearVertical(heights) {
	
	// kaydaan matriisin rivit lapi:
	for (var i = 0; i < heights.length; i++) {
		heights[i] = fill_row(heights[i]); // korjataan pystyrivin puuttuvat korkeudet 
	}
	
	return heights; // palautetaan korkeudet matriisi, jonka aukot on korjattu
	
	/**
	 * APUFUNKTIO:
	 * Tayttaa yhden rivin puuttuvat datat lineaarisesti
	 */
	function fill_row(row) {
		
		var NO_DATA_VALUE = -30000; // value, jota pienemmat tai samat arvot ovat puuttuvia aukkoja datassa
		
		// jos eka alkio on NODATA --> etsitaan seuraava validi korkeus ja alustetaan ensimmainen arvo siksi
		if (row[0] <= NO_DATA_VALUE) {
			for (var i = 1; i < row.length; i++) {
				if (row[i] > NO_DATA_VALUE) {
					row[0] = row[i]; // eka alkio on sama kuin ensimmainen validi korkeus alku paasta
					break;
					//i = row.length + 1; // lopetetaan silmukka
				}
			}
		}
		
		// jos vika alkio on NODATA --> etsitaan edellinen ensimmainen validi korkeus ja alustetaan viimeinen siksi
		if (row[row.length - 1] <= NO_DATA_VALUE) {
			for(var i = row.length - 2; i >= 0; i--) {
				if (row[i] > NO_DATA_VALUE) {
					row[row.length-1] = row[i]; // vika alkio on sama kuin ensimmainen validi korkeus loppu paasta
					break;
					//i = -1; // lopetetaan silmukka
				}
			}
		}
		
		// taytetaan aukot lineaarisesti:
		var lastValidIndex = 0; // <- mika oli edellinen validi korkeus?
		var fill = false; // <- osoittaa pitaako dataa tayttaa
		// kaydaan rivi lapi
		for (var i = 1; i < row.length; i++) {
			// jos kasitetltava korkeus on NO_DATA, asetetaan taytto trueki
			if (row[i] <= NO_DATA_VALUE) {
				fill = true;
			}
			else { // muuten jos kasiteltava data on VALIDI
				// jos dataa ei tarvitse tayttaa:
				if (!fill) {
					lastValidIndex = i; // asetetaan edellinen validi indeksu
				}
				if (fill) { // muuten, jos dataa tarvitsee tayttaa:
					// taytetaan data viimeisesta validista korkeudesta nykyiseen validiin korkeuteen:
					for (var j = lastValidIndex + 1; j < i; j++) {
						var t = (j - lastValidIndex) / (i - lastValidIndex); // lasketaan t, joka on arvo valilta 0-1
                        
                        if (interpolationSetting) {
                            row[j] = ((1.0 - t) * row[lastValidIndex]) + (row[i] * t); // taytetaan rivin NODATA arvo uudella arvolla
                        } else {
                            var t2 = (1.0 - Math.cos(t*Math.PI))/2;
                            row[j] = ((1.0 - t2) * row[lastValidIndex]) + (row[i] * t2);
                        }
					}
					fill = false; // taytto on false
					lastValidIndex = i; // asetetaan viimeinen validi arvo
				}
			}
		}
		
		return row; // palautetaan rivi, jonka puuttuvat arvot on paikattu
	}
}
/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/**
 * Tietorakenteen konstruktori
 * @param callback   datan käsittelijä
 * @example
 *   var struct = new DataStruct()
 *   struct.setOption(makeGrayscale).execute(files);
 *   struct.execute(null);
 */
function DataStruct() {
    this.zips = [];
    this.files = [];
    this.heights = [];
    this.minMaxH = [];
    this.callbacks = [];
}

const filelists = [require('../sh/usgs').usgs];
filelists.push(require('../sh/usgs').usgs_urls);
const url = "http://dds.cr.usgs.gov/srtm/version2_1/SRTM3/";

const filelists2 = [require('../sh/others').others];
filelists2.push(require('../sh/others').others_urls);
const url2 = "http://www.viewfinderpanoramas.org/dem3/";

/**
 * Lista takaisinkutsuttavia funktioita
 * @param callbacks   muotoa f(heights,minMaxH)
 * @return            metodien ketjuttava oliviite
 * @example
 *   var struct = new DataStruct();
 *   struct.setCallbacks([function(x)])
 *   struct.execute()
 */
DataStruct.prototype.setCallbacks = function(callbacks) {
    this.callbacks = callbacks;
    return this;
}

DataStruct.prototype.execute = function(files = null) {
    if (files) {
        this.files = files;
        
        var fs = files.slice();
        fs = this.recycleZipFiles(fs);
        fs = this.generateHgtFiles(fs);
        fs = this.downloadZipFiles(fs);
        
        if (0 < fs.length) {
            console.err('Virhe!');
        }
    } 
    if (!files) {
        this.finish();
    }
}

DataStruct.prototype.finish = function() {
    const args = { heights: this.heights, minMaxH: this.minMaxH };
    this.callbacks.map(f => f(args));
}

DataStruct.prototype.recycleZipFiles = function(files) {
    var fs = files.slice();
    
    var i = -1;
    while (++i < fs.length) {
        for (var j = 0; j < this.zips.length; j++) {
            if (fs[i] && fs[i].getFileName() === this.zips[j][0]) {
                //lueTiedostoZip(this.zips[j][1],fs[i],this.loadHgtFile.bind(this)); // js/tiedosto.js
				lueTiedostoZipNode(this.zips[j][1],fs[i],this.loadHgtFile.bind(this)); // js/tiedosto.js
                fs.splice(i--,1);
            }
        }
    }
    return fs;
}

DataStruct.prototype.generateHgtFiles = function(files) {
    var fs = files.slice();
    
    var i = -1;
    while (++i < fs.length) {
        var not_exists = true;
        for (var j = 0; j < filelists[0].length; j++) {
            if (fs[i] && filelists[0][j].includes(fs[i].getFileName())) {
                not_exists = false;
            }
        }
		
		for (var k = 0; k < filelists2[0].length; k++) {
			if (fs[i] && filelists2[0][k].includes(fs[i].getFileName())) {
                not_exists = false;
            }
		}
        
        if (not_exists) {
            this.loadHgtFile(luoMatriisi(1201,1201,0),fs[i]); // js/matriisi.js
            fs.splice(i--,1);
        }
    }
    return fs;
}

DataStruct.prototype.downloadZipFiles = function(files) {
    var fs = files.slice();
    
    var i = -1;
    while (++i < fs.length) {
        for (var j = 0; j < filelists[0].length; j++) {
            if (fs[i] && filelists[0][j].includes(fs[i].getFileName())) {
                var path = url+filelists[1][j]+fs[i].getFileName()+".hgt.zip";
                lueTiedostoUrl(path,fs[i],this.saveZipFile.bind(this));// js/tiedosto.js
                fs.splice(i--,1);
            }
        }
	}
	
	for (var i = 0; i < filelists2[0].length; i++) {
		for (var j = 0; j < filelists2[0][i].length; j++) {
			var t = [];
			
			var k = -1;
			while (++k < fs.length) {
				if (fs[k] && filelists2[0][i][j].includes(fs[k].getFileName())) {
					t.push(fs[k]);
					fs.splice(k--,1);
				}
			}
			
			if (0 < t.length) {
				var path = url2+filelists2[1][i];
                lueTiedostoUrl(path,t,this.saveZipFile2.bind(this));// js/tiedosto.js
			}
		}
	}
		
    return fs;
}

DataStruct.prototype.multiThreadHgt = function(dataHgt,file) {
    const that = this;
    const worker = new Worker('js/thread.js');
    worker.addEventListener('message', function(e) {
        kirjoitaTiedostoZip(e.data,file,that.multiThreadZip.bind(that)); // js/tiedosto.js
        worker.terminate();
    });
    worker.postMessage(dataHgt);
}

DataStruct.prototype.multiThreadZip = function(dataZip,file) {
    for (var i = 0; i < this.zips.length; i++) {
        if (file.getFileName() === this.zips[i][0]) {
            this.zips[i][1] = dataZip;
        }
    }
    console.log(file.getFileName()+" done.");
}

DataStruct.prototype.saveZipFile = function(dataZip,file) {
    //this.zips.push([file.getFileName(),dataZip]); // modules/File.js
    
    //lueTiedostoZip(dataZip,file,this.multiThreadHgt.bind(this)); // js/tiedosto.js
    lueTiedostoZipNode(dataZip,file,this.loadHgtFile.bind(this));    // js/tiedosto.js
}

DataStruct.prototype.saveZipFile2 = function(dataZip,files) {
    lueTiedostoZipNode2(dataZip,files,this.loadHgtFile.bind(this));    // js/tiedosto.js
}

DataStruct.prototype.loadHgtFile = function(data,file) {
	const transpose = require('../lib/math').transpose;
	
    file.setHeights(data); // modules/File.js
    
    if (noneNullFiles(this.files)) {
        const vasYla = this.files[0].getAsteet();                   // js/kaavat.js, modules/File.js
        const oikAla = this.files[this.files.length-1].getAsteet(); // js/kaavat.js, modules/File.js
        
        // DATAN LUOMINEN
        var t = this.files.map(x => x.getHeights()); // modules/File.js
        t = yhdistaMatriisit(t,vasYla,oikAla);       // js/matriisi.js
        t = transpose(t);                            // lib/math.js
        
        this.heights = t;
        this.minMaxH = getHeightsMatrixMinMaxH(this.heights); // modules/DataController.js
        this.finish();
    }
    
    function noneNullFiles(fs) {
        for (var i = 0; i < fs.length; i++) {
			var b = false;
			if (fs[i].getHeights()) {
				b = true;
			}
			
            if (!fs[i].getHeights()) { // modules/File.js
                return false;
            }
        }
        return true;
    }
}
/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

class File {
    /**
     * File-olion konstruktori
     * @param asteet     muodossa [N,E]
     * @param latlng_1   muodossa [lat,lng]
     * @param latlng_2   muodossa [lat,lng]
     * @example
     *   new File([6,9],[6.2,9.1],[6.8,9.4])
     */
    constructor(asteet,latlng_1,latlng_2){
        this.vasenYla = laskeVasYlaIndeksit(asteet,latlng_1,latlng_2); // js/matriisi.js
        this.oikeaAla = laskeOikAlaIndeksit(asteet,latlng_1,latlng_2); // js/matriisi.js
        
        this.asteet = asteet;
        this.heights = null;
        
        this.imax = 0; this.ikorjaus = 0;
        this.jmax = 0; this.jkorjaus = 0;
    }
    
    //Palauttaa nimen joka on kartalla
    getFileName() {
        return annaTiedostonimi(this.asteet); // js/mjonot.js
    }
    
    getAsteet() {
        return this.asteet;
    }
    
    getMin() {
        const min = Math.min(...(this.heights.reduce(laskeMin)));
        return Math.round(min);
    }
  
    getMax() {
        const max = Math.max(...(this.heights.reduce(laskeMax)));
        return Math.round(max);
    }
    
    setHeightAndWidth(height,width) {
        this.imax = height;
        this.jmax = width;
    }
    
    setJakojaannos(height,width) {
        this.ikorjaus = height;
        this.jkorjaus = width;
    }
    
    setHeights(heights) {
        /* mukaan otettavat korkeudet */
        var t = rajaaMatriisi(heights,this.vasenYla,this.oikeaAla); // js/matriisi.js
		t = kutistaMatriisi(t,this.imax,this.jmax,this.ikorjaus,this.jkorjaus);
        
        /* interpoloi puuttuvat arvot */
        //t = fillAllDataHoles(decreaseHeightsMatrix(t,this.imax,this.jmax));
        //t = fillAllDataHoles(t); // modules/DataController.js,        js/matriisi.js
        //t = lineaari(t) // js/matriisi.js
        //t = tuplavarmistus(t);
        
        this.heights = t;
    }
    
    getHeights() {
        return this.heights;
    }
}
module.exports = { DataStruct, fileTehtaat };
