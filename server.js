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
const crypto = require('crypto');
const session = require('cookie-session');

app.set('view engine', 'pug');

app.use(session({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
        secure: true,
        path: '/'
    },
    maxAge: 7 * 24 * 60 * 60 * 1000
}));

function getTime() {
    return `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
}

db.none(`CREATE TABLE IF NOT EXISTS accounts(
    pid			serial		primary key,	
    login		test 		unique		not null,
    pass		text					not null)`)
    .then(() => {
        console.log(`${getTime()} Table accounts created or already present`)
    })
    .catch((err) => {
        console.log(`${getTime()} Table wasnt created`, err)
    });
db.none(`CREATE TABLE IF NOT EXISTS profile(
    login			text	not null	unique,
    first_name		text	not null,
    second_name		text	not	null,
    birthdate		text	not null,
    education		text	not null,
    experience		int		not null,
    specialization	text	not null,
    phone			text	not null,
    time_mode		text	not null,
    pay_b			int		not null,
    pay_t			int		not null,
    about			text	not null)`)
    .then(() => {
        console.log(`${getTime()} Table profile created or already present`)
    })
    .catch((err) => {
        console.log(`${getTime()} Table wasnt created`, err)
    });

app.get('/', (req, res) => {
    if (req.session.message === undefined)
        res.render('index');
    else{
        res.render('index', {user: req.session.message})
    }
});

app.post('/', jsonParser, (req, res) => {
    switch (req.body.type) {
        case "articles": {
            db.any("SELECT * FROM profile")
                .then((data) => {
                    res.json(data)
                })
                .catch();
            break;
        }
        case "search": {
            console.log(req.body);
            res.json(`${req.body.search_req}, ${req.body.radio}`);
            break;
        }
    }
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', urlencodedParser, (req, res) => {
    let password = req.body.password;
    let hashedPass = crypto.createHmac('sha1', "123") //TODO: Сделать генерацию соли
        .update(password)
        .digest('hex');

    db.none("INSERT INTO accounts (login, pass) VALUES($1, $2)", [req.body.login, hashedPass])
        .then(() => {
            console.log("Account created");
            req.session.message = req.body.login;
            // let t = req.session.message.indexOf('@');
            // let currentUser = req.session.message.substring(0, t);
            res.redirect('profile');
        })
        .catch((err) => {
            console.log(`${getTime()} Account wasnt created`, err);
            res.render('register', {errorCode: "Невозможно зарегестрироваться, возможно такой аккаунт уже существует!"})
        });
    console.log(req.body);
});

app.get('/login', (req, res) => {
    res.render('login', {errorCode: ""})
});

app.post('/login', urlencodedParser, (req, res) => {
    let password = req.body.password;
    let hashedPass = crypto.createHmac('sha1', "123") //TODO: Сделать генерацию соли
        .update(password)
        .digest('hex');

    db.one("SELECT pass FROM accounts WHERE login = $1", req.body.login)
        .then((data) => {
            let {pass} = data;
            console.log(`${getTime()} password is ` + (hashedPass === pass));
            req.session.message = req.body.login;
            console.log(req.session.message);
            res.redirect('profile');
        })
        .catch((err) => {
            console.log(`${getTime()} ${err}`);
            res.render('login', {errorCode: "Неправильный логин и/или пароль!"})
        });
});

///render profile page
app.get('/profile', (req, res) => {
    if (req.session.message === undefined) res.redirect('/404');
    else
        res.render('profile', {login: req.session.message, current: req.session.message});
});

app.post('/profile', jsonParser, (req, res) => {
    switch (req.body.type) {
        case "add": {
            db.none("INSERT INTO profile (login, first_name, second_name, birthdate, education, experience, specialization, phone, time_mode, pay_b, pay_t, about) " +
                "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [req.session.message, req.body.Name, req.body.Second, req.body.Birthdate,
                req.body.Education, req.body.Experience, req.body.Specialization, req.body.Phone, req.body.Time, req.body.Pay_b, req.body.Pay_t, req.body.About])
                .then(() => {
                    res.redirect("profile");
                })
                .catch((err) => {
                    console.log(`${getTime()} ${err}`);
                });
            break;
        }
        case "get": {
            db.any("SELECT first_name, second_name, birthdate, education, experience, specialization, phone, time_mode, pay_b, pay_t, about " +
                "FROM profile WHERE login = $1", req.session.message)
                .then((data) => {
                    res.send(data);
                });
            break;
        }
    }
});


///Sending styles & scripts
app.use('/assets', express.static('assets'));


///404 error
app.get('/:err*', (req, res) => {
    res.status(404).render('404')
});

const port = 200;
let now = new Date();
app.listen(port, () => {
    console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} Server running at http://127.0.0.1:${port} (http://localhost:${port})`);
});

