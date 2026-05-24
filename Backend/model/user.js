let mongo=require("mongoose");
let usermodel=mongo.Schema({
   name:{type:String},
   email:{type:String},
   password:{type:String, default:null},
   contact:{type:Number,default:null},
   address:{type:String,default:null},
   profile:{type:String,default:null},
});
module.exports=mongo.model('user',usermodel);