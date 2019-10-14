/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 10.10.2019, gh-pages
 */

/**
 * Tietorakenteen konstruktori
 * @param callbacks   datan käsittelijät
 * @example
 *   var struct = new DataStruct()
 *   struct.setCallbacks(makeGrayscale);
 *   struct.execute(files);
 */
function DataStruct() {
    this.files = [];
    this.heights = [];
    this.minMaxH = [];
    this.callbacks = [];
    
    // TODO: korjaa tiedostopolun virheet sh/fail.txt
    this.usgs = [usgs,usgs_urls]; // sh/usgs,js
    this.others = [others,others_urls]; // sh/others.js
    this.usgs_url = usgs_url; // sh/usgs,js
    this.others_url = others_url; // sh/others.js
}

/**
 * Asettaa takaisinkutsuttavien funktioiden listan
 * @param callbacks   muotoa f(heights,minMaxH)
 * @return            metodien ketjuttava oliviite
 * @example
 *   var struct = new DataStruct();
 *   struct.setCallbacks(makeGrayscale)
 *   struct.execute(files)
 */
DataStruct.prototype.setCallbacks = function(callbacks) {
    this.callbacks = callbacks;
    return this;
}

/**
 * Suorittaa tiedostojen lataamisen tai generoimisen
 * @param files   kaikki ladattavat tiedostot
 */
DataStruct.prototype.execute = function(files) {
    this.files = files;
    
    // kloonaa ladattavat tiedostot
    var fs = files.slice();
    // lataa tai generoi tiedostot
    fs = this.downloadZipFile(fs); // nasa, muu
    this.generateHgtFile(fs); // avomeri
}

/**
 * Lataa puuttuvan tiedoston nasan palvelimelta
 * @param files   ladattavat tiedostot
 */
DataStruct.prototype.downloadZipFile = function(files) {
    var fs = files.slice();
    
    var i = -1;
    while (++i < fs.length) {
        for (var j = 0; j < this.usgs[0].length; j++) {
            if (fs[i] && this.usgs[0][j].includes(fs[i].getFileName())) {
                var path = this.usgs_url+this.usgs[1][j]+fs[i].getFileName()+".hgt.zip";
                lueTiedostoUrl(path,fs[i],this.saveZipFile.bind(this));// js/tiedosto.js
                fs.splice(i--,1);
            }
        }
    }
    
    for (var i = 0; i < this.others[0].length; i++) {
        for (var j = 0; j < this.others[0][i].length; j++) {
            var t = [];
            
            var k = -1;
            while (++k < fs.length) {
                if (fs[k] && this.others[0][i][j].includes(fs[k].getFileName())) {
                    t.push(fs[k]);
                    fs.splice(k--,1);
                }
            }
            
            if (0 < t.length) {
                var path = this.others_url+this.others[1][i];
                lueTiedostoUrl(path,t,this.saveZipFiles.bind(this));// js/tiedosto.js
            }
        }
    }
        
    return fs;
}

/**
 * Generoi tiedostoille puuttuvan korkeusdatan
 * @param files   tiedostot joille generoidaan
 */
DataStruct.prototype.generateHgtFile = function(files) {
    for (var i = 0; i < files.length; i++) {
        this.loadHgtFile(luoMatriisi(1201,1201,0),files[i]); // js/matriisi.js
    }
}

/**
 * Säilyttää ladatun tiedoston paketoituna (zip) välimuistissa
 * Huom! Nasalla yksi zip-paketti vastaa yhtä korkeusdataa
 * @param dataZip   korkeusdata paketoituna zip formaatissa
 * @param file      zip pakettia vastaavan File-olio
 */
DataStruct.prototype.saveZipFile = function(dataZip,file) {
    //lueTiedostoZip(dataZip,file,this.loadHgtFile.bind(this)); // js/tiedosto.js
    lueTiedostoZip(dataZip,file,this.multiThreadHgt.bind(this)); // js/tiedosto.js
}

/**
 * Lataa kerralla useamman korkeusdatan yhdestä zip-paketista
 * Huom! Nasan ulkopuolinen data paketoitu eri tavalla,
 *       siksi samaan asiaan useampi funktio
 */
DataStruct.prototype.saveZipFiles = function(dataZip,files) {
   //lueTiedostotZip(dataZip,files,this.loadHgtFile.bind(this)); // js/tiedosto.js
   lueTiedostotZip(dataZip,files,this.multiThreadHgt.bind(this)); // js/tiedosto.js
}

/**
 * Käsittelee ladatut tiedostot eri säikeessä
 * Käyttöliittymä ei jäädy interpoloinnin aikana
 * @param dataHgt   purettu korkeusdatan hgt tiedosto
 * @param file      hgt tiedostoa vastaava File-olio
 */
DataStruct.prototype.multiThreadHgt = function(dataHgt,file) {
    // viite tapahtumankäsittelijälle
    const that = this;
    const worker = new Worker('js/thread.js'); // js/thread.js
    worker.addEventListener('message', function(e) {
        //kirjoitaTiedostoZip(e.data,file,that.multiThreadZip.bind(that)); // js/tiedosto.js
        that.loadHgtFile(e.data,file);
        worker.terminate();
    });
    worker.postMessage(dataHgt);
}

/**
 * Yhdistää matriisit, kun kaikki tiedostot ladattu
 * @param data   ladattu hgt korkeusdata
 * @param file   korkeusdataa vastaava file-olio
 */
DataStruct.prototype.loadHgtFile = function(data,file) {
    // asettaa interpoloidun korkeusdatan
    file.setHeights(data); // modules/File.js
    
    if (noneNullFiles(this.files)) {
        const vasYla = this.files[0].getAsteet(); // modules/File.js
        const oikAla = this.files[this.files.length-1].getAsteet(); // modules/File.js
        
        // DATAN LUOMINEN
        var t = this.files.map(x => x.getHeights()); // modules/File.js
        t = yhdistaMatriisit(t,vasYla,oikAla); // js/matriisi.js
        t = math.transpose(t); // lib/math.js
        
        this.heights = t;
        this.minMaxH = getHeightsMatrixMinMaxH(this.heights); // modules/DataController.js
        this.finish();
    }
    
    /**
     * Tarkistaa onko kaikki tiedostot ladattu
     * @param files   kaikki ladattavat tiedostot
     * @return        onko kaikki tiedostot ladattu
     */
    function noneNullFiles(files) {
        for (var i = 0; i < files.length; i++) {
            var b = false;
            if (files[i].getHeights()) {
                b = true;
            }
            
            if (!files[i].getHeights()) { // modules/File.js
                return false;
            }
        }
        return true;
    }
}

/** 
 * Takaisinkutsuu callbacks-listan funktioita, kun
 * kaikki tiedostot ladattu. Palauttaa suorituksen
 * Execute-funktiota kutsuneeseen ohjelmanosaan.
 */
DataStruct.prototype.finish = function() {
    const args = { heights: this.heights, minMaxH: this.minMaxH };
    this.callbacks.map(f => f(args));
}

/*
 * Ei käytössä!
 */
/*
DataStruct.prototype.multiThreadZip = function(dataZip,file) {
    for (var i = 0; i < this.zips.length; i++) {
        if (file.getFileName() === this.zips[i][0]) {
            this.zips[i][1] = dataZip;
        }
    }
    console.log(file.getFileName()+" done.");
}
*/
