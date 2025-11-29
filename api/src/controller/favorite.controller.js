const User = require('../models/User.js')

const Get = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id).populate("favorites")

        if (user) {
            res.status(200).json(user?.favorites)
        }
        else {
            res.status(404).json({ "Error": "User not found" })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}

const Toggle = async (req, res) => {
    try {
        const id = req.params.id
        const movieId = req.body.movieId
        const user = await User.findById(id)

        let updatedUser
        if (user.favorites.includes(movieId)) {
            updatedUser = await User.findByIdAndUpdate(
                id,
                { $pull: { favorites: movieId } },
                { new: true }
            )
        }
        else {
            updatedUser = await User.findByIdAndUpdate(
                id,
                { $addToSet: { favorites: movieId } },
                { new: true }
            )
        }
        res.status(200).json(updatedUser)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

const FavoriteController = {
    Get,
    Toggle
}

module.exports = FavoriteController