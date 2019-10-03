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
