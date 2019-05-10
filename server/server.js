const express = require('express'),
    app = express(),
    flight = require("./controllers/flight"),
    auth = require("./controllers/auth")
    port = 8000,
    session = require("express-session");

app.use(express.json());

app.use(session({
    secret: "Pickle Rick!",
    resave: false,
    saveUninitialized: true
}));

app.use('/api/flight/', flight);
app.use('/api/user/', auth);

app.listen(port, () => console.log(`Listening on port ${port}!`));