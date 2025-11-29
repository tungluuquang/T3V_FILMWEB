const router = require("express").Router();
const AuthController = require("../controller/auth.controller.js")

//REGISTER
// When add user, repopulate recommender service data
router.post("/register", AuthController.Register)
//LOGIN
router.post("/login", AuthController.Login)

module.exports = router;