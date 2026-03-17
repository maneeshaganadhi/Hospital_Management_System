let mongoose = require("mongoose")
let prm = require("../models/prescriptionmodels")
let pm = require("../models/patientmodels")

// ADD PRESCRIPTION
let addprescription = async (req, res) => {
  try {

    let data = new prm({
      patientId: req.body.patientId,
      doctorId: req.body.doctorId,
      doctorName: req.body.doctorName,
      diagnosis: req.body.diagnosis,
      medicine: req.body.medicine,
      notes: req.body.notes
    })

    await data.save()

    res.status(201).json({
      msg: "Prescription added successfully"
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Error adding prescription"
    })
  }
}

let getprescriptionsbypatientid = async (req, res) => {
  try {
    let userId = req.params.id;

    let patient = await pm.findOne({ userId: userId });

    let prescriptions = [];

    if (patient) {
      prescriptions = await prm.find({
        $or: [
          { patientId: patient._id.toString() }, // matches _id
          { patientId: userId }                  // matches userId
        ]
      });
    } else {
      // fallback if patient document is missing
      prescriptions = await prm.find({ patientId: userId });
    }

    res.status(200).json(prescriptions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching prescriptions" });
  }
};


// GET PRESCRIPTIONS BY DOCTOR
let getprescriptionsbydoctorid = async (req, res) => {
  try {

    let doctorId = req.params.id
    console.log("DoctorId received:", doctorId)

    let prescriptions = await prm.find({
      doctorId: doctorId
    })

    res.status(200).json(prescriptions)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Error fetching doctor prescriptions"
    })
  }
}



module.exports = {
  addprescription,
  getprescriptionsbypatientid,
  getprescriptionsbydoctorid
}