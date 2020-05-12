/*jshint esnext: true */
/*jshint -W097 */

"use strict";

function interpolointi(t) {
    for (var i = 0; i < t.length; i++ ) {
	t[i] = interpoloi(t[i]);
    }

    return t;
}

function interpoloi(r) {
    const empt = -32768;

    var ys = [];
    var xs = [];
    var empty = [];
    
    var max = Math.max(...r);
    
    r[0] = r[0] === empt ? 0 : r[0];
    r[r.length-1] = r[r.length-1] === empt ? 0 : r[r.length-1];
    

    for (var i = 0; i < r.length; i++) {
	if (r[i] === empt) {
            empty.push(i);
            if (r[i-1] > empt) {
		xs.push(i-1);
		ys.push(r[i-1]);
            }
            if (r[i+1] > empt) {
		xs.push(i+1);
		ys.push(r[i+1]);
            }
	}
    }
    
    if (empty.length > 0) {
	var d = differenssi(xs,ys);
	for (var j = 0; j < empty.length; j++) {
            r[empty[j]] = newton(d,xs,empty[j]);
            r[empty[j]] = r[empty[j]] > max ? max : r[empty[j]];
            r[empty[j]] = r[empty[j]] < 0 ? 0 : r[empty[j]];
	}
    }

    return r;
}

function differenssi(xs,ys) {
    var d = ys.slice();
    for (var i = 1; i < d.length; i++) {
	for (var j = d.length-1; j >= i; j--) {
            d[j] = (d[j]-d[j-1])/(xs[j]-xs[j-i]);
	}
    }

    return d;
}

function newton(d,xs,x) {
    var y = d[d.length-1];
    for (var i = d.length-2; i >= 0; i--) {
	y = d[i]+(x-xs[i])*y;
    }

    return y;
}
