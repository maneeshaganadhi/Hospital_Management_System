let mongoose = require("mongoose")

let prescriptionsch = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patient" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" },
  doctorName: String,
  diagnosis: String,
  medicine: String,
  notes: String,
  date: { type: Date, default: Date.now }
})

let prm = mongoose.model("prescription", prescriptionsch)
module.exports = prm