let mongoose = require("mongoose")

let appointmentsch = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patient" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" },
  doctorName: String,
  patientName: String,
  date: String,
  time: String,
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "confirmed", "completed", "cancelled"]
  }
})

appointmentsch.index(
  { doctorId: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }
)

let am = mongoose.model("appointment", appointmentsch)
module.exports = am