const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const Connectionrequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored","intrested"];
    if(!allowedStatus.includes(status)){
         return res.status(400).json({
          sucess:false,
          message:"Invalid Status Type" + status,
         })
    }

    //to check if there is an existing connection request//
    const existingconnectionRequest = await connectionRequest.findOne({
      $or:[
        {fromUserId,toUserId},
        {fromUserId: toUserId, toUserId: fromUserId},
      ]
    })

    const toUser = await User.findById(toUserId);
    if(!toUser){
        return res.status(400).json({
          sucess:false,
          message:"User Not Found",
        })
    }

    if(existingconnectionRequest){
      return res.status(400).json({
        message:"Connection request Already Exist",
      })
    }
     

    const connectionRequest = await Connectionrequest({
      fromUserId,
      toUserId,
      status,
    })
    const data = await Connectionrequest.save();
    res.json({
      message:"Connection Request Sent Successfully",
      data,
    })




  } catch (error) {
    console.error("Error is " + error.message);
  }
})

module.exports = requestRouter;