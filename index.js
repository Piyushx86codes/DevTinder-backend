const express = require("express");
const app = express();
const Dbconnect = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

//calling the db connection//
Dbconnect();
app.use("/",(req,res)=>{
    res.send("This is my Homepage")
});

app.listen(PORT,()=>{
    console.log(`App is active and listening on  port no:${PORT}`)
});