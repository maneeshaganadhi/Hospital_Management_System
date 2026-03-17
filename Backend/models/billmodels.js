let mongoose = require("mongoose")

let billsch = mongoose.Schema({
    "patientId": String,
    "patientName": String,
    "doctorId": String,
    "doctorName": String,
    "appointmentId": String,
    "consultationFee": Number,
    "medicines": [{
        "name": String,
        "quantity": Number,
        "price": Number,
        "total": Number
    }],
    "amount": { type: Number, required: true },
    "status": { type: String, default: "Pending" }, // Pending, Paid
    "date": { type: Date, default: Date.now }
})

let bm = mongoose.model("bill", billsch)
module.exports = bm
