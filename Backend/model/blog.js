let mongo=require("mongoose");
let blogmodel=mongo.Schema({
    Title:{type:String},
    Description:{type:String},
    Image:{type:String},
    Hashtags:{type:String},
    Date:{type:Date,default:Date.now},
    Category:{type:String},
    Status:{type:String,default:"Draft",enum:["Draft","Published"]},
    User:{type:String}
})

module.exports=mongo.model('blog',blogmodel);