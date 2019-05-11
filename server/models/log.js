const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Date,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
    },
    lessons: [{
        type: {
            type: String,
            required: true
        },
        description: String,
        date: {
            type: String,
            required: true
        }
    }],
    students: [{
        name: String,
        parents: String,
        misses: [mongoose.Schema.Types.ObjectId]
    }]
});

const model = mongoose.model("Log", schema);

module.exports = model;
