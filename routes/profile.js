const express = require("express");
const profileRouter =  express.Router();
const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile", userAuth,async (req, res) => {
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

module.exports = profileRouter;