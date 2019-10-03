/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

importScripts('matriisi.js', '../lib/math.js');

self.addEventListener('message', function(e) {
    self.postMessage(lineaari(e.data));
    self.close();
});
