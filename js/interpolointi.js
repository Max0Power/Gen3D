/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 10.10.2019, gh-pages
 */

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
    var ones = luoMatriisi(t.length,t.length,true); // js/matriisi.js
    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j] === -32768 && ones[i][j]) {
                var empty = [];
                annaTyhjat(t,ones,empty,[i,j]);
		laske(t,empty);
            }
        }
    }
    
    return t;
}

function annaTyhjat(t,ones,empty,xs) {    
    var queue = [xs];
    for (var m = 0; m < queue.length; m++) {
	var [i,j] = queue[m];
	ones[i][j] = false; // mark as visited        
        empty.push([i,j]);
	
	// add to queue if not visited
        var ks = [[i-1,j],[i+1,j],[i,j-1],[i,j+1]];
	for (var n = 0; n < ks.length; n++) {
            if (tarkista(t,ones,...ks[n])) {
                queue.push(ks[n]);
            }
        }
    }
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
