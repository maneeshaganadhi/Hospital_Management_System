let Feedback = require("../models/feedbackmodels");

let addfeedback = async (req, res) => {
    try {
        let feedback = new Feedback(req.body);
        await feedback.save();
        res.json({ msg: "Feedback added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error adding feedback" });
    }
};

let getfeedbacks = async (req, res) => {
    try {
        let feedbacks = await Feedback.find().sort({ date: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching feedbacks" });
    }
};

let deletefeedback = async (req, res) => {
    try {
        let feedbackid = req.params.id;
        await Feedback.findByIdAndDelete(feedbackid);
        res.json({ msg: "Feedback deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error deleting feedback" });
    }
};

module.exports = { addfeedback, getfeedbacks, deletefeedback };
