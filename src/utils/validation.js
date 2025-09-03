const validation=require("validator");
require('dotenv').config();
const validateSignupData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    console.log(emailId);
    console.log(password);
    if(!firstName || !lastName)
    {
        throw new Error("Name is not valid");
    }
    else if(!emailId || !validation.isEmail(emailId))
    {
        throw new Error("Email is not valid");
    }
/*  else if(!validation.isStrongPassword(password))
{
    throw new Error("Password is not strong");
}

*/
}
const validateProfileEditData=(req)=>{
const allowedEditFields=["firstName","lastName","emailId","photoUrl","gender","age","about","skills"];

const isEditAllowed=Object.keys(req.body).every((field)=>
allowedEditFields.includes(field));
return isEditAllowed;

}

module.exports={validateSignupData,validateProfileEditData};
