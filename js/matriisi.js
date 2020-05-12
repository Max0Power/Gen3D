/*jshint esnext: true */
/*jshint -W097 */
/*global laskeYlaAla */
/*global laskeI */
/*global laskeDms */
/*global range */
/*global vertaaLat */
/*global laskeVasOik */
/*global laskeJ */
/*global vertaaLng */
/*global laskeVasYla */
/*global laskeAsteet */
/*global laskeOikAla */
/*global laskeSumma */

"use strict";

/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 10.10.2019, gh-pages
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
    const lats = laskeYlaAla(lat_1,lat_2); // js/kaavat.js
    
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
    var [yla,ala] = laskeYlaAla(lat_1,lat_2).map(Math.floor); // js/kaavat.js
    
    /* Taulukoi asteet pohjoisesta etelään */
    var t = range(Math.abs(yla-ala)+1,ala).sort(vertaaLat); // js/kaavat.js
    
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
    const lngs = laskeVasOik(lng_1,lng_2); // js/kaavat.js
    
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
    var [vas,oik] = laskeVasOik(lng_1,lng_2).map(Math.floor); // js/kaavat.js
    
    /* Taulukoi asteet lännestä itään */
    var t = range(Math.abs(oik-vas)+1,vas).sort(vertaaLng); // js/kaavat.js
    
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
    var asteet = laskeAsteet(latlng_1,latlng_2); // js/kaavat.js
    
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
    var asteet = laskeAsteet(latlng_1,latlng_2); // js/kaavat.js
    
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
    const summa = t.reduce(laskeSumma); // js/kaavat.js
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
    const summa = t.reduce(laskeSumma); // js/kaavat.js
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
    /*
    // virhe: sarakkeilla sama viite
    var t = new Array(rivit).fill(new Array(sarakkeet));
    return t.map(x => x.fill(oletus));
    */
    var t = [];
    for (var i = 0; i < rivit; i++) {
        t[i] = [];
        for (var j = 0; j < sarakkeet; j++) {
            t[i][j] = oletus;
        }
    }
    return t;
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
    return a ? range(a.length,0).map(x => [...a[x],...b[x]]) : b; // js/kaavat.js
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
