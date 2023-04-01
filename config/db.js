const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose.set("strictQuery",false);

const connectDB = async() =>{
        try {
            const con = await mongoose.connect(url);
            console.log(`MongoDB connected: ${con.connection.host}`);
        } catch (error) {
            console.log(error);
        }
 }

module.exports = connectDB;