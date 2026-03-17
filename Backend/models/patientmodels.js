let mongoose = require("mongoose")
let patientsch = new mongoose.Schema({
    "userId": { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    "name": String,
    "email": String,
    "age": Number,
    "gender": String,
    "phone": String,
    "address": String,
    "bloodgroup": String
})
let pm = mongoose.model("patient", patientsch)
module.exports = pm