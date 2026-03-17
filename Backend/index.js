
let express = require("express")
let mongoose = require("mongoose")
let cors = require("cors")
const bcrypt = require("bcrypt");
const axios = require("axios");
const User = require("./models/usermodels");

let userroutes = require("./routes/userroutes")

let app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect("mongodb://127.0.0.1:27017/hospital")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => console.log(err))

app.use("/api", userroutes)

if (require.main === module) {
    app.listen(5000, async () => {
        console.log("Server running on port 5000");
    })
}

module.exports = app;
