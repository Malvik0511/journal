const express = require('express'),
    app = express(),
    flight = require("./controllers/flight"),
    auth = require("./controllers/auth"),
    users = require("./controllers/users"),
    port = 8000,
    session = require("express-session"),
    mongoose = require("mongoose"),
    mongoUrl = `mongodb://admin:admin@localhost:27017/journal`;

mongoose.connect(
    mongoUrl,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    }
).then(() => console.log("Successfully connected to mongodb"))
    .catch(err => console.log(`Cannot connect to database. Error: ${err}`));


app.use(express.json());

app.use(session({
    secret: "Pickle Rick!",
    resave: false,
    saveUninitialized: true
}));

app.use('/api/flight/', flight);
app.use('/api/user/', auth);
app.use('/api/users/', users);

app.listen(port, () => console.log(`Listening on port ${port}!`));