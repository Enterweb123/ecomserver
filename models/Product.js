const mongoose = require('mongoose');
const Product_Schema = new mongoose.Schema(
    {

    product_id:{
        type:String,
        required:true
    },
    product_image:{
        type:String,
        required:true
    },
    product_name:{
        type:String,
        required:true
     },
    product_cost:{
        type:Number,
        required:true
     },
    product_category:{
        type:String,
        required:true
     },
    product_details:{
        type:String,
        required:true
     },
    product_rating:{
        type:Number,
        required:true
     },
 },
  {timestamps:true}
);

const ProductModel =  mongoose.model("product",Product_Schema);
module.exports = ProductModel;