let usermodel=require("../model/user");
const express = require("express");
let router = express.Router();
const { register, login } = require("../controller/user");
const { dashboard, profile, updateProfile } = require("../service/user");
let auth=require("../middleware/user");

router.post("/register",register);
router.post("/login",login);
router.get('/dashboard',auth,dashboard);
router.get('/profile',auth,profile);
router.post('/updateprofile',auth,updateProfile);
module.exports=router;