const express=require('express');
const authRouter=express.Router();
const {validateSignupData}=require('../utils/validation');
const User=require('../models/users');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

authRouter.post('/signup',async(req,res)=>{
    try{
        const firstName=req.body.firstName;
        const lastName=req.body.lastName;
        const emailId=req.body.emailId;
        const age=req.body.age;
        const gender=req.body.gender;
        const password=req.body.password;
        //validation the request
        validateSignupData(req);
        //encrypting the password hashing the password
        const passwordHash=await bcrypt.hash(password,10);
        //now creating a new instance of the user class
        const newUser=new User({
            firstName:firstName,
            lastName:lastName,
            emailId:emailId,
            age:age,
            gender:gender,
            password:passwordHash
        });
        //saving the user to the collection
        newUser.save().then((doc)=>{
            res.send("User has been added successfully");
        }).catch((err)=>{
            res.send("Oop! Some error occured!");
            console.log(err);
        })
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

authRouter.post('/login',async(req,res)=>{

    const email=req.body.emailId;
    const password=req.body.password;
    console.log("Email: ", email);
    console.log("Password: ", password);
    // checking if the email exits in the database
    const user=await User.findOne({emailId:email});

    if(!user)
    {
        throw new error("Invalid Credentials");
    }
    //hashing the password
   // const isPasswordValid=await bcrypt.compare(password,user.password);
    const isPasswordValid=await user.validatePassword(password);
    if(isPasswordValid)
    {
       // const token=await jwt.sign({_id:user._id},"gurnoorarora",{expiresIn:'7d'});
       const token=await user.getJWT();
        res.cookie("token",token);
        res.send("login successful");
    }
    else
    {
        res.send("Invalid Credentials");
    }

})

authRouter.post('/logout',async(req,res)=>{
    res.cookie("token","null",{
        expires:new Date(Date.now()),
    });
    res.send("Logout successful");
})

module.exports=authRouter;