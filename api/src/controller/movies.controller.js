const Movie = require("../models/Movie.js");

const Create = async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);
        try {
            const savedMovie = await newMovie.save();
            res.status(200).json(savedMovie);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed to create movie!");
    }
}

const Update = async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).json(updatedMovie);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed to update movie!");
    }
}

const Delete = async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete movie successfully");
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed to delete movie!");
    }
}

const GetRandom = async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if (type === 'series') {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ])
        }
        else if (type === 'movie') {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } }
            ])
        }
        else {
            movie = await Movie.aggregate([
                { $sample: { size: 1 } }
            ])
        }
        res.status(200).json(movie);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const GetTop = async (req, res) => {
    try {
        const topMovies = await Movie.aggregate([
            {
                $addFields: {
                    avgRating: {
                        $cond: [
                            { $gt: [{ $size: '$reviews' }, 0] },
                            { $avg: '$reviews.rating' },
                            0
                        ]
                    }
                }
            },
            { $sort: { avgRating: -1 } },
            { $limit: 10 }
        ])
        res.status(200).json(topMovies)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

const GetStats = async (req, res) => {
    try {
        const data = await Movie.aggregate([
            {
                $group: {
                    _id: '$genre',
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const GetById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate("reviews.user", "username profilePic");
        res.status(200).json(movie);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const GetAll = async (req, res) => {
    const filter = {}

    if (req.query.genre) {
        filter.genre = req.query.genre
    }

    if (req.query.title) {
        filter.title = { $regex: req.query.title, $options: "i" }
    }

    if (req.query.year) {
        filter.year = req.query.year
    }

    try {
        let query = Movie.find(filter)
            .sort({ createdAt: -1 })
            .populate("reviews.user", "username profilePic")

        if (req.query.limit) {
            const limit = parseInt(req.query.limit)
            if (!isNaN(limit)) {
                query = query.limit(limit)
            }
        }

        const movies = await query
        res.status(200).json(movies)
    } catch (err) {
        res.status(500).json(err)
    }
}

const MoviesController = {
    Create,
    Update,
    Delete,
    GetRandom,
    GetTop,
    GetStats,
    GetById,
    GetAll
}

module.exports = MoviesController