var express = require('express');
var app = express();
var path = require('path');

app.use('/media', express.static(path.join(__dirname, '/media')));
app.use('/public', express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', {});
});


app.listen(3000);

