const express=require('express');
const profileRouter=express.Router();
const User=require('../models/users');
const { userAuth } = require('../middleware/auth');
const {validateProfileEditData}=require('../utils/validation');

profileRouter.get('/profile/view',userAuth,async(req,res)=>{
   const user=req.user;
    if(!user)
    {
        console.log("No such user exist");
    }
    else
    {
        console.log(user);
        res.send(user);
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit Request ");
        }
        const loggedInUser = req.user;
        // Use loggedInUser or remove if not needed
        Object.keys(req.body).forEach((key)=>{
            loggedInUser[key] = req.body[key];
        })
        await loggedInUser.save();
        console.log(loggedInUser);
        res.send(`Profile updated successfully`);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
        return;
    }
});
module.exports=profileRouter;