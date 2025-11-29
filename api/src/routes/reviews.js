const router = require('express').Router()
const verify = require("../middleware/verifyToken");
const ReviewsController = require('../controller/reviews.controller.js')

//ADD REVIEWS TO MOVIE
// body: {comment: ..., rating: ..., user: ...}
router.put("/:id", verify, ReviewsController.Create)

module.exports = router;