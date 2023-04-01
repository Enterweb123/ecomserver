const jwt = require("jsonwebtoken");
const {UserModel} = require("../models");

function verifyToken(req,res,next) {
    const token = req.headers["authorization"];

    if(token) {
        jwt.verify( token, process.env.SECRET_KEY, async(err,decodedToken)=>{

        if(err) {
            return res.json({message:"Access denied : Token decoded failed"});

        } else {
             // get data from db
             const data = await UserModel.findById(decodedToken.userId).select("-__v -password");

            if(data) {
              req.user = data;
              next();

            } else {
              return res.json( {message:"Access denied : Token data geting failed"} );
            }
        }

      })
    } 
    else {
      return res.json({ message: "Access denied : token missing" });
    }
 }

 module.exports = verifyToken;