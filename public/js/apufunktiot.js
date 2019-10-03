/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/* Map methods */

/**
 * Returns a string with what map tile coordinates belong to
 * @param lat   latitude
 * @param lng   longitude
 * @returns     map info
 */
function mapinfo(lat, lng) {
	// Rounds down north or south value
	let ns = Math.floor(lat);
	// If value is 0 or more then it is N
	if (ns >= 0) {
        ns = "N" + addLeadingZeros(ns, 2);
    } else {
        ns = "S" + addLeadingZeros(-ns, 2);
    }

	// Rounds down east or west value
	let ew = Math.floor(lng);
	// If value is 0 or more then it is E
	if (ew >= 0) ew = "E" + addLeadingZeros(ew, 3);
	// If value is below 0 then it is W
	else ew = "W" + addLeadingZeros(-ew, 3);

	return ns + ew;
}

/**
 * Parses north or south coordinate from map name
 * @param {string} map - map name
 * @returns {int} north or south coordinate
 */
function parseNS(map) {
	let str = map.toLowerCase();
	let nsLetterPlace;
	if (str.indexOf("n") != -1) {
        nsLetterPlace = str.indexOf("n");
    }
	if (str.indexOf("s") != -1) {
        nsLetterPlace = str.indexOf("s");
    }
	let value = parseInt(str.substring(nsLetterPlace+1, nsLetterPlace+3));
	if (str.indexOf("s") != -1) {
        value = -value;
    }
	return value;
}

/**
 * Parses east or west coordinate from map name
 * @param {string} map - map name
 * @returns {int} east or west coordinate
 */
function parseEW(map) {
	let str = map.toLowerCase();
	let ewLetterPlace;
	if (str.indexOf("e") != -1) {
        ewLetterPlace = str.indexOf("e");
    }
	if (str.indexOf("w") != -1) {
        ewLetterPlace = str.indexOf("w");
    }
	let value = parseInt(str.substring(ewLetterPlace+1));
	if (str.indexOf("w") != -1) {
        value = -value;
    }
	return value;
}

/**
 * Adds leading zeros to number to make it a 3 digit number
 * @param number   number
 * @returns        number a in string with added leading zeros if necessary
 */
function addLeadingZeros(number, numbers) {
	if (numbers == 2) if (number < 10) return "0" + number;
	if (numbers == 3) {
		if (number < 10) return "00" + number;
		if (number < 100) return "0" + number;
	}
	return "" + number;
}

/**
 * Returns a Y coordinate which is calculated from the latitude
 * and is scaled based on the size of the map
 * @param {double} lat - latitude
 * @returns {int} y rounded
 */
function latToY(lat) {
	// Scale to the map
	if (lat < 0) {
        return scaleTo1200(lat);
    }
	return 1200 - scaleTo1200(lat);
}

/**
 * Returns a X coordinate which is calculated from the longitude
 * and is scaled based on the size of the map
 * @param {double} lng - longitude
 * @returns {int} x rounded
 */
function lngToX(lng) {
	// Scale to the map
	if (lng < 0) {
        return 1200 - scaleTo1200(lng);
    }
	return scaleTo1200(lng);
}

/**
 * Scales number that is between 0 and 1 (decimals of a coordinate)
 * to a range from 0 to 1200 (size of the map is 1200x1200 pixels)
 * @param a   number
 * @returns   scaled number
 */
function scaleTo1200(a) {
	let number = Math.abs(a);
	let int = Math.floor(number);
	let dec = number - int;
	return Math.round(1200 * dec);
}
