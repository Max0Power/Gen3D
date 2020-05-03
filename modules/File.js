/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 10.10.2019, gh-pages
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
	this.zip = null;
        
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

    getZip() {
	return this.zip;
    }

    setZip(zip) {
	this.zip = zip;
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
        // mukaan otettavat korkeudet
        var t = rajaaMatriisi(heights,this.vasenYla,this.oikeaAla); // js/matriisi.js
	t = kutistaMatriisi(t,this.imax,this.jmax,this.ikorjaus,this.jkorjaus);
        
        // interpoloi puuttuvat arvot
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
