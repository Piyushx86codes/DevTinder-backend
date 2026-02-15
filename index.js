const express = require("express");
const app = express();
const PORT = 3000;
const Dbconnect = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//signup controller//

app.post("/signup",async(req,res)=>{
    try {
        const user = new user(req.body);
        await user.save();
        res.send("User Added Successfully");
    } catch (error) {
        res.status(400).send("Error saving the User:"+ error.message);
    }
})

//calling the db connection//
Dbconnect();
app.use("/",(req,res)=>{
    res.send("This is my Homepage")
});

app.listen(PORT,()=>{
    console.log(`App is active and listening on  port no:${PORT}`)
});