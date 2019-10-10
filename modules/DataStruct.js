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
    
    this.filelists = usgs_t;
    this.filelists2 = [others_urls,others_urls];
}

//const filelists = [require('../sh/usgs').usgs];
//filelists.push(require('../sh/usgs').usgs_urls);

const url = "http://dds.cr.usgs.gov/srtm/version2_1/SRTM3/";

//const filelists2 = [require('../sh/others').others];
//filelists2.push(require('../sh/others').others_urls);

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
    
    //return [this.heights, this.minMax]
}

DataStruct.prototype.finish = function() {
    //const args = { heights: this.heights, minMaxH: this.minMaxH };
    const args = [this.heights,this.minMaxH];
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
        for (var j = 0; j < this.filelists[0].length; j++) {
            if (fs[i] && this.filelists[0][j].includes(fs[i].getFileName())) {
                not_exists = false;
            }
        }
		
		for (var k = 0; k < this.filelists2[0].length; k++) {
			if (fs[i] && this.filelists2[0][k].includes(fs[i].getFileName())) {
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
        for (var j = 0; j < this.filelists[0].length; j++) {
            if (fs[i] && this.filelists[0][j].includes(fs[i].getFileName())) {
                var path = url+this.filelists[1][j]+fs[i].getFileName()+".hgt.zip";
                lueTiedostoUrl(path,fs[i],this.saveZipFile.bind(this));// js/tiedosto.js
                fs.splice(i--,1);
            }
        }
	}
	
	for (var i = 0; i < this.filelists2[0].length; i++) {
		for (var j = 0; j < this.filelists2[0][i].length; j++) {
			var t = [];
			
			var k = -1;
			while (++k < fs.length) {
				if (fs[k] && this.filelists2[0][i][j].includes(fs[k].getFileName())) {
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
    
    lueTiedostoZip(dataZip,file,this.loadHgtFile.bind(this)); // js/tiedosto.js
    //lueTiedostoZip(dataZip,file,this.multiThreadHgt.bind(this)); // js/tiedosto.js
    //lueTiedostoZipNode(dataZip,file,this.loadHgtFile.bind(this));    // js/tiedosto.js
}

DataStruct.prototype.saveZipFile2 = function(dataZip,files) {
    lueTiedostoZipNode2(dataZip,files,this.loadHgtFile.bind(this));    // js/tiedosto.js
}

DataStruct.prototype.loadHgtFile = function(data,file) {
	
    file.setHeights(data); // modules/File.js
    
    if (noneNullFiles(this.files)) {
        const vasYla = this.files[0].getAsteet();                   // js/kaavat.js, modules/File.js
        const oikAla = this.files[this.files.length-1].getAsteet(); // js/kaavat.js, modules/File.js
        
        // DATAN LUOMINEN
        var t = this.files.map(x => x.getHeights()); // modules/File.js
        t = yhdistaMatriisit(t,vasYla,oikAla);       // js/matriisi.js
        t = math.transpose(t);                            // lib/math.js
        
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
