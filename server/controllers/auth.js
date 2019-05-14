const express = require("express");
const router = express.Router();
const roles = require("../modules/roles");
const User = require("../models/user")

//обработка роутов
router.post("/login", (req, res) => authorize(req, res));

router.post("/logout", (req, res) => unAuthorize(req,res));

router.get("/current", (req, res) => getSessionUser(req,res));

const authenticate = ({ role = roles.ADMIN, _id = "null", login = "admin", password = "admin",
                          firstName = "admin", lastName = "admin"} = {}, req, res) => {
    req.session.auth = {
        role,
        _id,
        login,
        password,
        firstName,
        lastName
    };

    res.send(req.session.auth);
};

//авторизация
const authorize = (req, res) => {
    const { login, password } = req.body;

    if (login === "admin") {
        if (password === "admin") {
            authenticate({}, req, res);
        } else  {
            res.status(401).send({ error: "Неверный логин или пароль" });
        }
    } else {
        User.findOne({ login, password }).then( data => {
            if (data === null){
                res.status(401).send({ error: "Неверный логин или пароль" });
            } else {
                authenticate(data, req, res);
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send({ error: "Произошла ошибка сервера" });
        });
    }
};
//выход
const unAuthorize = (req, res) => {
    const { session } = req;
    session.auth = null;

    res.send();
};
//сессионный пользователь
const getSessionUser = (req, res) => {
    if (req.session.auth) {
        res.send(req.session.auth);
    } else {
        res.sendStatus(401);
    }
};

module.exports = router;