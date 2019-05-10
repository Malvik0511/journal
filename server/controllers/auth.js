const express = require("express");
const router = express.Router();
const roles = require("../modules/roles");

//параметры запроса
const query = "&system=iata&station=svx&transport_types=plane";

//сервис запросов к апи расписания
const ServiceApi = require("../api/ServiceApi");

//обработка роутов
router.post("/login", (req, res) => authorize(req, res));

router.post("/logout", (req, res) => unAuthorize(req,res));

router.get("/current", (req, res) => getSessionUser(req,res));

const authenticate = (role, userId, req, res) => {
    req.session.auth = {
        role,
        userId
    };

    res.send(req.session.auth);
};

//методы запроса рейсов
const authorize = (req, res) => {
    const { login, password } = req.body;

    if (login === "admin") {
        if (password === "admin") {
            authenticate(roles.ADMIN, null, req, res);
        } else  {
            res.sendStatus(401);
        }
        return;
    } else {
        res.sendStatus(401);
    }
}

const unAuthorize = (req, res) => {
    const { session } = req;
    session.auth = null;

    res.send();
}

const getSessionUser = (req, res) => {
    if (req.session.auth) {
        res.send(req.session.auth);
    } else {
        res.sendStatus(401);
    }
}

module.exports = router;