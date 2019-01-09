'use strict';

const fs = require('fs');
const express = require('express');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const pgp = require('pg-promise')();
const dbpath = require('./dbpath');
const db = pgp(dbpath.path);  //replace 'dbpath.path' with 'postgres://username:password@localhost/dbname' or create dbpath.json file with this text
const jsonParser = express.json();

app.set('view engine', 'pug');
let currentUser = "";
let usersData = {
    login: "",
    password: ""
};

db.none("CREATE TABLE IF NOT EXISTS accounts(\n" +
    "pid serial primary key, \n" +
    "login text unique not null,\n" +
    "pass text not null)")
    .then(() => {
        console.log("Table created or already present")
    })
    .catch((err) => {
        console.log("Table wasnt created", err)
    });

app.get('/', (req, res) => {
    if (currentUser[0] === "")
        res.render('index');
    else
        res.render('index', {user: currentUser})
});

app.post('/', jsonParser, (req, res) => {
    console.log(req.body);
    res.json(`${req.body.search_req}, ${req.body.radio}`)
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', urlencodedParser, (req, res) => {
    db.none("INSERT INTO accounts (login, pass) VALUES($1, $2)", [req.body.login, req.body.password])
        .then(() => {
            console.log("Account created");
            currentUser = req.body.login;
            usersData['login'] = req.body.login;
            usersData['password'] = req.body.password;
            let ni = currentUser.indexOf('@');
            currentUser = currentUser.substring(0, ni);
            res.render('profile', {data: req.body, current: currentUser});
        })
        .catch((err) => {
            console.log("Account wasnt created", err);
            res.render('register', {errorCode: "Невозможно зарегестрироваться, возможно такой аккаунт уже существует!"})
        });
    console.log(req.body);
    console.log(usersData)
});

app.get('/login', (req, res) => {
    res.render('login', {errorCode: ""})
});

app.post('/login', urlencodedParser, (req, res) => {
    db.one("SELECT pid FROM accounts WHERE login = $1 and pass = $2", [req.body.login, req.body.password])
        .then((data) => {
            if (data.pid !== null) {
                currentUser = req.body.login;
                usersData['login'] = req.body.login;
                usersData['password'] = req.body.password;
                currentUser = currentUser.substring(0, currentUser.indexOf('@'));
                res.render('profile', {data: req.body, current: currentUser});
                console.log(req.body);
                console.log(usersData)
            }
        })
        .catch(() => {
            res.render('login', {errorCode: "Неправильный логин и/или пароль!"})
        });
});

///render profile page
app.get('/profile', (req, res) => {
    if (currentUser === "") res.redirect('/404');
    else
        res.render('profile', {data: usersData, current: currentUser});
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

