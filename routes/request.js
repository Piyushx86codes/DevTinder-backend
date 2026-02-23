const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

requestRouter.post("/send ConnectionRequest",userAuth,async(req,res)=>{
  const user = req.user;
  console.log("sendong a connection request")
})

module.exports = requestRouter;