const mongoose = require("mongoose");
require('dotenv').config();

const Dbconnect = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database Connectivity Successfull");
    } catch (error) {
        console.log("Failed to connect to database");
        console.error("Error:",error);
        process.exit(1);
    }
}

module.exports = Dbconnect;