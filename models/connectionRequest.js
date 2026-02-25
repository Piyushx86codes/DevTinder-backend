const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:Object.Schema.Types.ObjectId,
        ref:"User", //reference to user collection
        required:true,
    },
    ToUserId:{
        type:Object.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","intrested","accepted","rejected"],
            message:`${VALUE} is incorrect Type`
        }
    },
},
{
    timestamps:true,
});

//compound index//
connectionRequestSchema.index({fromUserId:1});

connectionRequestSchema.pre("save",function(){ 
    const ConnectionRequest = this;
    //check if fromuserId and ToUserId are same//
    if(ConnectionRequest.fromUserId.equals(ConnectionRequest.ToUserId)){
        throw new Error("You cannot send Connection reuest to Yourself"); 
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = ConnectionRequestModel;