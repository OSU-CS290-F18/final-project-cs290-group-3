var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUser = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = 'mongodb://' +
    mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort +
    '/' + mongoDBName;

var mongoDB = null;

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

function renderIndexPage(req, res, next) {
    var postsCollection = db.collection('posts');
    var postCursor = postsCollection.find({});
    postCursor.toArray(function(err, postDocs) {
        if (err) {
            res.status(500).send("Error fetching posts from DB.");
        } else {
            res.status(200).render('postPage', {
                posts: postDocs
            });
        }
    });
};

app.get('/', renderIndexPage);
app.get('/index.html', renderIndexPage);

app.get('/posts/:n', function(req, res, next) {
    var n = req.params.n.toLowerCase();
    var postsCollection = db.collection('posts');
    var postCursor = postsCollection.find({});
    postCursor.toArray(function(err, postDocs) {
        if (err) {
            res.status(500).send("Error fetching posts from DB.");
        } else {
            res.status(200).render('partials/postCard', postDocs[n]);
        }
    });
});

app.post('/posts/:post/addPost', function(req, res, next) {
    var post = req.params.post.toLowerCase();
    if (req.body && req.body.title && req.body.link && req.body.imageURL && req.body.theme) {
        var postsCollection = mongoDB.collection('posts');
        postsCollection.insertOne(
            {title: req.body.title,
            imageURL: req.body.imageURL,
            theme: req.body.theme,
            link: req.body.link},
            function(err, result) {
                if (err) {
                    res.status(500).send("Error saving post to DB");
                } else if (!result) {
                    next();
                } else {
                    res.status(200).send("Success");
                }
            }
        );
    } else {
        res.status(400).send("Request incomplete");
    }
});

app.get('*', function(req, res) {
    res.status(404).render('404');
});

MongoClient.connect(mongoURL, function(err, client) {
    if (err) {
        throw err;
    }
    mongoDB = client.db(mongoDBName);
    app.listen(port, function() {
        console.log("== Server listening on port", port);
    });
});