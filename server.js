 const express = require("express");
 const app = express();
 require("dotenv").config();
 const connectDB = require("./config/db");
 const Apirouter = require('./routes/index.js');
 const cors = require("cors");
 const bodyParser = require("body-parser");
 
 connectDB();
 app.use(cors());
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());

 app.get("/", (req,res)=>{
   res.json("Api is working");
 });

 app.use("/api", Apirouter);
 
 app.listen(4000,()=>{
    console.log("server is live on port 4000")
 });