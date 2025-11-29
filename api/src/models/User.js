const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    favorites: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Movie" }
    ],
    gender: {
        type: String,
    },
    favoriteGenre: {
        type: String,
    },
    age: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);