const express = require("express")
const router = express.Router()
const {loginController} = require("../controller/authController")

// /login/...
router.route("/").post(loginController)

module.exports = router