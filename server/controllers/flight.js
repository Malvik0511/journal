const express = require("express");
const router = express.Router();

//параметры запроса
const query = "&system=iata&station=svx&transport_types=plane";

//сервис запросов к апи расписания
const ServiceApi = require("../api/ServiceApi")

//обработка роутов
router.get("/departure", (req, res) => getDeparture(res));

router.get("/arrival", (req, res) => getArrival(res));

//методы запроса рейсов
getDeparture = (res) =>
    new ServiceApi({ params: `${query}&event=departure` }).request()
        .then(response => {
            return res.send(response);
        })
        .catch(err => {
            return res.status(err.status || 500).send({ err: err.statusText });
        });

getArrival = (res) =>
    new ServiceApi({ params: `${query}&event=arrival` }).request()
        .then(response => {
            return res.send(response);
        })
        .catch(err => {
            return res.status(err.status || 500).send({ err: err.statusText });
        });

module.exports = router;