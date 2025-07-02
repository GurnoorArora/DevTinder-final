const validation=require("validator");
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

module.exports={validateSignupData};
