const express = require("express");
const router = express.Router();
const Log = require("../models/log");

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
};

const getJournal = (req, res) =>
    Log.findById(req.query)
        .then(journal => res.json(journal))
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });

const addJournal = (req, res) => {
    const journal = req.body;

    new Log(journal).save()
        .then(journal => res.json(journal))
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });
};

const delJournal = (req, res) =>
    Log.findByIdAndDelete(req.body.id)
        .then(() => res.send())
        .catch(err => res.sendStatus(500));

const editJournal = (req, res) => {
    Log.findByIdAndUpdate(req.body._id, req.body)
        .then(journal => res.json(journal))
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
};

module.exports = router;