const jwt = require("jsonwebtoken");
const User = require("../models/user");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //read the tyhoken from req.cookies
    const { token } = req.cookies;
    if(!token){
        res.send("Invalid Token");
    }

    const decodedObj = await jwt.verify(token, "Mysecret");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
        success:false,
        Error:error.message,
    })
  }
};




module.exports = {
    userAuth,
}