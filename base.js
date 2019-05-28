var mysql = require('mysql');
var conn = mysql.createConnection ({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'customer'
});
conn.connect();

// const knex = require('knex')(options);
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));
app.get('/', function (req, res) {
  res.render('pages/home.ejs');
});
app.get('/register', (req, res) => {
    // knex.from('user').select('username', 'password', 'type').then((rows) => {
    //   // for (row of rows) {
    //     console.log(rows);
      // }
  // }).catch((err) => { console.log(err); throw err });
    res.render('pages/register.ejs');
});
app.get('/login', (req, res) => {
    res.render('pages/login.ejs');
})

app.post('/user-register', (req, res, next) => {
    console.log(req.body);
    console.log(req.body.email);
    conn.query('SELECT * FROM user WHERE username=?', [req.body.username], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        if (results != "") {
            res.redirect('back');
        }
        else {
            if (req.body.password == req.body.password_confirm) {
                conn.query('INSERT INTO user (username, password) VALUES (?, ?)', [req.body.username, req.body.password], function (error, results, fields) {
                    return res.redirect('/login');
                })
            }
            else {
                res.redirect('back');
            }
            // console.log("out");
        };
    })


})

app.post('/user-login', (req, res, next) => {
    console.log(req.body);
    console.log(req.body.email);

})
// app.get('/', (req, res) => {
//   res.render('pages/index.ejs');
// });
//
// app.get('/', function (req, res) {
//   res.render('pages/index.ejs');
// });
// app.use(express.static('public'));
app.use('/public', express.static('public'));
// app.use('/images', express.static('images'));
// app.use('/assets', express.static('assets'));
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
// knex.from('user').select('username', 'password', 'type').then((rows) => {
//   // for (row of rows) {
//     console.log(rows);
//   // }
// }).catch((err) => { console.log(err); throw err });
