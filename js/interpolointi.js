/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 10.10.2019, gh-pages
 */

var NODATA = -32768;
var testidata = [[NODATA,1,2],[NODATA,3,NODATA],[NODATA,2,NODATA]];

function kaanteinenEtaisyys(t) {
    var ones = luoMatriisi(t.length,t[0].length,true); // js/matriisi.js
    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (tarkista(t,ones,i,j)) {
		// selvitetään interpoloitavat sijainnit
                var empty = annaTyhjat(t,ones,i,j);
		var sample = annaNaytteet(t,empty);
		var result = laskeKaanteinenEtaisyys(t,empty,sample); // interpolointi
		fillEmptyWithResult(t,empty,result);
	    }
        }
    }
    
    return t;
}

function annaNaytteet(t,empty) {
    if (empty.length < 1) throw Error("Virhe!");
    
    var sample = [];
    for (var m = 0; m < empty.length; m++) {
	[i,j] = empty[m];

	var tmp = [[i-1,j-1],[i-1,j],[i-1,j+1],
		    [i,j-1],[i,j+1],
		    [i+1,j-1],[i+1,j],[i+1,j+1]];

	for (var n = 0; n < tmp.length; n++) {
	    var [ti,tj] = tmp[n];

	    if (t[ti] && t[ti][tj] && t[ti][tj] > NODATA) {
		var bool = true;

		for (var k = 0; k < sample.length; k++) {
		    var [si,sj] = sample[k];

		    if (si === ti && sj === tj) {
			bool = false;
			break;
		    }
		}
		if (bool) {
		    sample.push(tmp[n]);
		}
	    }
	}
    }

    return sample;
}

function laskeKaanteinenEtaisyys(t,empty,sample) {
    if (sample.length < 1) throw Error("Virhe!");
    
    const r = 2;
    var result = [];

    for (var i = 0; i < empty.length; i++) {
	var [x,y] = empty[i];

	var qs = [];
	for (var j = 0; j < sample.length; j++) {
	    var [xi,yi] = sample[j];

	    var di = Math.sqrt( Math.pow(x-xi,2) + Math.pow(y-yi,2) );
	    var qi = 1/(Math.pow(di,r));
	    qs.push(qi);
	}

	var f = 0;
	const sq = qs.reduce(laskeSumma); // js/kaavat.js
	for (var k = 0; k < qs.length; k++) {
	    var [xxi,yyi] = sample[k];
	    f += (qs[k]/sq)*t[xxi][yyi];
	}
	
	result.push(Math.round(f));
    }

    return result;
}

function fillEmptyWithResult(t,empty,result) {
    if (empty.length !== result.length) throw Error("Virhe!");

    for(var m = 0; m < empty.length; m++) {
	var [i,j] = empty[m];
	t[i][j] = result[m];
    }

    return t;
}

// ------------------------------ Lineaarit


/**
 * @example
 *   lineaari([[2,2,1],[3,-32768,-32768],[-32768,1,2]])
 *     === [[2,2,1],[3,2,2],[2,1,2]]
 *   lineaari([[2,2,1],[3,2,2],[2,1,2]])
 *     === [[2,2,1],[3,2,2],[2,1,2]]
 *   lineaari([[-32768,1,2],[-32768,3,-32768],[-32768,2,-32768]])
 *     === [[1,1,2],[1,3,2],[1,2,2]]
 */
function lineaari(t) {
    const width = t.length;
    const height = t[0].length;

    // taulukko kertoo onko indeksissä käyty aiemmin
    var ones = luoMatriisi(width,height,true); // js/matriisi.js
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            if (tarkista(t,ones,i,j)) {
		// selvitetään interpoloitavat sijainnit
                var empty = annaTyhjat(t,ones,i,j);
		laske(t,empty); // interpolointi
	    }
        }
    }
    
    return t;
}

function annaTyhjat(t,ones,is,js) {
    var empty = [[is,js]]; // found empty value
    ones[is][js] = false; // mark as visited

    for (var m = 0; m < empty.length; m++) {
	var [i,j] = empty[m];
	
	// add to queue if not visited
        var ks = [[i-1,j],[i+1,j],[i,j-1],[i,j+1]];
	for (var n = 0; n < ks.length; n++) {
            if (tarkista(t,ones,...ks[n])) {
		var [a,b] = ks[n];
		empty.push(ks[n]); // found empty value
		ones[a][b] = false; // mark as visited
            }
        }
    }

    return empty;
}

function tarkista(t,ones,i,j) {
    if (i < 0 || j < 0) {
        return false;
    }
    if (i >= t.length || j >= t[i].length) {
        return false;
    }
   if (t[i][j] !== -32768) {
        return false;
    }
    
    return ones[i][j];
}

function laske(t,empty) {
    var A = [];
    var b = [];
    for (var k = 0; k < empty.length; k++) {
        var apu = kertoimet(t,empty,k);
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
}

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

// -------------------------------------------------

/**
 * @example
 *   lineaariOriginal([[2,2,1],[3,-32768,-32768],[-32768,1,2]])
 *     === [[2,2,1],[3,2,2],[2,1,2]]
 *   lineaariOriginal([[2,2,1],[3,2,2],[2,1,2]])
 *     === [[2,2,1],[3,2,2],[2,1,2]]
 *   lineaariOriginal([[-32768,1,2],[-32768,3,-32768],[-32768,2,-32768]])
 *     === [[1,1,2],[1,3,2],[1,2,2]]
 */
function lineaariOriginal(t) {
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
