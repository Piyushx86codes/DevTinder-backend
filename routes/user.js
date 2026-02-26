const express = require('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFEDATA = ["firstName","lastName"];
const User = require("../models/user");


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

userRouter.get("/feed?page=1&limit=10",userAuth,async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1) * limit;
        const loggedInUser = req.user;
        //find all connection request that have been sent and accepted//
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}
            ],
        }).select("fromUserId toUserId").skip(skip).limit(limit);

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await  User.find({
            $and:[{_id:{$nin : Array.from(hideUsersFromFeed)},},{_id:{$ne:loggedInUser._id}},]
        }).select(USER_SAFEDATA);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})


module.exports = userRouter;
