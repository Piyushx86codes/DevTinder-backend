const express = require("express");
const app = express();
const PORT = 3000;
const Dbconnect = require("./config/database");

//calling the db connection//
Dbconnect();
app.use("/",(req,res)=>{
    res.send("This is my Homepage")
});

app.listen(PORT,()=>{
    console.log(`App is active and listening on  port no:${PORT}`)
});