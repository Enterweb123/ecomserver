const router = require("express").Router();

//1) encript decript passwords hashing
const bcrypt = require("bcrypt");
//2) create tokens - big lenth of string
const jwt    = require("jsonwebtoken");
//3) create mailings
const nodemailer = require("nodemailer");
//4) get user model
const {UserModel} = require('../models/index');
//5) Middle ware - vefify token
const verifyToken = require('../middlewares/verifyToken');


  router.get("/", (req,res)=>{
          res.json({msg: "from user router "});
  });

  // 1) Sign up ===============================
  router.post("/signup", async(req,res)=> {
   const salt = await bcrypt.genSalt(10);
   const passwordHash = await bcrypt.hash(req.body.password, salt);

   //--- save data to db ---
   const userSaved = await UserModel.create({
        name:req.body.name,
        email:req.body.email,
        password: passwordHash
   });

   // --- send verification mail ---
   // 10h, 20d, 120 = 120ms, 120s
   // 1) token create for register user
   const token  = jwt.sign( {id:userSaved._id}, process.env.SECRET_KEY,{expiresIn:"1d"});

   const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "webdesignintamil@gmail.com",
            pass: process.env.EMAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: "EnterWebSolution <webdesignintamil@gmail.com>",
        to: req.body.email,
        subject: "verify your Email - EnterwebSolutions Team",
        html: `
        <div>
             <strong style="">
             Hai!.. ${req.body.name} , we welcome to our plateform
             <a style="background-color:blue; color:white; padding:5px, border-radius:5px" 
             href="http://localhost:3000/user/verify/${token}">
             Verify Email 
             </a>
             </strong>
        </div>

        <div>
             <p> Thanks and Regards </p>
             <p> Form EnterWebSolution Team </p>
        </div> `,
    });

    if (info) {
        console.log(info);
    } 
    else {
        console.log("mail not send");
    }

    res.json({"msg":"account created , verification mail send successfully please verify your email"});
});

// 2) Login ================================
router.post("/login", async(req,res)=>{
   let { email, password } = req.body;
   
   const result = await UserModel.findOne({ email:email });

   if(result) {

    if(result.verified) {

        bcrypt.compare(password, result.password).then( (passwordResult)=>{

        if(passwordResult) {

          jwt.sign( {userId : result._id}, process.env.SECRET_KEY, (err,token)=> {

              if(err) {
                console.log(err);
              } 
              else {
               return res.json({
                success:true,
                msg:"Login Successfull",
                token:token
                 })
              }
            })

        } else {
          return res.json({success:false, msg:"Incorrect Password 🧐"});
        }
     })
    }
    else{
      return res.json({success:false, msg:"Please verify your email🙄"});
    }
   } 
   else {
    return res.json({ success: false, msg: "User Email Not Found 😐" });
   }
});

//3  Verify regiter user Token =====================
router.get("/verify/:token",(req,res)=> {

     // 1) decript token for register user
   jwt.verify( req.params.token, process.env.SECRET_KEY,

      async(err,decoded)=> {

       if(err) {
        return res.json({msg:"Link expired"});
       }
       const id = decoded.id;
       await UserModel.findByIdAndUpdate(id, {verified:true });
       return res.json({ msg:"Account verified successfully", success:true });
       
     }
   );
}); 

//4  Get Login User Data verify current user token and provide login =================
router.get("/data",verifyToken, (req,res)=>{
  return res.json(req.user);
}); 

module.exports = router;
 