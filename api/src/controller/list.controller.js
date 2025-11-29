const List = require("../models/List.js");

const Create = async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body);
        try {
            const savedList = await newList.save();
            res.status(200).json(savedList);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed to create list!");
    }
}

const Delete = async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete list successfully");
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed to delete list!");
    }
}

const Get = async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;

    let list = [];

    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } }
                ]);
            }
            else {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery } }
                ]);
            }
        }
        else {
            list = await List.aggregate([
                { $sample: { size: 10 } }
            ]);
        }
        res.status(200).json(list);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const ListController = {
    Create,
    Delete,
    Get
}

module.exports = ListController