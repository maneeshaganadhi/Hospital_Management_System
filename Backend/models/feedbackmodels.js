let mongoose = require("mongoose");

let feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Anonymous"
    },
    rating: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
