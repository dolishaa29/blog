let blogmodel=require("../model/blog");
const express = require("express");
let router = express.Router();
let auth=require("../middleware/user");
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");


router.post("/addblog");


module.exports=router;