const express = require("express");
const router = express.Router();
const User = require("../models/user");
const roles = require("../modules/roles");

//обработка роутов
router.get("", (req, res) => getUsers(req, res));

router.post("/add", (req, res) => addUser(req, res));

router.post("/del", (req, res) => delUser(req, res));

router.post("/edit", (req, res) => editUser(req, res));


const getUsers = (req, res) => {
    if (req.session.auth.role === roles.ADMIN) {
        User.find(
            {},
            undefined,
            {
                sort: {
                    name: 1
                }
            }
        ).then(users => res.json(users))
            .catch(error => {
                console.error(error);
                res.status(500).send({ error: "Произошла ошибка сервера" });
            });
    } else {
        res.json([req.session.auth]);
    }
};

const addUser = (req, res) => {
    if (req.session.auth.role === roles.ADMIN) {
        const user = req.body;
        User.findOne({login: user.login}).then(data => {
            if (data === null && user.login !== "admin") {
                new User(user).save()
                    .then(student => res.json(student))
                    .catch(error => {
                        console.error(error);
                        res.status(500).send({ error: "Произошла ошибка сервера" });
                    });
            } else {
                res.status(422).send({error: "Пользователь существует"});
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send({ error: "Произошла ошибка сервера" });;
        });
    } else res.status(403).send({ error: "Нет прав для выполнения операции" });;
};

const editUser = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.body._id === req.session.auth._id) {
        User.findOne({login: req.body.login}).then(user => {
            if (req.body.login !== "admin" && (!user || user._id == req.body._id)) {
                User.findByIdAndUpdate(req.body._id, req.body)
                    .then(user => res.json(user))
                    .catch(error => {
                        console.log(error);
                        res.status(500).send({ error: "Произошла ошибка сервера" });
                    });
            }
            else res.status(422).send({ error: "Пользователь существует" })
        })
    } else res.status(403).send({ error: "Нет прав для выполнения операции" });;
};

const delUser = (req, res) => {
    if (req.session.auth.role === roles.ADMIN) {
        User.findByIdAndDelete(req.body.id)
            .then(() => res.send())
            .catch(err => res.status(500).send({ error: "Произошла ошибка сервера" }));
    } else res.status(403).send({ error: "Нет прав для выполнения операции" });;
};


module.exports = router;