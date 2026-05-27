let rec=require("../model/user");
let jwt=require("jsonwebtoken");
let bct=require("bcryptjs");
let cloudinary=require("../config/cloudinary");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register=async(req,res)=>{
    try{
        console.log("req.body",req.body);
        let name=req.body.name;
        let email=req.body.email;
        let password=req.body.password;
        let contact=req.body.contact;
        let address=req.body.address;
        let imageUrl = "";
        console.log("req.file",req.file);
        if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        console.log("imageUrl",imageUrl);
       }
        let user=await rec.findOne({email:email});
        console.log(" exist user",user);
        if(user)
        {
            return res.status(400).json({msg: "User already exists"});
        }
        else{
            let hash=await bct.hash(password,10);
            let user=new rec({name:name,email:email,password:hash,contact:contact,address:address,profile:imageUrl});
            console.log("new user",user);
            await user.save();
            res.status(201).json({msg: "User registered successfully",data:user});
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            error:"Internal Server Error",
            message:err.message,
        });
    }
}



exports.login=async(req,res)=>
{
    try{
        let email=req.body.email;
        let password=req.body.password;
        let user=await rec.findOne({email:email});
        if(!user)
        {
            return res.status(400).json({msg: "user does not exist"});
        }
        let pass=await bct.compare(password,user.password);
        if(pass)
        {
           let token=jwt.sign({token:user.email},process.env.JWT_SECRET,{expiresIn:"1h"});
           res.cookie("token",token,{
            httpOnly:true,
            secure: true,
            sameSite: "none",
        });
        console.log("token",token);
        res.status(200).json({msg: "Login successful",token:token});
        }
        else
        {
            return res.status(400).json({msg: "Invalid password"});
        }
    }
    catch(err)

    {
        console.log(err);
        res.status(500).json({
            error:"Internal Server Error",
            message:err.message,
        });
    }

}



exports.dashboard=async(req,res)=>
{
    const user =  req.user;
    return res.status(200).json({success: true,msg: "user dashboard fetched successfully",dashboard:
    {
     email:user.email,name:user.name,contact:user.contact,address:user.address
    },
    });
}



exports.profile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

    if (!credential) {
      return res.status(400).json({ error: "No credential provided" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Payload:", payload);
    const { email, name, picture } = payload;
    let user = await rec.findOne({ email });

    if (!user) {
      user = new rec({ name, email, image: picture });
      await user.save();
    }

    const token = jwt.sign({ token: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ success: true, token, msg: "Google login successful" });

  } catch (err) {
    console.log("Google login error:", err);
    return res.status(500).json({ error: "Google login failed", message: err.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, contact, address } = req.body;
    let imageUrl="";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const updated = await rec.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        contact,
        address,
        image: imageUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updated,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

