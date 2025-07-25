const jwt=require("jsonwebtoken");
const User=require('../models/users');


const userAuth=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            return res.status(401).send("Please Log in to continue");
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
    res.status(400).send("ERROR: " + err.message);
}
    

    
}

module.exports={userAuth}