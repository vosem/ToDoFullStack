var url  = require('url'),
    express = require('express'),
    http=require('http'),
    path = require('path'),
    config = require('./config'),
    connect = require('connect'),
    bodyParser = require('body-parser'),
    fs = require('fs');

var app = express();
var server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.engine('.html', require('ejs').__express);
// app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
		res.render('index');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// 1st POST for saveButton
app.post('/submit', function(req, res) {

	var receivedData = req.body;
    console.log(receivedData);
    console.log(typeof(receivedData));

    var receivedUrl = req.body.url;
    var receivedModel = req.body.model;

	//working with Mongo
	var List = require('./db/list').List;
	var list = new List(receivedData);
	list.save(function (err) {
  		if (err) {
    		console.log(err);
  		} else {
    		console.log('Ok');
  		}
	});

	res.end(JSON.stringify('OK'));
});


// 2nd POST  for loadButton
app.post('/load', function(req, res) {

    var receivedUniqueLink = req.body.uniqueLink;
    console.log(receivedUniqueLink);
    console.log(typeof(receivedUniqueLink));

    //working with Mongo
	var List = require('./db/list').List;
	List.findOne({url: receivedUniqueLink}, function(err, results) {
		if (results == null){
			res.send(JSON.stringify('null'));
		} else{
	  		console.log(results.model);
	    	console.log(typeof(results.model));

			res.end(JSON.stringify(results.model));
		}
	});
});

app.listen(config.get('port'));
console.log('server running on port ' + config.get('port'));