const mongoose = require('mongoose');

const UseSchema = new mongoose.Schema(
 { 
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  verified:{
    type:Boolean,
    default:false,
  },
  roll:{
    type:String,
    default:"subscriber",
  }
 },

 { timestamps:true }
);

const UserModel = mongoose.model("users",UseSchema);

module.exports = UserModel;