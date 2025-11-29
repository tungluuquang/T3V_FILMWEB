const User = require("../models/User")
let CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const axios = require('axios')

const Register = async (req, res) => {
    {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
    }
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    });
    try {
        const user = await newUser.save();
        try {
            await axios.post("http://localhost:8000/recommender/populate_record")
        }
        catch (err) {
            console.log("Cannot Populate Recommender service data")
        }
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const Login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("Wrong password or username!");
        }
        let bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(404).json("Wrong password or username!");
        }

        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: '5d' });

        const { password, ...info } = user._doc;

        res.status(200).json({ ...info, accessToken });
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const AuthController = {
    Register,
    Login
}

module.exports = AuthController