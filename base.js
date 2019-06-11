var mysql = require('mysql');
var conn = mysql.createConnection ({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'customer',
    multipleStatements: true
});
conn.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log("connected as id " + conn.threadID);
});

// const knex = require('knex')(options);
const flash = require('express-flash-messages');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const cookieSession = require('cookie-session');
// app.use(express.cookieParser('keyboard cat'));
// app.use(cookieParser('keyboard cat'));
// app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

// app.get('/test', function (req, res) {
//     res.render('pages/test');
// })
app.get('/', function (req, res) {
    // req.flash('info', 'Welcome');
    // res.render('index', {
    //     title: 'Home'
    // });
    // req.flash('notify', 'Redirect successful!')
    // res.redirect('/')
    // login = req.session.login;
    // if (login == 1) {
    //
    // }
    // else {
    if (req.cookies['uid']) {
        res.render('pages/home', {  uid: req.cookies['uid'], type: req.cookies['type']})
    }
    // console.log(login);
    else {
        res.render('pages/home',  {  uid: "", type: ""})
    };
});
app.get('/register', (req, res) => {
    failure = req.query.status;
    // console.log('abc')
    // console.log(failure);
    // knex.from('user').select('username', 'password', 'type').then((rows) => {
    //   // for (row of rows) {
    //     console.log(rows);
      // }
  // }).catch((err) => { console.log(err); throw err });
    res.render('pages/register.ejs', {failure: failure});
});
app.get('/login', (req, res) => {
    // if(req.query.wrongUsernamePassword) {
    //     res.render('page/login.ejs', {invalid: wrongUsernamePassword});
    // }
    // if (res.query.success) {
    //     res.
    // }
    // var url = new URL(windows.location.href);
    // status = req.query.invalid;
    // console.log(success);
    // console.log("status = " + status);
    res.render('pages/login');
});

// signout
app.get('/logout',(req, res) => {
    res.clearCookie('uid');
    res.clearCookie("type");
    res.clearCookie("username");
    res.redirect('/');
});

