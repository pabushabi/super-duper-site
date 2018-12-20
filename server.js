'use strict';

let fs = require('fs');
let express = require('express');
let app = express();
let pug = require('pug');
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});
let pgp = require('pg-promise')();
const dbpath = require('./dbpath');
let db = pgp(dbpath.path);

app.set('view engine', 'pug');
let currentUser = "";
let usersData = {
    login: "",
    password: ""
};

app.get('/', (req, res) => {
    if (currentUser[0] === "")
        res.render('index');
    else
        res.render('index', {user: currentUser})
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', urlencodedParser, (req, res) => {
    currentUser = req.body.login;
    usersData['login'] = req.body.login;
    usersData['password'] = req.body.password;
    let ni = currentUser.indexOf('@');
    currentUser = currentUser.substring(0, ni);

    db.one("INSERT INTO accounts (login, pass) VALUES($1, $2)", [req.body.login, req.body.password])
        .then(() => {
            console.log("account added");
        })
        .catch(() => {});

    res.render('profile', {data: req.body, current: currentUser});
    console.log(req.body);
    console.log(usersData)
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login', urlencodedParser, (req, res) => {
    db.one("SELECT pid FROM accounts WHERE login = $1 and pass = $2 ", [req.body.login, req.body.password])
        .then((data) => {
            console.log(data.pid);
            if (data.pid !== null) {
                currentUser = req.body.login;
                usersData['login'] = req.body.login;
                usersData['password'] = req.body.password;
                let ni = currentUser.indexOf('@');
                currentUser = currentUser.substring(0, ni);
                res.render('profile', {data: req.body, current: currentUser});
                console.log(req.body);
                console.log(usersData)
            }
        })
        .catch(() => {
            res.redirect('/404')
        });

    // db.one("INSERT INTO accounts (login, pass) VALUES($1, $2)", [req.body.login, req.body.password])
    //     .then(() => {
    //         console.log("account added");
    //     })
    //     .catch(() => {});
});

///render profile page
app.get('/profile', (req, res) => {
    if (currentUser === "") res.redirect('/404');
    else
        res.render('profile', { data: usersData, current: currentUser});
});


///Sending styles & scripts
app.use('/assets', express.static('assets'));


///404 error
app.get('/:err*', (req, res) => {
    res.status(404).render('404')
});

const port = 200;
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port} (http://localhost:${port})`);
});

