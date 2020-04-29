/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 * @version 10.10.2019, gh-pages
 */

/*
 * Ei käytössä!
 * Lukee korkeusarvot monesta paikallisesta tiedostosta
 * @param tiedostot    resurssihallinnasta valitut tiedostot
 * @param callback     funktio vastaanottaa korkeusarvot
 * @example
 *   <input type="file" multiple onchange="lueTiedostot(this.files,tulosta)" />
 */
/*
function lueTiedostot(tiedostot,callback) {
    for (var i = 0; i < tiedostot.length; i++) {
        lueTiedosto(tiedostot[i],callback);
    }
}
*/

/**
 * Lukee korkeusarvot paikallisesta kuvatiedostosta
 * @param base64      resurssihallinnasta valittu tiedosto
 * @param callback    funktio vastaanottaa korkeusarvot
 */
function lueTiedostoImage(file,callback) {
    const reader = new FileReader();
    reader.onprogress = function(e) {
        console.log(file.name+" "+Math.floor(100 * e.loaded / e.total)+" %");
	consoleLog(file.name+" "+Math.floor(100 * e.loaded / e.total)+" %");
    };
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result; // base64
        img.onload = function() {
            callback(getImageDataFromMemory(img)); // modules/readImg.js
        };
    };
    reader.onerror = errorListener;
    reader.readAsDataURL(file);
}

/**
 * Lukee korkeusarvot tiedostosta verkkoyhteyden ylitse
 * @param url         tiedoston url
 * @param callback    funktio vastaanottaa korkeusarvot
 */
function lueTiedostoUrl(url,file,callback) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const filename = url.split('/').pop();
    
    const request = new XMLHttpRequest();
    request.onprogress = function(e) {
        if (e.loaded && e.total) {
            console.log(filename+" "+Math.floor(e.loaded / e.total * 100)+" %");
	    consoleLog(filename+" "+Math.floor(100 * e.loaded / e.total)+" %");
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
    request.open("GET", proxy+url);
    request.responseType = "arraybuffer";
    request.send();
}

/**
 * Ilmoittaa virheestä selaimen konsoliin
 */
function errorListener() {
    throw new Error("Virhe! Tiedostonluku epäonnistui.");
}

/**
 * Purkaa zip-paketin ja kutsuu callback-funktiota
 * @param dataZip    binäärinen zip-tiedosto
 * @param file       tiedostoa vastaava file-olio
 * @param callback   funktio vastaanottaa korkeusarvot
 */
function lueTiedostoZip(dataZip,file,callback) {
    zip.workerScriptsPath = "lib/";
    const blob = new Blob([dataZip], {
        type : "ArrayBuffer"
    });
    
    zip.createReader(new zip.BlobReader(blob), function(zipReader) {
        zipReader.getEntries(function(entries) {
	    const filename = entries[0].filename;
            entries[0].getData(new zip.BlobWriter(), function(data) {
                zipReader.close();
                
                const myReader = new FileReader();
		myReader.onload = function(e) {
                    const buffer = e.srcElement.result;
                    callback(lueKorkeudet(buffer),file);
                };
		myReader.onprogress = function(e) {
		    console.log(filename+" "+Math.floor(100 * e.loaded / e.total)+" %");
		    consoleLog(filename+" "+Math.floor(100 * e.loaded / e.total)+" %");
		};
                myReader.readAsArrayBuffer(data);
            });
        });
    }, onerror);
}

/**
 * Purkaa zip-paketin kaikki tiedostot ja kutsuu callback-funktiota
 * @param dataZip    binäärinen zip-tiedosto sisältää useita tiedostoja
 * @param files      zip-paketin tiedostoja vastaavat file-oliot
 * @param callback   funktio vastaanottaa korkeusarvot
 */
function lueTiedostotZip(dataZip,files,callback) {
    zip.workerScriptsPath = "lib/";
    const blob = new Blob([dataZip], {
        type : "ArrayBuffer"
    });
    
    zip.createReader(new zip.BlobReader(blob), function(zipReader) {
        zipReader.getEntries(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                var name = entries[i].filename;
                name = name.split('/')[1];
                name = name.split('.')[0];
                
                for (var j = 0; j < files.length; j++) {
                    const file = files[j]; // BlobWriter
                    if (name === files[j].getFileName()) {
                        entries[i].getData(new zip.BlobWriter(), function(data) {
                            zipReader.close();
                            
                            const myReader = new FileReader();
                            myReader.readAsArrayBuffer(data);
                            
                            const tied = file; // FileReader
                            myReader.onload = function(e) {
                                const buffer = e.srcElement.result;
                                callback(lueKorkeudet(buffer),tied);
                            }
			    myReader.onprogress = function(e) {
				console.log("Nothing to report!");
			    };	
                        });
                    }
                }
            }
        });
    }, onerror);
}

/*
 * Ei käytössä
 * Muodostaa hgt korkeusdatasta zip tiedoston
 * välimuistiin säilömistä varten
 * 
 */
/*
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
*/

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

/*
 * Ei käytössä!
 * Kirjoittaa SMRT3 korkesarvot tavujonoksi
 * @param data   korkeusarvot matriisissa
 * @return       korkeusarvot pareittain tavujonossa
 */
/*
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
*/
