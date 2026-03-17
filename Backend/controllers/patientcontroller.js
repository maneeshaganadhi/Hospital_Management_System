let pm = require("../models/patientmodels")
let addpatient = async (req, res) => {
    try {
        let data = new pm({ ...req.body })
        await data.save()
        res.status(201).json({ "msg": "patient added successfully" })
    } catch (error) {
        console.log("Error adding patient:", error);
        res.status(500).json({ "msg": "error in adding patient" })
    }
}
let getpatients = async (req, res) => {
    try {
        let patients = await pm.find({})
        res.status(200).json(patients)
    } catch (error) {
        res.status(500).json({ "msg": "error in getting patients" })
    }
}
let getpatientsbyid = async (req, res) => {
    try {
        let patientid = req.params.id
        let patient = await pm.findById(patientid)
        if (!patient) {
            return res.status(404).json({ "msg": "patient not found" })
        }
        res.status(200).json(patient)
    } catch (error) {
        res.status(500).json({ "msg": "error in getting patient by id" })
    }
}
let updatepatientsbyid = async (req, res) => {
    try {
        let patientid = req.params.id
        let updatedpatient = await pm.findByIdAndUpdate(patientid, req.body, { new: true })
        if (!updatedpatient) {
            return res.status(404).json({ "msg": "patient not found" })
        }
        res.status(200).json(updatedpatient)
    } catch (error) {
        res.status(500).json({ "msg": "error in updating patient by id" })
    }
}
let deletepatientsbyid = async (req, res) => {
    try {
        let patientid = req.params.id
        let deletedpatient = await pm.findByIdAndDelete(patientid)
        if (!deletedpatient) {
            return res.status(404).json({ "msg": "patient not found" })
        }
        res.status(200).json({ "msg": "patient deleted successfully" })
    } catch (error) {
        res.status(500).json({ "msg": "error in deleting patient by id" })
    }
}

let searchpatients = async (req, res) => {
    try {
        let key = req.params.key
        let patients = await pm.find({
            "$or": [
                { "name": { $regex: key, $options: "i" } },
                { "phone": { $regex: key, $options: "i" } }
            ]
        })
        res.status(200).json(patients)
    } catch (error) {
        res.status(500).json({ "msg": "error in searching patients" })
    }
}

let getPatientByUserId = async (req, res) => {
    try {
        let userId = req.params.id;
        let email = req.query.email; 

        let patient = await pm.findOne({ userId: userId });

        if (!patient && email) {
     
            patient = await pm.findOne({ email: email });
        }

        if (!patient) {
            return res.status(404).json({ "msg": "patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error("Error getting patient:", error);
        res.status(500).json({ "msg": "error in getting patient by user id" });
    }
}

module.exports = { addpatient, getpatients, getpatientsbyid, getPatientByUserId, updatepatientsbyid, deletepatientsbyid, searchpatients }