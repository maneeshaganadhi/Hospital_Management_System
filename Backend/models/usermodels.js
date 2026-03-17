const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient", "receptionist"]
  },
  phone: {
    type: String
  },
  otp: String,
  otpExpires: Date
});

module.exports = mongoose.model("User", userSchema);
