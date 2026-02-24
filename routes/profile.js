const express = require("express");
const profileRouter =  express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth,async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"SomeThing Went Wrong",
    })
  }
});

profileRouter.patch("profile/edit",userAuth,async(req,res)=>{
    try {
      if(validateEditProfileData(req)){
         throw new Error("Invalid Edit Request");
      }
     Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));

    await loggedInuser.save();

     res.send(`${loggedInuser.firstName}, your profile was Updated Successfully`);
    } catch (error) {
        res.status(400).send("Error" + error.message);
    }
})

module.exports = profileRouter;