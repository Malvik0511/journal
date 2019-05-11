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

//методы запроса рейсов
const authorize = (req, res) => {
    const { login, password } = req.body;

    if (login === "admin") {
        if (password === "admin") {
            authenticate({}, req, res);
        } else  {
            res.sendStatus(401);
        }
    } else {
        User.findOne({ login, password }).then( data => {
            if (data === null){
                res.sendStatus(401);
            } else {
                authenticate(data, req, res);
            }
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
    }
}

const unAuthorize = (req, res) => {
    const { session } = req;
    session.auth = null;

    res.send();
};

const getSessionUser = (req, res) => {
    if (req.session.auth) {
        res.send(req.session.auth);
    } else {
        res.sendStatus(401);
    }
};

module.exports = router;