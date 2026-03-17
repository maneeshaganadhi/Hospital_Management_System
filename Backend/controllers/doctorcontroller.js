
let dm = require("../models/doctormodels")
let bcrypt = require("bcrypt")
let um = require("../models/usermodels")

let adddoctor = async (req, res) => {
    try {
        let { name, email, phone, password, specialization, role, image, consultationfee, experience } = req.body


        let existinguser = await um.findOne({ email })
        if (existinguser) {
            return res.status(400).json({ "msg": "Email already exists" })
        }

        let hashedpassword = await bcrypt.hash(password, 10)
        let user = new um({
            name,
            email,
            phone,
            password: hashedpassword,
            role: "doctor"
        })
        await user.save()

        let doctor = new dm({
            userId: user._id,
            name,
            email,
            phone,
            specialization,
            role,
            consultationfee,
            experience,
            image: req.body.image || "https://randomuser.me/api/portraits/men/1.jpg"
        })
        await doctor.save()

        res.status(201).json({ "msg": "Doctor added successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ "msg": "error in adding doctor" })
    }
}
let getdoctors = async (req, res) => {
    try {
        let doctors = await dm.find({})
        res.status(200).json(doctors)
    } catch (error) {
        res.status(500).json({ "msg": "error in getting doctors" })
    }
}
let getdoctorsbyid = async (req, res) => {
    try {
        let doctorid = req.params.id
        let doctor = await dm.findById(doctorid)

        res.status(200).json(doctor)
    } catch (error) {
        res.status(500).json({ "msg": "error in getting doctor by id" })
    }
}
let updatedoctorsbyid = async (req, res) => {
    try {
        let doctorid = req.params.id

        let updateddoctor = await dm.findByIdAndUpdate(
            doctorid,
            { $set: req.body },
            { new: true }   // returns updated document
        )

        if (!updateddoctor) {
            return res.status(404).json({ msg: "Doctor not found" })
        }

        res.status(200).json(updateddoctor)

    } catch (error) {
        res.status(500).json({ "msg": "error in updating doctor by id" })
    }
}
let deletedoctorsbyid = async (req, res) => {
    try {
        let doctorid = req.params.id
        let deleteddoctor = await dm.findByIdAndDelete(doctorid)

        res.status(200).json({ "msg": "Doctor deleted successfully" })
    } catch (error) {
        res.status(500).json({ "msg": "error in deleting doctor by id" })
    }
}

let searchdoctors = async (req, res) => {
    try {
        let key = req.params.key
        let doctors = await dm.find({
            "$or": [
                { "name": { $regex: key, $options: "i" } },
                { "specialization": { $regex: key, $options: "i" } }
            ]
        })
        res.status(200).json(doctors)
    } catch (error) {
        res.status(500).json({ "msg": "error in searching doctors" })
    }
}

module.exports = { adddoctor, getdoctors, getdoctorsbyid, updatedoctorsbyid, deletedoctorsbyid, searchdoctors }