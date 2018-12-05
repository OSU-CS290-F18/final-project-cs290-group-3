var express = require('express');
var exphbs = require('express-handlebars');
var postData = require('./postData');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;
var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;

var mongoConnection = null;



var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(express.static('public'));

function renderIndexPage(req, res, next) {
  if (postData) {
    res.status(200).render('postPage', {
      posts: postData
    });
  } else {
    next();
  }
};

//app.get('/', renderIndexPage);


app.get('/', function (req, res) {
	console.log("==  home page is shown.")
	var postdatacollection = mongoConnection.collection('postData');
	postdatacollection.find({}).toArray(function (err, postData) {
		res.status(200).render('postPage', {
			posts: postData
		});
	});
});

app.get('/index.html', renderIndexPage);

app.get('/posts/:n', function (req, res, next) {
  var n = req.params.n.toLowerCase();
  if (postData[n]) {
    res.status(200).render('partials/postCard', postData[n]);
  } else {
    next();
  }
});

app.get('*', function (req, res) {
  res.status(404).render('404', {});
});

MongoClient.connect(mongoURL, function (err, client) {
  if (err) {
    throw err;
  }
  mongoConnection = client.db(mongoDBName);
  app.listen(port, function () {
    console.log("== Server listening on port", port);
  });
});