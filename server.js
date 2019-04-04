'use strict';

const fs = require('fs');
const express = require('express');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const pgp = require('pg-promise')();
const config = require('./config'); //edit config.json adding path to db, keys for cookies & key for hashing passwords
const db = pgp(config.path);
const jsonParser = express.json();
const crypto = require('crypto');
const session = require('cookie-session');
const debug = require('debug')('http');

app.set('view engine', 'pug');

app.use(session({
    name: 'session',
    keys: [config.cookieKey1, config.cookieKey2],
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
db.none(`CREATE TABLE IF NOT EXISTS vacancy(
    login           text    not null    unique,
    name            text    not null,
    age             text    not null,
    education       text    not null,
    experience      int     not null,
    specialization  text    not null,
    phone           text    not null,
    time_mode       text    not null,
    pay_b           int     not null,
    pay_t           int     not null,
    about           text    not null);`)
    .then(() => {
        console.log(`${getTime()} Table vacancy created or already present`)
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
            let da1, da2;
            db.any("SELECT * FROM profile")
                .then((data) => {
                    da1 = data;
                })
                .catch();
            db.any("SELECT * FROM vacancy")
                .then((data) => {
                    da2 = data;
                })
                .catch();
            setTimeout(() => {
                // console.log({da1, da2});
                res.json({da1, da2});
            }, 100);

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
    let hashedPass = crypto.createHmac('sha1', config.passKey) //TODO: Сделать генерацию соли
        .update(password)
        .digest('hex');

    db.none("INSERT INTO accounts (login, pass) VALUES($1, $2)", [req.body.login, hashedPass])
        .then(() => {
            console.log("Account created");
            req.session.message = req.body.login;
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
    let hashedPass = crypto.createHmac('sha1', config.passKey) //TODO: Сделать генерацию соли
        .update(password)
        .digest('hex');

    db.one("SELECT pass FROM accounts WHERE login = $1", req.body.login)
        .then((data) => {
            let {pass} = data;
            console.log(`${getTime()} password is ` + (hashedPass === pass));
            if (hashedPass === pass) {
                req.session.message = req.body.login;
                console.log(`${getTime()} ${req.session.message}`);
                res.redirect('profile');
            }
            else {
                res.render('login', {errorCode: "Неправильный логин и/или пароль!"})
            }
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
        case "exit": {
            req.session = null;
            res.send({msg: "logged out"});
            break;
        }
        case "add": {
            db.one("SELECT first_name FROM profile WHERE login = $1", req.session.message)
                .then(() => {
                    console.log("empty");
                    db.none(`UPDATE profile SET first_name = $1, second_name = $2, birthdate = $3, education = $4, experience = $5,
                            specialization = $6, phone = $7, time_mode = $8, pay_b = $9, pay_t = $10, about = $11 WHERE login = $12`,
                        [req.body.Name, req.body.Second, req.body.Birthdate, req.body.Education, req.body.Experience,
                            req.body.Specialization, req.body.Phone, req.body.Time, req.body.Pay_b, req.body.Pay_t, req.body.About, req.session.message])
                        .then(() => {
                            res.redirect("profile");
                        })
                        .catch((err) => {
                            console.log(`${getTime()} ${err}`);
                        });
                })
                .catch(() => {
                    console.log("rejected");
                    db.none(`INSERT INTO profile (login, first_name, second_name, birthdate, education, experience, specialization, phone, time_mode, pay_b, pay_t, about) 
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [req.session.message, req.body.Name, req.body.Second, req.body.Birthdate,
                        req.body.Education, req.body.Experience, req.body.Specialization, req.body.Phone, req.body.Time, req.body.Pay_b, req.body.Pay_t, req.body.About])
                        .then(() => {
                            res.redirect("profile");
                        })
                        .catch((err) => {
                            console.log(`${getTime()} ${err}`);
                        });
                });
            break;
        }
        case "add-vac": {
            db.one("SELECT name FROM vacancy WHERE login = $1", req.session.message)
                .then(() => {
                    console.log("empty");
                    db.none(`UPDATE vacancy SET name = $1, age = $2, education = $3, experience = $4,
                            specialization = $5, phone = $6, time_mode = $7, pay_b = $8, pay_t = $9, about = $10 WHERE login = $11`,
                        [req.body.Name, req.body.Age, req.body.Education, req.body.Experience, req.body.Specialization,
                            req.body.Phone, req.body.Time, req.body.Pay_b, req.body.Pay_t, req.body.About, req.session.message])
                        .then(() => {
                            res.redirect("profile");
                        })
                        .catch((err) => {
                            console.log(`${getTime()} ${err}`);
                        });
                })
                .catch(() => {
                    console.log("rejected");
                    db.none(`INSERT INTO vacancy (login, name, age, education, experience, specialization, phone, time_mode, pay_b, pay_t, about) 
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [req.session.message, req.body.Name, req.body.Age,
                        req.body.Education, req.body.Experience, req.body.Specialization, req.body.Phone, req.body.Time, req.body.Pay_b, req.body.Pay_t, req.body.About])
                        .then(() => {
                            res.redirect("profile");
                        })
                        .catch((err) => {
                            console.log(`${getTime()} ${err}`);
                        });
                });
            break;
        }
        case "get": {
            db.any(`SELECT first_name, second_name, birthdate, education, experience, specialization, phone, time_mode, pay_b, pay_t, about 
                FROM profile WHERE login = $1`, req.session.message)
                .then((data) => {
                    res.send(data);
                });
            break;
        }
        case "get-vac": {
            db.any(`SELECT name, age, education, experience, specialization, phone, time_mode, pay_b, pay_t, about 
                FROM vacancy WHERE login = $1`, req.session.message)
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
app.listen(port, () => {
    console.log(`${getTime()} Server running at http://127.0.0.1:${port} (http://localhost:${port})`);
});

