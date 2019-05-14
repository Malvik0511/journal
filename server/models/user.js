const mongoose = require("mongoose");
//модель пользователя
const schema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
});

const model = mongoose.model("User", schema);

module.exports = model;
