let am = require("../models/appointmentmodels")
let addappointment = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        // Check if the doctor is already booked at this date and time
        const existingAppointment = await am.findOne({
            doctorId,
            date,
            time,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ "msg": "Doctor is not available at this time" });
        }

        let data = new am({ ...req.body });
        await data.save();
        res.status(201).json({ "msg": "appointment added successfully" });
    } catch (error) {
        res.status(500).json({ "msg": "error in adding appointment" });
    }
}
let getappointments = async (req, res) => {
    try {
        let appointments = await am.find({})
        res.status(200).json(appointments)
    } catch (error) {
        res.status(500).json({ "msg": "error in getting appointments" })
    }
}
let getappointmentsbyid = async (req, res) => {
    try {
        let appointmentid = req.params.id
        let appointment = await am.findById(appointmentid)
        if (!appointment) {
            return res.status(404).json({ "msg": "appointment not found" })
        }
        res.status(200).json(appointment)
    } catch (error) {
        res.status(500).json({ "msg": "error in getting appointment by id" })
    }
}
let updateappointmentsbyid = async (req, res) => {
    try {

        let appointmentid = req.params.id
        let updatedappointment = await am.findByIdAndUpdate(appointmentid, req.body)
        if (!updatedappointment) {
            return res.status(404).json({ "msg": "appointment not found" })
        }
        res.status(200).json(updatedappointment)
    } catch (error) {
        res.status(500).json({ "msg": "error in updating appointment" })
    }
}
let deleteappointmentsbyid = async (req, res) => {
    try {
        let appointmentid = req.params.id
        let deletedappointment = await am.findByIdAndDelete(appointmentid)
        if (!deletedappointment) {
            return res.status(404).json({ "msg": "appointment not found" })
        }
        res.status(200).json({ "msg": "appointment deleted successfully" })
    } catch (error) {
        res.status(500).json({ "msg": "error in deleting appointment" })
    }
}
let updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ["pending", "accepted", "rejected", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const updatedAppointment = await am.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.status(200).json({ msg: "Status updated successfully", appointment: updatedAppointment });
  } catch (error) {
    console.log("Error in updateAppointmentStatus:", error);
    res.status(500).json({ msg: "Error updating appointment status" });
  }
};
module.exports = { addappointment, getappointments, getappointmentsbyid, updateappointmentsbyid, deleteappointmentsbyid, updateAppointmentStatus}