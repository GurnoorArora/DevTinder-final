const validation=require("validator");
const validateSignupData=(req)=>{
    const {firstName,lastName,email,password}=req.body;
    if(!firstName || !lastName)
    {
        throw new Error("Name is not valid");
    }
    else if(!validation.isEmail(email))
    {
        throw new Error("Email is not valid");
    }
    else if(!validation.isStrongPassword(password))
    {
        throw new Error("Password is not strong");
    }


}

module.exports={validateSignupData};
