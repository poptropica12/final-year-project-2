var mysql = require('mysql');
var conn = mysql.createConnection ({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'customer'
});
conn.connect();

// const knex = require('knex')(options);
var flash = require('express-flash-messages');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
var session = require("express-session");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var cookieSession = require('cookie-session');
// app.use(express.cookieParser('keyboard cat'));
app.use(cookieParser('keyboard cat'));
// app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));
app.get('/', function (req, res) {
    // req.flash('info', 'Welcome');
    // res.render('index', {
    //     title: 'Home'
    // });
    // req.flash('notify', 'Redirect successful!')
    // res.redirect('/')
    login = req.session.login;
    if (login == 1) {

    }
    else {

    };
    console.log(login);
    res.render('pages/home.ejs', {login: login});
});
app.get('/register', (req, res) => {
    failure = req.query.status;
    // console.log('abc')
    console.log(failure);
    // knex.from('user').select('username', 'password', 'type').then((rows) => {
    //   // for (row of rows) {
    //     console.log(rows);
      // }
  // }).catch((err) => { console.log(err); throw err });
    res.render('pages/register.ejs', {failure: failure});
});
app.get('/login', (req, res) => {
    success = req.query.status;
    status = req.query.invalid;
    // console.log(success);
    console.log("status = " + status);
    res.render('pages/login.ejs', {success: success, invalid: status});
});

app.post('/user-register', (req, res, next) => {
    console.log("req.body = " + req.body);
    console.log("req.body.email =" + req.body.email);
    conn.query('SELECT * FROM user WHERE username=?', [req.body.username], function (error, results, fields) {
        if (error) throw error;
        console.log("results = " + results);
        if (results != "") {
            failure = true;
            res.redirect('/register?status=' + failure);
            // document.getElementById("container").innerHTML = ("<div class=\"alert alert-dismissible alert-danger\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;<button><strong>Oh snap!</strong> <a href=\"#\" class=\"alert-link\">Username has been taken, </a>please try something else and submitting again.</div>") + document.getElementById("container").innerHTML;
        }
        else if (req.body.password == req.body.password_confirm) {
                conn.query('INSERT INTO user (username, password) VALUES (?, ?)', [req.body.username, req.body.password], function (error, results, fields) {
                    success = true;
                    return res.redirect('/login?status=' + success);
                })
            }
            else {
                res.redirect('back');
            };
            // console.log("out");
    })


});

app.post('/user-login', (req, res, next) => {
    console.log(req.body);
    console.log(req.body.email);
    conn.query("SELECT `username`, `password` FROM `user` WHERE `username`=?", [req.body.username], function (error, results, fields) {
        if (error) throw error;
        console.log("results = " + results);
        if (results == "") {
            console.log("fail 1");
            status = true;
            return res.redirect("/login?invalid=" + status);
        }
        else if (req.body.password != results['password']) {
            console.log("fail 2");
            status = true;
            return res.redirect("/login?invalid=" + status);
        }
        else {
            status = false;
            console.log("succeess");
            conn.query("SELECT `uid` FROM user WHERE `username`=?", )
            req.session.login = 1;
            return res.redirect("/");
        }
    });

});
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
