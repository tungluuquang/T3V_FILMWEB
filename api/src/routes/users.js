const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const favoriteRoute = require('./favorite');
const UsersController = require('../controller/users.controller')

router.use('/favorites', favoriteRoute);
//UPDATE
// When update user, repopulate recommender service data
router.put("/:id", verify, UsersController.Update)
//DELETE
router.delete("/:id", verify, UsersController.Delete)
//GET 1 USER
router.get("/find/:id", verify, UsersController.GetById)
//GET ALL USER
router.get("/", verify, UsersController.GetAll)
//GET USER STATS
router.get("/stats", verify, UsersController.GetStats)

module.exports = router;