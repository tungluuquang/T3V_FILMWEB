const router = require('express').Router()
const verify = require('../middleware/verifyToken')
const FavoriteController = require('../controller/favorite.controller')

// Get user's favorite list
router.get('/:id', FavoriteController.Get)
//TOGGLE USER FAVORITE
// body: {movieId: ...}
router.put('/:id', verify, FavoriteController.Toggle)

module.exports = router;