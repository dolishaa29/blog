let mongoose=require("mongoose");
require("dotenv").config();

const mongoURI=process.env.MONGO_URI;
mongoose.connect(mongoURI);
const blog=mongoose.connection;
blog.on("connected",()=>{
    console.log("MongoDB connected successfully");
});
blog.on("error",(err)=>{
    console.log("MongoDB connection error:",err);
});
blog.on("disconnected",()=>{
    console.log("MongoDB disconnected");
});

module.exports=blog;