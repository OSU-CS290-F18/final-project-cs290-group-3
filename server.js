var express = require('express');
var exphbs = require('express-handlebars');
var postData = require('./postData');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;




var mongoURL ='mongodb://cs290_jianghan:cs290_jianghan@classmongo.engr.oregonstate.edu:27017/cs290_jianghan';
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
