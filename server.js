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
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// app.use(session({
//
// }));


app.set('view engine', 'pug');
let currentUser = "";
let usersData = {
    login: "",
    password: ""
};

db.none(`CREATE TABLE IF NOT EXISTS accounts(
    pid			serial		primary key,	
    login		test 		unique		not null,
    pass		text					not null)`)
    .then(() => {
        console.log("Table accounts created or already present")
    })
    .catch((err) => {
        console.log("Table wasnt created", err)
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
        console.log("Table profile created or already present")
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
            res.redirect('profile');
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
                // document.cookie = "name=" + req.body.login;
                // console.log(document.cookie);
                res.redirect('profile');
                console.log(req.body);
                console.log(usersData);

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

app.post('/profile', jsonParser, (req, res) => {
    // db.one("SELECT login FROM profile WHERE login = $1", document.cookie.replace(/(?:(?:^|.*;\s*)name\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
    //     .then((data) => {
    //         if (data.login != null) console.log(1)
    //     })
    //     .catch((err) => {console.log(err)});
    console.log(req.body);
    db.none("INSERT INTO profile (login, first_name, second_name, birthdate, education, experience, specialization, phone, time_mode, pay_b, pay_t, about) " +
        "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [usersData.login, req.body.Name, req.body.Second, req.body.Birthdate,
        req.body.Education, req.body.Experience, req.body.Specialization, req.body.Phone, req.body.Time, req.body.Pay_b, req.body.Pay_t, req.body.About])
        .then(() => {
            res.redirect("profile")
        })
        .catch((err) => {
            console.log(err);
        })
});

app.put('/profile', (req, res) => {
    console.log("+");
    db.any("SELECT first_name, second_name, birthdate, education, experience, specialization, phone, time_mode, pay_b, pay_t, about " +
        "FROM profile WHERE login = $1", usersData['login'])
        .then((data) => {
            console.log("+_+");
            console.log(data);
            res.send(data);
        })
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

