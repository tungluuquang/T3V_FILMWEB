const router = require("express").Router();
const verify = require("../middleware/verifyToken.js")
const MoviesController = require("../controller/movies.controller.js")
const reviewRoute = require("./reviews.js")

router.use('/reviews', reviewRoute)
//CREATE
router.post("/", verify, MoviesController.Create)
//UPDATE
router.put("/:id", verify, MoviesController.Update)
//DELETE
router.delete("/:id", verify, MoviesController.Delete)
//GET RANDOM (1 Movie)
router.get("/random", verify, MoviesController.GetRandom)
// GET TOP MOVIES
router.get("/top", MoviesController.GetTop)
//GET MOVIES STATS
router.get("/stats", verify, MoviesController.GetStats)
//GET 1 movie by ID
router.get("/:id", verify, MoviesController.GetById)
//GET ALL 
// To get all movies: call /api/movies/
// To get movies filtered by genre: call /api/movies?genre=YOUR_MOVIE_GENRE
// To get movies filtered by title: call /api/movies?title=YOUR_MOVIE_NAME
// To get movies filtered by year: call /api/movies?year=YOUR_MOVIE_YEAR
// To get movies limited by a number: call /api/movies?limit=YOUR_LIMIT
router.get("/", verify, MoviesController.GetAll)


module.exports = router;