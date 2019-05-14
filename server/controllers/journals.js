const express = require("express");
const router = express.Router();
const Log = require("../models/log");
const roles = require("../modules/roles");

//обработка роутов
router.get("", (req, res) => getJournals(req, res));

router.get("/by_teacher_id", (req, res) => getTeacherJournals(req, res));

router.get("/by_id", (req, res) => getJournal(req, res));

router.post("/add", (req, res) => addJournal(req, res));

router.post("/del", (req, res) => delJournal(req, res));

router.post("/edit", (req, res) => editJournal(req, res));



const getJournals = (req, res) =>
    Log.find(
        {},
        undefined,
        {
            sort: {
                name: 1
            }
        }
    ).then(logs => res.json(logs))
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });

const getTeacherJournals = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.session.auth._id === req.query.id) {
        const { id } = req.query;

        Log.find({ owner: { _id: id } },
            undefined,
            {
                sort: {
                    name: 1
                }
            }
        ).then(journals => res.json(journals))
            .catch(error => {
                console.error(error);
                res.sendStatus(500);
            });
    } else res.sendStatus(403);
};

const getJournal = (req, res) =>
    Log.findById(req.query)
        .then(journal => {
            if (req.session.auth.role === roles.ADMIN || journal.owner === req.session.auth._id){
                res.json(journal)
            } else res.sendStatus(403);
        })
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });

const addJournal = (req, res) => {
    if (req.session.auth.role === roles.TEACHER && req.session.auth._id === req.body.owner) {
        const journal = req.body;

        new Log(journal).save()
            .then(journal => res.json(journal))
            .catch(error => {
                console.error(error);
                res.sendStatus(500);
            });
    } else res.sendStatus(403);

};

const delJournal = (req, res) =>
    Log.findByIdAndDelete(req.body.id)
        .then(() => res.send())
        .catch(err => res.sendStatus(500));

const editJournal = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.session.auth._id === req.body.owner) {
        Log.findByIdAndUpdate(req.body._id, req.body)
            .then(journal => res.json(journal))
            .catch(error => {
                console.log(error);
                res.sendStatus(500);
            });
    }
};

module.exports = router;