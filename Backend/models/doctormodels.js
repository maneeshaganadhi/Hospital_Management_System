let mongoose = require("mongoose")
let doctorsch = new mongoose.Schema({
    "userId": { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    "name": String,
    "email": String,
    "phone": String,
    "specialization": String,
    "experience": Number,
    "availabledays": Number,
    "consultationfee": Number,
    "image": { type: String, default: "https://via.placeholder.com/150" }
})
let dm = mongoose.model("doctor", doctorsch)
module.exports = dm