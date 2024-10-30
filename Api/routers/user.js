// /user/...

const express = require("express")
const router = express.Router()
const {authMiddleware} = require("../middleware/authMiddleware")
const {getAllUser,pushUserImage, getAllMessage, getProfile, updateProfile, imageUpdate} = require("../controller/userController")


router.route("/deneme").get(authMiddleware,async (req,res) => {
    
    console.log(req.headers);
    
    res.status(201).json({message:"succes"})
})

router.route("/getAllUser").get(authMiddleware,getAllUser)
router.route("/profile").get(authMiddleware,getProfile)
router.route("/updateProfile").post(authMiddleware,updateProfile)
router.route("/updateProfileImage").post(authMiddleware,imageUpdate)
router.route("/getAllMessage").post(authMiddleware,getAllMessage)

router.route("/getImage/:name").get(pushUserImage)



module.exports = router