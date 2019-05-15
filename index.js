var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.render('pages/index.ejs');
});

app.get('/', (req, res) => {
  res.render('pages/index.ejs');
});

app.get('/', function (req, res) {
  res.render('pages/index.ejs');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
console.log(`${}`)
