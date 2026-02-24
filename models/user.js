const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 4,
      maxlength:50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address" + value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Enter a Strong Password" + value);
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum:{
        values:["male","female","others"],
        message:`${VALUE} is not a Valid Gender Type`
      },
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender is Not valid");
        }
      },
    },
    photourl: {
      type: String,
    },
    about: {
      type: String,
      default: "this is deafult about the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.getJWT = async function(){
  const user = this;
  const token  = await jwt.sign({_id:this._id},"Mysecret",{expiresIn:"1d"});
  return token;
}

module.exports = mongoose.model("User", UserSchema);
