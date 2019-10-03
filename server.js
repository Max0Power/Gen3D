const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const DataStruct = require('./public/js/kaikki').DataStruct;
const fileTehtaat = require('./public/js/kaikki').fileTehtaat;
var dataStruct = new DataStruct();

//const hostname = '127.0.0.1';

app.use(express.static('public'));

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function(req,res) {
	    res.sendFile(__dirname+'/public/world.html');
    //__dirname : It will resolve to your project folder.
});

app.get('/db', function(req,res) {
	const lat_1 = parseFloat( req.query.lat_1 );
	const lat_2 = parseFloat( req.query.lat_2 );
	const lng_1 = parseFloat( req.query.lng_1 );
	const lng_2 = parseFloat( req.query.lng_2 );
	const max = parseInt( req.query.max );
	
	dataStruct.setCallbacks([function(args) {
		res.send(JSON.stringify(args));
	}]);
	
	if (lat_1 && lat_2 && lng_1 && lng_2 && max) {
		var files = fileTehtaat([lat_1,lng_1],[lat_2,lng_2],max);
		dataStruct.execute(files);
	} else {
		dataStruct.execute(null);
	}
});

let hostname = process.env.HOSTNAME;
let port = process.env.PORT;
if (port == null || port == "") {
	port = 8080;
}

const server = app.listen(port);
console.log(`Server running at http://${hostname}:${port}/`);
