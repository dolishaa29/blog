const express = require("express");

require('dotenv').config();

let path = require("path");

let app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

let cors = require('cors');

let {blog}=require("./config/dbconnection");

let cookieParser=require('cookie-parser');

app.use(cookieParser());

app.use(express.static(path.join(__dirname,'/public')));

app.use(cors({
    origin:"http://localhost:5173",
    //origin:"https://orufy-assignment-puce.vercel.app",
    methods:["POST","GET","DELETE","PUT"],
    credentials:true,
}));

const PORT=process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
