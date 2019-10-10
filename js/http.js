/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

function httpGet(url,args,callback) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (request.response) {
				callback(JSON.parse(request.response));
            }
        }
    };
    request.open("GET", url+args);
    request.send();
}

function httpPost(url,args,callback) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (request.response) {
                callback(JSON.parse(request.response));
            }
        }
    };
    request.open("POST", url);
    request.send(args);
}

function httpGetArgs(args) {
    var list = "?";
    for (var i = 0; i < args.length; i++) {
        list += args[i][0]+"="+args[i][1]+"&";
    }
    
    return list.substr(0,list.lastIndexOf("&"));
}

function httpPostArgs(args) {
    return httpGetArgs(args).substr(1);
}
