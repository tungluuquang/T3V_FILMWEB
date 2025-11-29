const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const ListController = require("../controller/list.controller")

//CREATE
router.post("/", verify, ListController.Create)
//DELETE
router.delete("/:id", verify, ListController.Delete)
//GET
router.get("/", verify, ListController.Get)

module.exports = router;