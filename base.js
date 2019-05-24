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
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.render('pages/home.ejs');
});

// app.get('/', (req, res) => {
//   res.render('pages/index.ejs');
// });
//
// app.get('/', function (req, res) {
//   res.render('pages/index.ejs');
// });
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.use('/images', express.static('images'));
app.use('/assets', express.static('assets'));
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// console.log(`${ab}`)

// knex.raw("SELECT VERSION()").then(
//     (version) => console.log((version[0][0]))
// ).catch((err) => { console.log( err); throw err })
//     .finally(() => {
//         knex.destroy();
//     });
knex.from('user').select('username', 'password', 'type').then((rows) => {
  // for (row of rows) {
    console.log(rows);
  // }
}).catch((err) => { console.log( err); throw err })
    .finally(() => {
        knex.destroy();
    });
