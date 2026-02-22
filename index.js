const express = require("express");
const app = express();
const Dbconnect = require("./config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const validateSignUpdata = require("./utils/validateSignUpdata");
const {userAuth} = require("./middlewares/auth");
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

//signup controller//
app.post("/signup",async(req,res)=>{
    
    try {
        //vaidation of data//
        validateSignUpdata(req);
        const {firstName,lastName,email,password} = req.body;
        //hashing the password
        const passwordhash = bcrypt.hash(password,10);
        const user = new user(req.body);
        await user.save({
          firstName,
          lastName,
          email,
          password:passwordhash,

        });
        res.send("User Added Successfully");
    } catch (error) {
        res.status(400).send("Error saving the User:"+ error.message);
    }
})

//login controller//
app.post("/login",async(req,res)=>{
  try {
    const {email,password} = req.body;
    const user = await user.findOne({email});
    if(!user){
      throw new Error('Unable to find Email Id');
    }
    const isPasswordValid = await bcrypt.compare(password,user.passowrd);
    if(isPasswordValid){
     
    //create a jwt token//
    const token = jwt.sign({_id:user._id},"Mysecret");


    //send token inside cookie and send it to user//

    
      return res.status(200).json({
        success:true,
        message:"Login Successfull",
      })
    }else{
      throw new Error("password is incorrect");
    }
  } catch (error) {
    console.error("Error Message:"+ error);
    return res.status(500).json({
      success:false,
      message:"Failed to Login"
    })
  }
})


//profile api//
app.get("/profile", userAuth,async (req, res) => {
  try {
    const user = req.user;
    if(!user){
      throw new Error("User does not Exist");
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"SomeThing Went Wrong",
    })
  }
});


//calling the db connection//
Dbconnect();
app.use("/",(req,res)=>{
    res.send("This is my Homepage")
});

app.listen(PORT,()=>{
    console.log(`App is active and listening on  port no:${PORT}`)
});