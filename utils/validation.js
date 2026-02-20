const validator = require("validator");

const validateSignUpdata = (req)=>{
    const {firstName,lastName,email,password} = req.body;
    if(!firstName || !lastname){
        throw new Error("pls enter the feilds");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is Not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("pls use a Strong password");
    }
}

module.exports = validateSignUpdata;