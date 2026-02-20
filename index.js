const express = require("express");
const app = express();
const Dbconnect = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const validateSignUpdata = require("./utils/validateSignUpdata");
const PORT = 3000;

app.use(express.json());

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
    const isPassword = await bcrypt.compare(password,user.passowrd);
    if(isPassword){
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

//get user details//
app.get("/user",async(req,res)=>{
    try {
        const userEmail = req.body.email;
        const user = await User.findOne({email:userEmail});
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        res.send(user);
    } catch (error) {
      res.status(500).json({
        sucess:false,
        message:"Something went wrong",
    })
    }
})

//feed api to get all users//
app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:"Something went wrong",
        })
    }
})

//delete a user API//
app.delete("/user",async(req,res)=>{
   try {
     const userId = req.body.userId;
     const user = await User.findByIdAndDelete(userId);
     return res.status(200).json({
        success:true,
        message:"user deleted Successfully",
     })
   } catch (error) {
     return res.status(404).json({
        success:false,
        message:"failed to delete user"
     })
   }

})

//update user data API//
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  const ALLOWED_UPDATES = ["photoUrl","skills","gender","age"];

  const isUpdateAllowed = Objects.keys(data).every((k)=>
    ALLOWED_UPDATES.includes(k)
  )
  if(!isUpdateAllowed){
   throw new Error("Update Not Allowed");
  }
  if(data?.skills.length > 10){
    throw new Error("Skills cannot be more than 10");
  }
  try {
    await User.findByIdAndUpdate({ _id: id }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    return res.send("User Updated Successfully");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to Update User info",
    });
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