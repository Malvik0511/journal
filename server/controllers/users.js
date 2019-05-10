const express = require("express");
const router = express.Router();
const User = require("../models/user");

//обработка роутов
router.get("", (req, res) => getUsers(req, res));

router.post("/add", (req, res) => addUser(req, res));

router.post("/del", (req, res) => delUser(req, res));

router.post("/edit", (req, res) => editUser(req, res));


const getUsers = (req, res) =>
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
            res.sendStatus(500);
        });

const addUser = (req, res) => {
    const user = req.body;
    User.findOne({login: user.login}).then( data => {
        if (data === null){
            new User(user).save()
                .then(student => res.json(student))
                .catch(error => {
                    console.error(error);
                    res.sendStatus(500);
                });
        } else {
            res.status(422).send({error: "Пользователь существует"});
        }
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    });
};

const editUser = (req, res) => {
    User.findByIdAndUpdate(req.body._id, req.body)
        .then(student => res.json(student))
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
};

const delUser = (req, res) => {
    console.log(req.body.id)
    User.findByIdAndDelete(req.body.id)
        .then(() => res.send())
        .catch(err => res.sendStatus(500));
}




module.exports = router;