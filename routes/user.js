const express = require('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
 const USER_SAFEDATA = ["firstName","lastName"];


userRouter.get("/user/request/recieved",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionrequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"intrested",
        }).populate("fromUserid",["firstName","lastName"])

        res.json({
            message:"Data fecthed Successfully",
            data:connectionrequests,
        })
    } catch (error) {
         req.statusCode(400).send("Error:"+ error.message);
    } 
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
       
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id , status:"accepted"},
                {fromUserId:loggedInUser._id, status:"accepted"}
            ],
        }).populate("firstName",USER_SAFEDATA).populate("lastName",USER_SAFEDATA);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
               return  row.toUserId
            }
            return row.fromUserId;
        }); 

        res.json({data})
    } catch (error) {
        res.status(400).json(
            {
                message:"Something Went Worng"
            }
        )
    }
})


module.exports = userRouter;
