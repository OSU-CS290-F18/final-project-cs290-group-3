var express = require('express');
var exphbs = require('express-handlebars');
var postData = require('./postData');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

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

app.get('/', renderIndexPage);
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

app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log("== Server is listening on port", port);
});