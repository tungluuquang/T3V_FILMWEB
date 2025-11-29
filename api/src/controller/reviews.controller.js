const axios = require('axios')
const Movie = require('../models/Movie.js')

const Create = async (req, res) => {
    try {
        const review = req.body;
        const movieId = req.params.id;
        await Movie.findByIdAndUpdate(movieId, { $pull: { reviews: { user: review.user } } })
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, { $push: { reviews: review } }, { new: true, runValidators: true })
        try {
            await axios.post("http://localhost:8000/recommender/populate_record")
        }
        catch (err) {
            console.log("Cannot Populate Recommender service data")
        }
        res.status(200).json(updatedMovie);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const ReviewsController = {
    Create
}

module.exports = ReviewsController