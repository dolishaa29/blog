const Blog = require("../model/blog"); 
const cloudinary = require("../config/cloudinary");

exports.addBlog = async (req, res) => {
  try {
    const user = req.user._id;
    let Title = req.body.Title;
    let Description = req.body.Description;
    let Hashtags = req.body.Hashtags;
    let Category = req.body.Category;
    let Status = req.body.Status;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const blog = new Blog({
      Title: Title,
      Description: Description,
      Hashtags: Hashtags,
      Category: Category,
      Status: Status,
      Image: imageUrl, 
      User: user,
    });

    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Blog added successfully",
      blog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.viewUserBlogs = async (req, res) => {
  try {
    const user = req.user._id;
    const blogs = await Blog.find({ User: user });
    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    let Title = req.body.Title;
    let Description = req.body.Description;
    let Hashtags = req.body.Hashtags;
    let Category = req.body.Category;
    let Status = req.body.Status;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    let imageUrl = blog.Image; 
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        Title,
        Description,
        Hashtags,
        Category,
        Status,
        Image: imageUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      updatedBlog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found" 
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.singleUserBlog = async (req, res) => {
  try {
    const user = req.user._id;
    const blogId = req.params.id;
    
    const blog = await Blog.findOne({
      _id: blogId,
      User: user,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.exploreAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ Status: "Published" });
    return res.status(200).json({
      success: true,
      blogs: blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.exploreSingleBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findOne({ _id: blogId });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog: blog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};