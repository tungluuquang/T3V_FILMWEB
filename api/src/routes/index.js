const express = require('express')
const router = express.Router()
const authRoute = require('./auth')
const moviesRoute = require('./movies')
const listRoute = require('./lists')
const usersRoute = require('./users')

router.use("/auth", authRoute)
router.use("/movies", moviesRoute)
router.use("/lists", listRoute)
router.use("/users", usersRoute)

module.exports = router