app.post('/user-register', (req, res, next) => {
    // console.log("req.body = " + req.body);
    // console.log("req.body.email =" + req.body.email);
    conn.query('SELECT * FROM user WHERE username=?', [req.body.email], function (error, results, fields) {
        if (error) throw error;
        // console.log("results = " + results);
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
    // console.log(req.body);
    // console.log("Login: req.body.username = " + req.body.username);
    if (req.body.username) {
        if (req.body.password) {
            conn.query("SELECT * FROM user WHERE username = ? AND password = ?", [req.body.username, req.body.password], function (error, results, fields) {
                // console.error(`SQL = SELECT * FROM user WHERE username = ${req.body.username} AND password = ${req.body.password}`);
                if (error) throw error;
                // console.error("results = " + results + "typeof = " + typeof(results));
                // if (results) console.error("username = " + results[0]);
                if (results[0] != undefined) {
                    username = results[0]['username'];
                    uid = results[0]['uid'];
                    type = results[0]['type'];
                    res.cookie('uid', results[0]['uid'], {maxAge: 900000});
                    res.cookie('username', results[0]['username'], {maxAge: 900000});
                    res.cookie('type', results[0]['type'], {maxAge: 900000});
                    res.redirect("/");

                }
                else {

                    console.log("Wrong username or password.");
                    res.redirect('/login?wrongUsernamePassword=' + true);
                }
            })
        }
        else {
            return res.redirect("/login?passwordNull=" + true);
        };
    }
    else {
        return res.redirect("/login?usernameNull=" + true);
    };
    // conn.query(`SELECT username, password FROM user WHERE username=${req.body.username}`,
    //     console.log("SELECT `username`, `password` FROM `user` WHERE `username`='?'", [req.body.username], function (
    //         error, results, fields) {
    //             if (error) throw error;
    //
    //         }
    //     ));
    //     console.log("results = " + results);
    //     if (results == "") {
    //         console.log("fail 1");
    //         status = true;
    //         return res.redirect("/login?invalid=" + status);
    //     }
    //     else if (req.body.password != results['password']) {
    //         console.log("fail 2");
    //         status = true;
    //         return res.redirect("/login?invalid=" + status);
    //     }
    //     else {
    //         status = false;
    //         console.log("success");
    //         conn.query("SELECT `uid` FROM user WHERE `username`=?",
    //         function (error, results, fields) {
    //             if (error) throw error;)
    //         req.session.login = 1;
    //         return res.redirect("/");
    //     }
    // );

});
// app.get('/', (req, res) => {
//   res.render('pages/index.ejs');
// });
//
// app.get('/', function (req, res) {
//   res.render('pages/index.ejs');
// });
// app.use(express.static('public'));


app.get('/product-listing', function (req, res) {
    conn.query("SELECT pid, name, price, image FROM product", function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        res.render('pages/product-listing', {uid: req.cookies['uid'], type: req.cookies['type'], results: results});
    });
});

app.get('/product/:pid', function (req, res) {
    // console.log(req.params.pid);
    var sql = [];
    sql[0] = "SELECT `user`.`uid`, `user`.`username`, `comment`.`comments`, `comment`.`rating`, DATE_FORMAT(`comment`.`time`, '%d-%m-%Y %r') AS time FROM `comment` INNER JOIN `user` ON `comment`.`uid` = `user`.`uid` WHERE `pid` = ?;";
    sql[1] = "SELECT product.pid, product.name, product.price, product.image FROM product WHERE product.pid = ?;";
    sql[2] = "SELECT pid, SUM(qty) AS qty FROM `sales` WHERE `pid` = ? GROUP BY `pid`"
    if (req.cookies['uid']) {
        conn.query(sql[0] + sql[1] + sql[2], [req.params.pid, req.params.pid, req.params.pid], function (error, results, fields) {
            if (error) throw error;
            // console.error(results);
            if (results[0] == "") {
                results[0]["comments"] = null;
                console.log("results[0] nothing fetched.");
            }
            else {
                // console.log("results[0] = ", results[0]);
            };
            if (results[1] == "") {
                console.log("results[1] nothing fetched. Please check.");
            }
            else {
                // console.log("results[1] = ", results[1]);
            };
            // console.log(results[2] && true);
            // console.log("results[2] = ", results[2]);
            // console.log(results[2].length);
            if (results[2] == "") {
                // console.log(results[2]);
                results[2][0] = {"qty": 0};
                console.log("results[2] nothing fetched.")
                // console.log(results[2][0]['qty']);
            }
            else {
                // console.log(results[2]);
                // console.log("results[2][0]['qty'] = ", results[2][0]['qty']);
            };
            res.render('pages/product', {comments: results[0], product: results[1], qty: results[2][0]['qty']});
            // results[0] = results[0];
            // if (!results[0] && results[0] != undefined) {
            //     results[0] = null;
            // };
        });
    }
    else {
        res.redirect('/login?login=' + false);
    };
});
app.post('/user-comment/:pid', (req, res, next) => {
    if (req.cookies['uid']) {
        console.log(req.body.date);
        conn.query("INSERT INTO `comment` (comments, pid, rating, uid) VALUES(?, ?, ?, ?)", [req.body.comment, req.params.pid, req.body.rating, req.cookies["uid"]], function (error, results, fields) {
            if (error) throw error;
            console.log(results.affectedRows + "row(s) has/have been inserted successfully.");
            res.redirect("/product-listing");
        });
    }
    else {
        res.redirect('/login?login=' + false);
    };
});
app.get('/records/:pid', (req, res, next) => {
    if (req.cookies['uid']) {
        var sql = []
        sql[0] = "SELECT * FROM product WHERE pid = ?;";
        sql[1] = "SELECT record.*, total.total FROM ((SELECT sales.cid, sales.qty, sales.pid, DATE_FORMAT(sales.date, '%d-%m-%Y') AS date, sales.uid, product.name FROM sales INNER JOIN product ON sales.pid = product.pid WHERE sales.pid = ?) AS record) INNER JOIN ((SELECT SUM(qty) AS total, pid FROM `sales` WHERE pid = ? GROUP BY pid) AS total) ON record.pid = total.pid"
        conn.query(sql[0] + sql[1], [req.params.pid, req.params.pid, req.params.pid], function (error, results, fields) {
            if (error) throw error;
            if (results[0] == "" || results[0] == undefined) {
                console.log("Something is wrong, this product does not exist.");
            };
            if (results[1] == "" || results[1] == undefined) {
                results[1][0] = {"total": 0};
                results[1][0] = {"pid": req.params.pid};
                // res.render("/pages/records", {uid: req.cookies['uid'], records: results})
            };
            res.render("pages/records", {uid: req.cookies['uid'], type: req.cookies['type'], records: results});
        });
    }
    else {
        res.redirect('/login?login=' + false);
    };
});
app.post('/new-record/:pid', (req, res, next) => {
    if (req.cookies['uid']) {
        console.log("Date = ", req.body.date);
        console.log("req.params.pid = ", req.params.pid);
        conn.query("INSERT INTO `sales` (date, pid, qty, uid) VALUES(STR_TO_DATE(?, '%Y-%m-%d'), ?, ?, ?);", [req.body.date, req.params.pid, req.body.qty, req.cookies['uid']], function (error, results, fields) {
            if (error) throw error;
            console.log(results.affectedRows + "row(s) has/have been inserted successfully.");
            res.redirect("/product-listing");
        });
    }
    else {
        res.redirect('/login?login=' + false);
    };
});
app.get('/dashboard', (req, res, next) => {
    if (req.cookies['uid']) {
        if (req.cookies['type'] == "admin") {
            conn.query("SELECT * FROM sales ORDER BY date DESC", function (error, results, fields) {
                if (error) throw error;
                // console.log(JSON.stringify(results[0]));
                res.render('pages/dashboard', {uid: req.cookies['uid']});
            });
        }
        else {
            res.redirect("/?permission=" + false);
        };
        // res.render("pages/dashboard");
    }
    else {
        res.redirect('/login?login=' + false);
    };
});

app.get('/annual-sales', (req, res, next) => {
    if(req.cookies['uid']) {
        if (req.cookies["type"] == "admin") {
            var sql = [];
            sql[0] = "SELECT sales.pid, product.name, SUM(sales.qty) AS \"Total sales\", YEAR(sales.date) AS \"Year\" FROM sales INNER JOIN product ON sales.pid = product.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY pid, YEAR(date) ORDER BY `Total sales` DESC;";
            sql[1] = "SELECT * FROM (SELECT sales.pid, product.name, SUM(sales.qty) AS total FROM sales INNER JOIN product ON sales.pid = product.pid GROUP BY sales.pid) AS a INNER JOIN (SELECT MAX(Total_sales) AS Maximum FROM (SELECT sales.pid, product.name, SUM(sales.qty) AS \"Total_sales\", YEAR(sales.date) AS \"Year\" FROM sales INNER JOIN product ON sales.pid = product.pid GROUP BY pid, YEAR(date)) AS temp) AS b ON a.total = b.Maximum;";
            sql[2] = "SELECT YEAR(date) AS \"Year\", sales.pid, sales.qty, product.name FROM `sales` INNER JOIN product ON sales.pid = product.pid WHERE YEAR(date) = YEAR(SYSDATE());";
            sql[3] = "SELECT sales.pid, product.name, COUNT(*) AS number FROM sales INNER JOIN product ON sales.pid = product.pid WHERE YEAR(date) = YEAR(SYSDATE()) GROUP BY sales.pid;";
            conn.query(sql[0] + sql[1] + sql[2] + sql[3], function (error, results, fields) {
                // console.log(results[0]);
                if (error) throw error;
                if (results[0][0] === undefined) {
                    results[0][0] = {"Total sales": 0};
                }

                res.render('pages/annual-sales', {uid: req.cookies["uid"], results: results});
            });
        }
        else {
            res.redirect("/?permission=" + false);
        };
    }
    else {
        res.redirect('/login?login=' + false);
    };
});
app.get('/monthly-sales', (req, res, next) => {
    if (req.cookies['uid']) {
        if (req.cookies["type"] == "admin") {
            var sql = [];
            sql[0] = "SELECT sales.pid, product.name, SUM(sales.qty) AS \"Total sales\", MONTHNAME(sales.date) AS \"Month\" FROM sales INNER JOIN product ON sales.pid = product.pid WHERE MONTH(sales.date) = MONTH(SYSDATE()) GROUP BY pid, MONTHNAME(sales.date) ORDER BY `Total sales` DESC;";
            sql[1] = "SELECT * FROM (SELECT sales.pid, product.name, SUM(sales.qty) AS total FROM sales INNER JOIN product ON sales.pid = product.pid GROUP BY sales.pid) AS a INNER JOIN (SELECT MAX(Total_sales) AS Maximum FROM (SELECT sales.pid, product.name, SUM(sales.qty) AS \"Total_sales\", MONTH(sales.date) AS \"Month\" FROM sales INNER JOIN product ON sales.pid = product.pid GROUP BY pid, MONTH(date)) AS temp) AS b ON a.total = b.Maximum;";
            sql[2] = "SELECT MONTHNAME(date) AS \"Month\", sales.pid, sales.qty, product.name FROM `sales` INNER JOIN product ON sales.pid = product.pid WHERE MONTH(date) = MONTH(SYSDATE());";
            sql[3] = "SELECT sales.pid, product.name, COUNT(*) AS number FROM sales INNER JOIN product ON sales.pid = product.pid WHERE MONTH(date) = MONTH(SYSDATE()) GROUP BY sales.pid;";
            conn.query(sql[0] + sql[1] + sql[2] + sql[3], function (error, results, fields) {
                // console.log(results[0]);
                if (error) throw error;
                if (results[0][0] === undefined) {
                    results[0][0] = {"Total sales": 0};
                }

                res.render('pages/monthly-sales', {uid: req.cookies["uid"], results: results});
            });
        }
        else {
            res.redirect("/?permission=" + false);
        };
    }
    else {
        res.redirect('/login?login=' + false);
    };
});

app.get('/weekly-sales', (req, res, next) => {
    if (req.cookies['uid']) {
        if (req.cookies["type"] == "admin") {
            var sql = [];
            sql[0] = "SELECT `sales`.`pid`, `product`.`name`, SUM(`sales`.`qty`) AS \"Total sales\", DATE_FORMAT(`sales`.`date`, \"%d-%m-%Y, %W\") AS \"Date\" FROM `sales` INNER JOIN `product` ON `sales`.`pid` = `product`.`pid` WHERE (`sales`.`date` BETWEEN SYSDATE() - INTERVAL 7 DAY AND SYSDATE()) GROUP BY `pid`, `sales`.`date` ORDER BY `Total sales` DESC;";
            sql[1] = "SELECT * FROM (SELECT `sales`.`pid`, `product`.`name`, SUM(`sales`.`qty`) AS \"Total sales\", DATE_FORMAT(`sales`.`date`, \"%d-%m-%Y, %W\") AS \"Date\" FROM `sales` INNER JOIN `product` ON `sales`.`pid` = `product`.`pid` WHERE (`sales`.`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY `sales`.`pid`, `sales`.`date`) AS a INNER JOIN (SELECT MAX(`a`.`Total sales`) AS \"Maximum\" FROM (SELECT `sales`.`pid`, `product`.`name`, SUM(`sales`.`qty`) AS \"Total sales\", DATE_FORMAT(`sales`.`date`, \"%d-%m-%Y, %W\") AS \"Date\" FROM `sales` INNER JOIN `product` ON `sales`.`pid` = `product`.`pid` WHERE (`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY `sales`.`pid`, `sales`.`date`) AS a) AS b ON a.`Total sales` = b.`Maximum`;";
            sql[2] = "SELECT DATE_FORMAT(`sales`.`date`, \"%d-%m-%Y, %W\") AS \"Date\", `sales`.`pid`, `sales`.`qty`, `product`.`name` FROM `sales` INNER JOIN `product` ON `sales`.`pid` = `product`.`pid` WHERE (`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE());";
            sql[3] = "SELECT sales.pid, product.name, COUNT(*) AS number FROM sales INNER JOIN product ON sales.pid = product.pid WHERE (`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY sales.pid;";
            conn.query(sql[0] + sql[1] + sql[2] + sql[3], function (error, results, fields) {
                // console.log(results[0][0]['Date']);
                if (error) throw error;
                if (results[0][0] === undefined) {
                    results[0][0] = {"Total sales": 0};
                }

                res.render('pages/weekly-sales', {uid: req.cookies["uid"], results: results});
            });
        }
        else {
            res.redirect("/?permission=" + false);
        };
    }
    else {
        res.redirect('/login?login=' + false);
    };
});

app.get('/annual-revenue', (req, res, next) => {
    if(req.cookies['uid']) {
        if (req.cookies["type"] == "admin") {
            var sql = [];
            sql[0] = "SELECT product.pid, product.name, product.price, SUM(sales.qty) AS \"Total sales\", ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\", YEAR(SYSDATE()) AS \"Year\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY pid ORDER BY `Total revenue` DESC, `Total sales` DESC, product.price ASC;";
            sql[1] = "SELECT product.pid, product.name, product.price, product.cost, SUM(sales.qty) AS \"Total sales\", ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\", YEAR(SYSDATE()) AS \"Year\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY pid ORDER BY `Total profit` DESC, `Total sales` DESC, product.price ASC;";
            sql[2] = "SELECT a.* FROM (SELECT product.pid, product.name, product.price, SUM(sales.qty) AS \"Total sales\", ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\", YEAR(SYSDATE()) AS \"Year\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY pid ORDER BY `Total revenue` DESC, `Total sales` DESC, product.price ASC) AS a INNER JOIN (SELECT ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY sales.pid ORDER BY `Total revenue` DESC, product.price ASC LIMIT 1) AS b ON a.`Total revenue` = b.`Total revenue`;";
            sql[3] = "SELECT a.* FROM (SELECT product.pid, product.name, product.price, product.cost, SUM(sales.qty) AS \"Total sales\", ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\", YEAR(SYSDATE()) AS \"Year\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY pid ORDER BY `Total profit` DESC, `Total sales` DESC, product.price ASC) AS a INNER JOIN (SELECT ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY sales.pid ORDER BY `Total profit` DESC, product.price ASC LIMIT 1) AS b ON a.`Total profit` = b.`Total profit`;";
            conn.query(sql[0] + sql[1] + sql[2] + sql[3], function (error, results, fields) {
                // console.log(results[0]);
                if (error) throw error;
                if (results[0][0] === undefined) {
                    results[0][0] = {"Total sales": 0};
                }

                res.render('pages/annual-revenue', {uid: req.cookies["uid"], results: results});
            });
        }
        else {
            res.redirect("/?permission=" + false);
        };
    }
    else {
        res.redirect('/login?login=' + false);
    };
});

app.get('/monthly-revenue', (req, res, next) => {
    if(req.cookies['uid']) {
        if (req.cookies["type"] == "admin") {
            var sql = [];
            sql[0] = "SELECT product.pid, product.name, product.price, SUM(sales.qty) AS \"Total sales\", ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\", MONTHNAME(sales.date) AS \"Month\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE MONTH(sales.date) = MONTH(SYSDATE()) GROUP BY pid ORDER BY `Total revenue` DESC, `Total sales` DESC, product.price ASC;";
            sql[1] = "SELECT product.pid, product.name, product.price, product.cost, SUM(sales.qty) AS \"Total sales\", ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\", MONTHNAME(sales.date) AS \"Month\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE MONTH(sales.date) = MONTH(SYSDATE()) GROUP BY pid ORDER BY `Total profit` DESC, `Total sales` DESC, product.price ASC;";
            sql[2] = "SELECT a.* FROM (SELECT product.pid, product.name, product.price, SUM(sales.qty) AS \"Total sales\", ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\", MONTH(SYSDATE()) AS \"Month\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE MONTH(sales.date) = MONTH(SYSDATE()) GROUP BY pid ORDER BY `Total revenue` DESC, `Total sales` DESC, product.price ASC) AS a INNER JOIN (SELECT ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE MONTH(sales.date) = MONTH(SYSDATE()) GROUP BY sales.pid ORDER BY `Total revenue` DESC, product.price ASC LIMIT 1) AS b ON a.`Total revenue` = b.`Total revenue`;";
            sql[3] = "SELECT a.* FROM (SELECT product.pid, product.name, product.price, product.cost, SUM(sales.qty) AS \"Total sales\", ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\", MONTH(SYSDATE()) AS \"Month\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE MONTH(sales.date) = MONTH(SYSDATE()) GROUP BY pid ORDER BY `Total profit` DESC, `Total sales` DESC, product.price ASC) AS a INNER JOIN (SELECT ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE MONTH(sales.date) = MONTH(SYSDATE()) GROUP BY sales.pid ORDER BY `Total profit` DESC, product.price ASC LIMIT 1) AS b ON a.`Total profit` = b.`Total profit`;";
            conn.query(sql[0] + sql[1] + sql[2] + sql[3], function (error, results, fields) {
                // console.log(results[0]);
                if (error) throw error;
                if (results[0][0] === undefined) {
                    results[0][0] = {"Total sales": 0};
                }

                res.render('pages/monthly-revenue', {uid: req.cookies["uid"], results: results});
            });
        }
        else {
            res.redirect("/?permission=" + false);
        };
    }
    else {
        res.redirect('/login?login=' + false);
    };
});

app.get('/weekly-revenue', (req, res, next) => {
    if(req.cookies['uid']) {
        if (req.cookies["type"] == "admin") {
            var sql = [];
            sql[0] = "SELECT product.pid, product.name, product.price, SUM(sales.qty) AS \"Total sales\", ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\", DATE_FORMAT(sales.date, \"%d-%m-%Y, %W\") AS \"Date\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE (`sales`.`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY sales.pid ORDER BY `Total revenue` DESC, `Total sales` DESC, product.price ASC;";
            sql[1] = "SELECT product.pid, product.name, product.price, product.cost, SUM(sales.qty) AS \"Total sales\", ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\", DATE_FORMAT(sales.date, \"%d-%m-%Y, %W\") AS \"Date\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE (`sales`.`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY pid ORDER BY `Total profit` DESC, `Total sales` DESC, product.price ASC;";
            sql[2] = "SELECT a.* FROM (SELECT product.pid, product.name, product.price, SUM(sales.qty) AS \"Total sales\", ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\", DATE_FORMAT(sales.date, \"%d-%m-%Y, %W\") AS \"Date\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE (`sales`.`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY pid ORDER BY `Total revenue` DESC, `Total sales` DESC, product.price ASC) AS a INNER JOIN (SELECT ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE (`sales`.`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY sales.pid ORDER BY `Total revenue` DESC, product.price ASC LIMIT 1) AS b ON a.`Total revenue` = b.`Total revenue`;";
            sql[3] = "SELECT a.* FROM (SELECT product.pid, product.name, product.price, product.cost, SUM(sales.qty) AS \"Total sales\", ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\", DATE_FORMAT(sales.date, \"%d-%m-%Y, %W\") AS \"Date\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE (`sales`.`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY pid ORDER BY `Total profit` DESC, `Total sales` DESC, product.price ASC) AS a INNER JOIN (SELECT ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE (`sales`.`date` BETWEEN STR_TO_DATE(SYSDATE() - INTERVAL 7 DAY, \"%Y-%m-%d\") AND SYSDATE()) GROUP BY sales.pid ORDER BY `Total profit` DESC, product.price ASC LIMIT 1) AS b ON a.`Total profit` = b.`Total profit`;";
            conn.query(sql[0] + sql[1] + sql[2] + sql[3], function (error, results, fields) {
                // console.log(results[0][0]);
                if (error) throw error;
                if (results[0][0] === undefined) {
                    results[0][0] = {"Total sales": 0};
                }

                res.render('pages/weekly-revenue', {uid: req.cookies["uid"], results: results});
            });
        }
        else {
            res.render("/?permission=" + false);
        };
    }
    else {
        res.redirect('/login?login=' + false);
    };
});

app.get('/operating-profit-margin', (req, res, next) => {
    if (req.cookies['uid']) {
        if (req.cookies["type"] == "admin") {
            var sql = [];
            sql[0] = "SELECT SUM(sales.qty) AS \"Total sales\", ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\", YEAR(SYSDATE()) AS \"Year\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY YEAR(sales.date) ORDER BY `Total revenue` DESC, `Total sales` DESC, product.price ASC LIMIT 1;"
            sql[1] = "SELECT SUM(sales.qty) AS \"Total sales\", ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\", YEAR(SYSDATE()) AS \"Year\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY YEAR(SYSDATE()) ORDER BY `Total profit` DESC, `Total sales` DESC, product.price ASC LIMIT 1;";
            conn.query(sql[0] + sql[1], function(error, results, fields) {
                // console.log(results[0][0]['Total sales']);
                // console.log(results[1][0]["Total sales"]);
                if (error) throw error;
                if (results[0][0] === undefined) {
                    console.log("No profit.");
                    results[0][0] = {"Total sales": 0};
                };
                // console.log("results[0][0]['Total sales'] =", results[0][0]['Total sales']);
                // console.log("results[1][0]['Total sales'] = ", results[1][0]["Total sales"]);
                res.render('pages/operating-profit-margin', {uid: req.cookies["uid"], results: results});
            });
        }
        else {
            res.redirect("/?permission=" + false);
        };
    }
    else {
        res.redirect('/login?login=' + false);
    };
});

app.get('/gross-profit-margin', (req, res, next) => {
    if (req.cookies['uid']) {
        if (req.cookies["type"] == "admin") {
            var sql = [];
            sql[0] = "SELECT SUM(sales.qty) AS \"Total sales\", ROUND(SUM(product.price * sales.qty), 2) AS \"Total revenue\", YEAR(SYSDATE()) AS \"Year\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY YEAR(sales.date) ORDER BY `Total revenue` DESC, `Total sales` DESC, product.price ASC LIMIT 1;"
            sql[1] = "SELECT SUM(sales.qty) AS \"Total sales\", ROUND(SUM((product.price - product.cost)* sales.qty), 2) AS \"Total profit\", YEAR(SYSDATE()) AS \"Year\" FROM product INNER JOIN sales ON product.pid = sales.pid WHERE YEAR(sales.date) = YEAR(SYSDATE()) GROUP BY YEAR(SYSDATE()) ORDER BY `Total profit` DESC, `Total sales` DESC, product.price ASC LIMIT 1;";
            conn.query(sql[0] + sql[1], function(error, results, fields) {
                // console.log(results[0][0]['Total sales']);
                // console.log(results[1][0]["Total sales"]);
                if (error) throw error;
                if (results[0][0] === undefined) {
                    console.log("No profit.");
                    results[0][0] = {"Total sales": 0};
                };
                // console.log("results[0][0]['Total sales'] =", results[0][0]['Total sales']);
                // console.log("results[1][0]['Total sales'] = ", results[1][0]["Total sales"]);
                res.render('pages/gross-profit-margin', {uid: req.cookies["uid"], results: results});
            });
        }
        else {
            res.redirect("/?permission=" + false);
        }
    }
    else {
        res.redirect('/login?login=' + false);
    };
});

app.get("/cost", (req, res, next) => {
    if (req.cookies['uid']) {
        if (req.cookies['type'] == "admin") {
            var sql = [];
            sql[0] = "SELECT `product`.`pid`, `product`.`name`, `product`.`cost` FROM `product` ORDER BY product.cost DESC, product.pid ASC;";
            sql[1] = "SELECT product.pid, product.name, product.cost AS \"Minimum unit\", product.cost * 1000 AS \"Minimum\" FROM product WHERE product.cost = (SELECT MIN(product.cost) AS \"Minimum unit\" FROM product);";
            sql[2] = "SELECT product.pid, product.name, MAX(`product`.`cost`) AS \"Maximum unit\", MAX(`product`.`cost`) * 1000 AS \"Maximum\" FROM `product` LIMIT 1;";
            sql[3] = "SELECT SUM(cost) AS \"Total unit cost\", SUM(cost) * 1000 AS \"Total cost\" FROM product;";
            conn.query(sql[0] + sql[1] + sql[2] + sql[3], function (error, results, fields) {
                if (error) throw error;
                console.log(results[1][0]['Minimum']);
                console.log(results[2][0]['Maximum']);
                console.log(results[0]);
                if (results[0][0] === undefined) {
                    results[0][0] = {"pid": 1, "cost": 0};
                    results[1][0] = {"pid": 1, "Minimum": 0, "Minimum unit": 0};
                    results[2][0] = {"pid": 1, "Maximum": 0, "Maximum unit": 0};
                    rseults[3][0] = {"Total unit cost": 0, "Total cost": 0};
                    console.log("No product costs available.");
                }
                else {

                    console.log("All good.");
                };
                res.render("pages/cost", {uid: req.cookies["uid"], results: results});
            });
        } else {
            res.redirect("/?permission=" + false);
        };
    }
    else {
        res.redirect("/login?login=" + false);
    };
});

app.get("/about", (req, res, next) => {
    res.render("pages/about", {uid: req.cookies["uid"], type: req.cookies["type"]});
});

app.get("/features", (req, res, next) => {
    res.render("pages/features", {uid: req.cookies["uid"], type: req.cookies["type"]});
});

app.get("/404-error", (req, res, next) => {
    res.render("pages/404-error", {uid: req.cookies["uid"], type: req.cookies["type"]});
});

app.get("/get-started", (req, res, next) => {
    res.render("pages/get-started", {uid: req.cookies["uid"], type: req.cookies["type"]});
});

app.get("/FAQ", (req, res, next) => {
    res.render("pages/FAQ", {uid: req.cookies["uid"], type: req.cookies["type"]});
});

app.get("/ROCE", (req, res, next) => {
    res.render("pages/ROCE", {uid: req.cookies["uid"], type: req.cookies["type"]});
});

app.get("/break-even-analysis", (req, res, next) => {
    res.render("pages/break-even-analysis", {uid: req.cookies["uid"], type: req.cookies["type"]});
});

app.get("/ratio-analysis", (req, res, next) => {
    res.render("pages/ratio-analysis", {uid: req.cookies["uid"], type: req.cookies["type"]});
});
// app.get('/test', (req, res, next) => {
//     if (req.cookies['uid']) {
//         conn.query("SELECT * FROM sales ORDER BY date DESC", function (error, results, fields) {
//             if (error) throw error;
//             res.send({"Hello": "World"});
//             // console.log(JSON.stringify(results[0]));
//             // res.render('/pages/dashboard', {results: results});
//         });
//
//         // res.render("pages/dashboard");
//     };
//     // else {
//     //     res.redirect('/login?login=' + false);
//     // };
// });
        // console.error("Comments variable below: ");
        // console.log(results[0]);
        // var product = conn.query("SELECT product.pid, product.name, product.price, product.image FROM product WHERE product.pid = ?", [req.params.pid]);

            // if (results) {
            //     res.render('pages/product', {results: results});
            // }
            // else {
            //
            //     res.render('pages/product?qty=0', {results: undefined, comment: comments});
            // };
            // console.log(results);
        // });
    //     console.log("@@@@@@@@@@@@@@@@@@");
    //     console.log(product);
    //     conn.query("SELECT pid, SUM(qty) FROM `sales` WHERE `pid` = ? GROUP BY `pid`", [req.params.pid], function (error, results, fields) {
    //         if (error) throw error;
    //         console.log(results);
    //         if (results[0] == undefined) {
    //             results[0]['qty'] = 0;
    //         };
    //         res.render('pages/product', {comments: comments, product: product, qty: results});
    //             // res.render({comments: comments, product: product, qty: results});
    //         // };
    //     });
    //     // res.render('pages/product');

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
app.use('/public', express.static('public'));
// app.use('/products', express.static('public/products'))
// app.use('/images', express.static('images'));
// app.use('/assets', express.static('assets'));
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
