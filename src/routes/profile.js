const express=require('express');
const profileRouter=express.Router();
const User=require('../models/users');
const { userAuth } = require('../middleware/auth');

profileRouter.get('/profile',userAuth,async(req,res)=>{
   const user=req.user;
    if(!user)
    {
        console.log("No such user exist");
    }
    else
    {
        res.send(user);
    }
})
module.exports=profileRouter;