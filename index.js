var express = require('express');
var app = express();
var path = require('path');

app.use('/media', express.static(path.join(__dirname, '/media')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', {});
});

app.get('/wiki/', function(req, res) {
  res.render('wiki', {});
});

app.listen(3000);

