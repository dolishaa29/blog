let usermodel=require("../model/user");
const express = require("express");
let router = express.Router();
const { dashboard, profile, updateProfile,register,login } = require("../service/user");
let auth=require("../middleware/user");
const upload = require("../middleware/multer"); 
const cloudinary = require("../config/cloudinary");

router.post("/register", upload.single("image"), register);
router.post("/login",login);
router.get('/dashboard',auth,dashboard);
router.get('/profile',auth,profile);
router.post('/updateprofile',auth,upload.single("image"),updateProfile);
module.exports=router;