let express = require("express")
let rt = new express.Router()

let { login, adduser, profile, resetpassword, forgotpassword, updateUserById } = require("../controllers/usercontrollers")
let { adddoctor, getdoctors, getdoctorsbyid, updatedoctorsbyid, deletedoctorsbyid, searchdoctors } = require("../controllers/doctorcontroller")
let { addpatient, getpatients, getpatientsbyid, getPatientByUserId, updatepatientsbyid, deletepatientsbyid, searchpatients } = require("../controllers/patientcontroller")
let { addappointment, getappointments, getappointmentsbyid, updateappointmentsbyid, deleteappointmentsbyid,updateAppointmentStatus } = require("../controllers/appointmentcontroller")
let { addprescription, getprescriptionsbypatientid, getprescriptionsbydoctorid } = require("../controllers/prescriptioncontroller")
let { addbill, getbills, updatebillbyid } = require("../controllers/billcontroller")
let { addfeedback, getfeedbacks, deletefeedback } = require("../controllers/feedbackcontroller")
let { addreceptionist, getreceptionists, getReceptionistByUserId, updatereceptionistbyid, deletereceptionistbyid } = require("../controllers/receptionistcontroller")

let verifyToken = require("../middleware/auth")



// USER ROUTES
rt.post("/register", adduser)
rt.post("/forgotpassword", forgotpassword)
rt.put("/resetpassword", resetpassword)
rt.post("/login", login)
rt.get("/profile", verifyToken, profile)
rt.put("/updateuserbyid/:id", updateUserById)

// RECEPTIONIST ROUTES
rt.post("/addreceptionist", addreceptionist)
rt.get("/getreceptionists", getreceptionists)
rt.get("/getreceptionistbyuserid/:id", getReceptionistByUserId)
rt.put("/updatereceptionistbyid/:id", updatereceptionistbyid)
rt.delete("/deletereceptionistbyid/:id", deletereceptionistbyid)

// DOCTOR ROUTES
rt.post("/adddoctor", adddoctor)
rt.get("/getdoctors", getdoctors)
rt.get("/getdoctorbyid/:id", getdoctorsbyid)
rt.put("/updatedoctorbyid/:id", updatedoctorsbyid)
rt.delete("/deletedoctorbyid/:id", deletedoctorsbyid)
rt.get("/searchdoctors/:key", searchdoctors)

// PATIENT ROUTES
rt.post("/addpatient", addpatient)
rt.get("/getpatients", getpatients)
rt.get("/getpatientbyid/:id", getpatientsbyid)
rt.get("/getpatientbyuserid/:id", getPatientByUserId)
rt.put("/updatepatientbyid/:id", updatepatientsbyid)
rt.delete("/deletepatientbyid/:id", deletepatientsbyid)
rt.get("/searchpatients/:key", searchpatients)

// APPOINTMENT ROUTES
rt.post("/addappointment", addappointment)
rt.get("/getappointments", getappointments)
rt.get("/getappointmentbyid/:id", getappointmentsbyid)
rt.put("/updateappointmentbyid/:id", updateappointmentsbyid)
rt.delete("/deleteappointmentbyid/:id", deleteappointmentsbyid)
// Update appointment status
rt.put("/updateappointmentstatus/:id", updateAppointmentStatus)

// PRESCRIPTION ROUTES
rt.post("/addprescription", addprescription)
rt.get("/getprescriptionsbypatientid/:id", getprescriptionsbypatientid)
rt.get("/getprescriptionsbydoctorid/:id", getprescriptionsbydoctorid)

// BILL ROUTES
// BILL ROUTES
rt.post("/addbill", addbill)
rt.get("/getbills", getbills)
rt.put("/updatebillbyid/:id", updatebillbyid)

// FEEDBACK ROUTES
rt.post("/addfeedback", addfeedback)
rt.get("/getfeedbacks", getfeedbacks)
rt.delete("/deletefeedbackbyid/:id", deletefeedback)

module.exports = rt
