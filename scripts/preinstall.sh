#!/bin/bash
if
cat ./public/js/kaavat.js > ./public/js/kaikki.js
cat ./public/js/mallit.js >> ./public/js/kaikki.js
cat ./public/js/matriisi.js >> ./public/js/kaikki.js
cat ./public/js/mjonot.js >> ./public/js/kaikki.js
cat ./public/js/tiedosto.js >> ./public/js/kaikki.js
cat ./public/modules/DataController.js >> ./public/js/kaikki.js
cat ./public/modules/DataStruct.js >> ./public/js/kaikki.js
cat ./public/modules/File.js >> ./public/js/kaikki.js
echo "module.exports = { DataStruct, fileTehtaat };" >> ./public/js/kaikki.js
then echo "build.sh -> ok."
fi
