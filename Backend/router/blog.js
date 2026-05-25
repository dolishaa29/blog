const express = require("express");
const router = express.Router();
const auth = require("../middleware/user");
const upload = require("../middleware/multer");

const { 
  addBlog, 
  viewUserBlogs, 
  editBlog, 
  deleteBlog, 
  singleUserBlog, 
  exploreAllBlogs, 
  exploreSingleBlog 
} = require("../service/blog"); 


router.post("/addBlog", auth, upload.single("image"), addBlog);
router.get("/viewUserBlogs", auth, viewUserBlogs);
router.put("/editBlog/:id", auth, upload.single("image"), editBlog);
router.delete("/deleteBlog/:id", auth, deleteBlog);
router.get("/singleUserBlog/:id", auth, singleUserBlog);
router.get("/exploreAllBlogs", exploreAllBlogs);
router.get("/exploreSingleBlog/:id", exploreSingleBlog);

module.exports = router;