const rm = require("../models/receptionistmodels");
const User = require("../models/usermodels");

exports.addreceptionist = async (req, res) => {
    try {
        let input = req.body;
        // Check if exists in receptionists
        let existingReceptionist = await rm.findOne({ email: input.email });
        if (existingReceptionist) {

            return res.status(400).json({ "msg": "Receptionist already exists" });
        }

        let existingUser = await User.findOne({ email: input.email });
        if (!existingUser) {
            return res.status(400).json({ "msg": "User with this email not found" });

          
        }

        let data = new rm(input);
        await data.save();
        res.status(201).json({ "msg": "receptionist added successfully" });
    } catch (error) {
        console.error("Error adding receptionist:", error);
        res.status(500).json({ "msg": "error in adding receptionist" });
    }
};

exports.getreceptionists = async (req, res) => {
    try {
        let data = await rm.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching receptionists:", error);
        res.status(500).json({ "msg": "error in fetching receptionists" });
    }
};

exports.getReceptionistByUserId = async (req, res) => {
    try {
        let data = await rm.findOne({ userId: req.params.id });
        if (!data) {
            return res.status(404).json({ "msg": "Receptionist profile not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching receptionist by user id:", error);
        res.status(500).json({ "msg": "error in fetching receptionist" });
    }
};

exports.updatereceptionistbyid = async (req, res) => {
    try {
        let data = await rm.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) {
            return res.status(404).json({ "msg": "Receptionist not found" });
        }
        res.status(200).json({ "msg": "updated successfully", "data": data });
    } catch (error) {
        console.error("Error updating receptionist:", error);
        res.status(500).json({ "msg": "error in updating receptionist" });
    }
};

exports.deletereceptionistbyid = async (req, res) => {
    try {
        let data = await rm.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({ "msg": "Receptionist not found" });
        }
        res.status(200).json({ "msg": "deleted successfully" });
    } catch (error) {
        console.error("Error deleting receptionist:", error);
        res.status(500).json({ "msg": "error in deleting receptionist" });
    }
};
