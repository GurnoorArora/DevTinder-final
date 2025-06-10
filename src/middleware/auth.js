const jwt=require("jsonwebtoken");
const User=require('../models/users');


const userAuth=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new error("token is invalid!");
        }
        const decodedObj=await jwt.verify(token,"gurnoorarora");
        const {_id}=decodedObj;
        const user=await User.findOne({_id:_id});
        if(!user)
        {
            throw new error("User not found");
        }
        req.user=user;
        next();
}
catch(err){
    throw new err("Error:")
}
    

    
}

module.exports={userAuth}