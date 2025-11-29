const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const router = require("./src/routes/index.js")

dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ "Message": "Backend is running" })
})

app.use("/api", router)

if (require.main === module) {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Connect to database successfully");
            app.listen(8800, () => {
                console.log("Listening on port 8800");
            })
        })
        .catch(() => {
            console.log("Failed to connect to database");
        })
}

module.exports = app;