const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validateSignUpdata = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    //vaidation of data//
    validateSignUpdata(req);
    const { firstName, lastName, email, password } = req.body;
    //hashing the password
    const passwordhash = bcrypt.hash(password, 10);
    const user = new User(req.body);
    await user.save({
      firstName,
      lastName,
      email,
      password: passwordhash,
    });
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Error saving the User:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Unable to find Email Id");
    }
    const isPasswordValid = await bcrypt.compare(password, user.passowrd);
    if (isPasswordValid) {
      //create a jwt token//
      const token = await user.getJWT();

      //send token inside cookie and send it to user//
      res.cookie("token", token, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        success: true,
        message: "Login Successfull",
      });
    } else {
      throw new Error("password is incorrect");
    }
  } catch (error) {
    console.error("Error Message:" + error);
    return res.status(500).json({
      success: false,
      message: "Failed to Login",
    });
  }
});

module.exports = authRouter;