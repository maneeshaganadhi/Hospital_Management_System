let jwt = require("jsonwebtoken")
let bcrypt = require("bcrypt")
const um = require("../models/usermodels")
const nodemailer = require("nodemailer")

let pm = require("../models/patientmodels");
let rm = require("../models/receptionistmodels");

let adduser = async (req, res) => {
    try {

        let { name, email, phone, password, role, age, gender, address, bloodgroup } = req.body

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ "msg": "Please provide all required fields" })
        }

        let existinguser = await um.findOne({ email })

        if (existinguser) {
            return res.status(400).json({ "msg": "Email already exists" })
        }

        let hashedpassword = await bcrypt.hash(password, 10)

        let data = new um({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedpassword,
            role
        })

        await data.save()


        if (role === 'patient') {
            let patient = new pm({
                userId: data._id,
                name,
                email,
                phone,
                age,
                gender,
                address,
                bloodgroup
            })
            await patient.save()
        }


        if (role === 'receptionist') {
            let receptionist = new rm({
                userId: data._id,
                name,
                email,
                phone,
                address
            })
            await receptionist.save()
        }

        res.status(201).json({ "msg": "User added successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ "msg": "Error in adding user" })
    }
}


let login = async (req, res) => {
    try {

        let { email, password } = req.body

        
        let existinguser = await um.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } })

        if (!existinguser) {
            console.log("Login failed: User not found for email:", email);
            return res.status(404).json({ "msg": "User not found" })
        }

        let isMatch = await bcrypt.compare(password, existinguser.password)

        if (!isMatch) {
            return res.status(400).json({ "msg": "Invalid password" })
        }

        let token = jwt.sign(
            { id: existinguser._id, role: existinguser.role },
            "secretkey",
            { expiresIn: "1d" }
        )

        res.status(200).json({
            msg: "Login successful",
            token,
            user: {
                id: existinguser._id,
                name: existinguser.name,
                email: existinguser.email,
                role: existinguser.role
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ "msg": "Error in login" })
    }
}


let profile = async (req, res) => {
    try {

        let userid = req.user.id

        let user = await um.findById(userid).select("-password")

        if (!user) {
            return res.status(404).json({ "msg": "User not found" })
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ "msg": "Error in getting profile" })
    }
}


let forgotpassword = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await um.findOne({ email });
        if (!user) {
            return res.status(404).json({ "msg": "User not found" });
        }

    
        let otp = Math.floor(100000 + Math.random() * 900000).toString();
        let otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

       
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

    
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "keerthianchipaku65@gmail.com",
                pass: "bxfofwbyoglsgbyp",
            },
        });

        const mailOptions = {
            from: '"Hospital Admin" <keerthianchipaku65@gmail.com>',
            to: email,
            subject: "Hospital Management System - Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[OTP] Email sent to ${email}`);
        } catch (emailError) {
            console.error("Error sending email:", emailError);

            console.log(`[OTP] Fallback: OTP for ${email} is ${otp}`);
        }

        res.status(200).json({ "msg": "OTP sent to email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ "msg": "Error sending OTP" });
    }
}


let resetpassword = async (req, res) => {
    try {
        let { email, otp, password } = req.body
        console.log("Reset Password Request for:", email);

        let user = await um.findOne({ email })
        if (!user) {
            return res.status(404).json({ "msg": "User with this email not found" })
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ "msg": "Invalid OTP" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ "msg": "OTP has expired" });
        }

        let hashedpassword = await bcrypt.hash(password, 10)

        user.password = hashedpassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ "msg": "Password reset successful" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ "msg": "Error in resetting password" })
    }
}


let getReceptionists = async (req, res) => {
    try {
        let users = await um.find({ role: "receptionist" }).select("-password");
        let receptionists = [];

        for (const user of users) {
            const profile = await rm.findOne({ userId: user._id });
            if (profile) {
                receptionists.push({
                    ...user.toObject(),
                    address: profile.address, 
                    phone: profile.phone || user.phone, 
                    name: profile.name || user.name
                });
            } else {
                receptionists.push(user.toObject());
            }
        }
        res.status(200).json(receptionists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "msg": "Error in getting receptionists" });
    }
}


let updateUserById = async (req, res) => {
    try {
        let userid = req.params.id;
        let { name, email, phone, role, address, password } = req.body;

        let updateData = { name, email, phone, role, address };

       
        if (password && password.trim() !== "") {
            const bcrypt = require("bcrypt");
            updateData.password = await bcrypt.hash(password, 10);
        }

        let user = await um.findByIdAndUpdate(userid, updateData, { new: true }).select("-password");

  
        if (role === 'receptionist') {
            const Receptionist = require('../models/receptionistmodels');
            await Receptionist.findOneAndUpdate(
                { userId: userid },
                { userId: userid, name, email, phone, address },
                { new: true, upsert: true }
            );
        }

        if (!user) {
            return res.status(404).json({ "msg": "User not found" });
        }

        res.status(200).json({ "msg": "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "msg": "Error in updating user" });
    }
}


let deleteUserById = async (req, res) => {
    try {
        let userid = req.params.id;
        let user = await um.findByIdAndDelete(userid);

        if (!user) {
            return res.status(404).json({ "msg": "User not found" });
        }

        res.status(200).json({ "msg": "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "msg": "Error in deleting user" });
    }
}

module.exports = { adduser, login, profile, resetpassword, forgotpassword, getReceptionists, updateUserById, deleteUserById }
