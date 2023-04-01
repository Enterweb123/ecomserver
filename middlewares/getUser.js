const jwt = require("jsonwebtoken");

function getUser(req,res,next) {
    const token = req.headers["authorization"];

    if(token) {

     jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken)=>{
        if(err) {
          return res.json( {message:"Token Decoding Failed"} )
        } else {
          req.userId = decodedToken.userId;
          next();
        }
     });

    }
    else {
        return res.json({message:"Token Missing"})
    }
}

module.exports = getUser;