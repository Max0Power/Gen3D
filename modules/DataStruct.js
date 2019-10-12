/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/**
 * Tietorakenteen konstruktori
 * @param callbacks   datan käsittelijät
 * @example
 *   var struct = new DataStruct()
 *   struct.setOption(makeGrayscale).execute(files);
 *   struct.execute(null);
 */
function DataStruct(callbacks = []) {
    this.zips = [];
    this.files = [];
    this.heights = [];
    this.minMaxH = [];
    this.callbacks = callbacks;
    
    // TODO: korjaa tiedostopolun virheet sh/fail.txt
    this.filelists = [usgs,usgs_urls]; // sh/usgs,js
    this.filelists2 = [others,others_urls]; // sh/others.js
}

/**
 * Asettaa takaisinkutsuttavien funktioiden listan
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

/**
 * Suorittaa tiedostojen lataamisen kutsuen monia apufunktioita
 * Lopuksi kutsuu 
 * @param files   kaikki ladattavat tiedostot
 */
DataStruct.prototype.execute = function(files) {
    this.files = files;
    
    var fs = files.slice();
    fs = this.recycleZipFiles(fs);
    fs = this.generateHgtFiles(fs);
    fs = this.downloadZipFiles(fs);
    
    if (fs.length > 0) {
        throw new Error('Virhe! Tiedostoja '+fs+' ei ladattu.');
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

/**
 * Kierrättää valmiiksi ladatut tiedostot käyttöön.
 * @param files   kaikki ladattavat tiedostot
 * @return        tiedostot joita ei tallennettu
 */
DataStruct.prototype.recycleZipFiles = function(files) {
    // kloonaa ladattavat tiedostot
    var fs = files.slice();
    
    var i = -1;
    while (++i < fs.length) {
        for (var j = 0; j < this.zips.length; j++) {
            if (fs[i] && fs[i].getFileName() === this.zips[j][0]) { 
                // käytä valmiiksi ladattua tiedostoa
                lueTiedostoZip(this.zips[j][1],fs[i],this.loadHgtFile.bind(this)); // js/tiedosto.js
                
                // poista ladattavien listalta
                fs.splice(i--,1);
            }
        }
    }
    
    return fs;
}

/**
 * Generoi puuttuvaa korkeusdataa avomereltä
 * @param files   kaikki ladattavat tiedostot
 * @return        tiedostot joita ei generoida
 */
DataStruct.prototype.generateHgtFiles = function(files) {
    // kloonaa ladattavat tiedostot
    var fs = files.slice();
    
    var i = -1;
    while (++i < fs.length) {
        var not_exists = true;
        for (var j = 0; j < this.filelists[0].length; j++) {
            // tiedosto löytyi nasalta
            if (fs[i] && this.filelists[0][j].includes(fs[i].getFileName())) {
                not_exists = false;
            }
        }
        
        for (var k = 0; k < this.filelists2[0].length; k++) {
            // tiedosto löytyi muulta palvelimelta
            if (fs[i] && this.filelists2[0][k].includes(fs[i].getFileName())) {
                not_exists = false;
            }
        }
        
        // tiedostoa ei löytynyt
        if (not_exists) {
            // generoidaan tyhjää dataa
            this.loadHgtFile(luoMatriisi(1201,1201,0),fs[i]); // js/matriisi.js
            // poista ladattavien listalta
            fs.splice(i--,1);
        }
    }
    
    return fs;
}

/**
 * Lataa puuttuvat tiedostot palvelimelta jos löytyy
 * @param files   kaikki ladattavat tiedostot
 * @return        tiedostot joita ei ladattu
 */
DataStruct.prototype.downloadZipFiles = function(files) {
    // kloonaa ladattavat tiedostot
    var fs = files.slice();
    
    var i = -1;
    while (++i < fs.length) {
        for (var j = 0; j < this.filelists[0].length; j++) {
            // tiedosto löytyi nasalta
            if (fs[i] && this.filelists[0][j].includes(fs[i].getFileName())) {
                // muodosta ladattavan tiedoston url
                const path = url+this.filelists[1][j]+fs[i].getFileName()+".hgt.zip";
                // lataa ja tallenna tiedosto
                lueTiedostoUrl(path,fs[i],this.saveZipFile.bind(this)); // js/tiedosto.js
                // poista ladattavien listalta
                fs.splice(i--,1);
            }
        }
    }
    
    var k = -1;
    while (++k < fs.length) {
        for (var i = 0; i < this.filelists2[0].length; i++) {
            for (var j = 0; j < this.filelists2[0][i].length; j++) {
                // tiedosto löytyi muulta palvelimelta
                if (fs[k] && this.filelists2[0][i][j].includes(fs[k].getFileName())) {
                    // muodosta ladattavan tiedoston url
                    var path = url2+this.filelists2[1][i];
                    lueTiedostoUrl(path,fs[k],this.saveZipFile.bind(this)); // js/tiedosto.js
                    // poista ladattavien listalta
                    fs.splice(k--,1);
                }
            }
        }
    }
    
    return fs;
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

/**
 * Säilyttää ladatun tiedoston paketoituna (zip) välimuistissa
 * @param dataZip   korkeusdata paketoituna zip formaatissa
 * @param file      zip pakettia vastaavan File-olio
 */
DataStruct.prototype.saveZipFile = function(dataZip,file) {
    //this.zips.push([file.getFileName(),dataZip]); // modules/File.js
    //lueTiedostoZip(dataZip,file,this.loadHgtFile.bind(this)); // js/tiedosto.js
    lueTiedostoZip(dataZip,file,this.multiThreadHgt.bind(this)); // js/tiedosto.js
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
        const vasYla = this.files[0].getAsteet(); // js/kaavat.js, modules/File.js
        const oikAla = this.files[this.files.length-1].getAsteet(); // js/kaavat.js, modules/File.js
        
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
