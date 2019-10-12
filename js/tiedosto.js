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
    const filename = url.split('/').pop();
    
    const request = new XMLHttpRequest();
    request.onprogress = function(e) {
        if (e.loaded && e.total) {
            console.log(filename+" "+Math.floor(e.loaded / e.total * 100)+" %");
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
    
    /**
    * Ilmoittaa virheestä selaimen konsoliin
    */
    function errorListener() {
        throw new Error("Virhe! Tiedostonluku epäonnistui.");
    }
}

/**
 * Purkaa zip-tiedoston ja kutsuu callback-funktiota
 * @param tiedosto       binäärinen zip-tiedosto
 * @param tiedostonimi   pakatun tiedoston nimi
 * @param callback       funktio vastaanottaa korkeusarvot
 * TODO: https://github.com/gildas-lormeau/zip.js/blob/master/WebContent/tests/test18.js
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

/**
 * Ei käytössä
 * Muodostaa hgt korkeusdatasta zip tiedoston
 * välimuistiin säilömistä varten
 * 
 */
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
