const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    candidates: {
        type: [String],
        required: false
    }
});

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;
