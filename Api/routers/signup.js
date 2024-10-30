const express = require("express")
const router = express.Router()
const {signupController} = require("../controller/authController")
// /signup/...
router.route("/").post(signupController)

module.exports = router

