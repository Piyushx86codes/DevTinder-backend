const express = require("express");
const app = express();
const PORT = 3000;
const Dbconnect = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//signup controller//
app.post("/signup",async(req,res)=>{
    try {
        const user = new user(req.body);
        await user.save();
        res.send("User Added Successfully");
    } catch (error) {
        res.status(400).send("Error saving the User:"+ error.message);
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
app.patch("/user",async(req,res)=>{
    try {
        const userId = req.body.userId;
        const data = req.body;
        await User.findByIdAndUpdate({_id:id},data);
        return res.send("User Updated Successfully");
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"failed to Update User info",
        })
    }
})

//calling the db connection//
Dbconnect();
app.use("/",(req,res)=>{
    res.send("This is my Homepage")
});

app.listen(PORT,()=>{
    console.log(`App is active and listening on  port no:${PORT}`)
});