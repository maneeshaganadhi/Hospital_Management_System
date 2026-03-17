let bm = require("../models/billmodels")

let addbill = async (req, res) => {
    try {
        const { consultationFee, medicines, amount } = req.body;

        let calculatedDetails = 0;
        if (medicines && Array.isArray(medicines)) {
            medicines.forEach(med => {
                calculatedDetails += Number(med.total);
            });
        }
        if (consultationFee) {
            calculatedDetails += Number(consultationFee);
        }



        let data = new bm({ ...req.body })
        await data.save()
        res.status(201).json({ "msg": "Bill added successfully", "data": data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "msg": "Error adding bill" })
    }
}

let getbills = async (req, res) => {
    try {
        let data = await bm.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ "msg": "Error getting bills" })
    }
}

let updatebillbyid = async (req, res) => {
    try {
        console.log("Updating bill:", req.params.id, req.body);
        let updatedBill = await bm.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedBill) {
            console.log("Bill not found for ID:", req.params.id);
            return res.status(404).json({ "msg": "Bill not found" });
        }

        console.log("Bill updated:", updatedBill);
        res.status(200).json({ "msg": "Bill updated successfully", updatedBill })
    } catch (error) {
        console.error("Error updating bill:", error);
        res.status(500).json({ "msg": "Error updating bill" })
    }
}

module.exports = { addbill, getbills, updatebillbyid }
