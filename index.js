const options = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'customer'
    }
}

const knex = require('knex')(options);

knex.raw("SELECT VERSION()").then(
    (version) => console.log((version[0][0]))
).catch((err) => { console.log( err); throw err })
    .finally(() => {
        knex.destroy();
    });
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
