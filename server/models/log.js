const mongoose = require("mongoose");
//модель журнала

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
        name: {
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
        firstName: String,
        lastName: String,
        parents: String,
        misses: [mongoose.Schema.Types.ObjectId],
        medical: Boolean,
        address: String,
        phone: String
    }]
});

const model = mongoose.model("Log", schema);

module.exports = model;
