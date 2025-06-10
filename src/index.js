const express=require('express');
const { connect } = require('mongoose');
const app=express();//create an express app
const port=3000;//port number
const jwt=require('jsonwebtoken');
const connectDB=require('./config/database');
const User=require('./models/users');
const {userAuth}=require("./middleware/auth");
const {validateSignupData}=require('./utils/validation');
const bcrypt=require('bcrypt');
const cookieParser=require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
//creating a route for signing up the user
app.post('/signup',async(req,res)=>{
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
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
        email:email,
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
})
//creatig an api to login 
app.post('/login',async(req,res)=>{

    const email=req.body.email;
    const password=req.body.password;
    // checking if the email exits in the database
    const user=await User.findOne({email:email});

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
//tasks -get API to get user by email
//task2-API feed
// app.get('/users',async(req,res)=>{
//     try{
//         const UserEmail=req.body.email;

//         if(UserEmail.length===0)
//         {
//             res.status(404).send('No Email entered');
//         }
//         else
//         {
//             const data_received=await User.find({email:UserEmail});
//             if(data_received.length===0)
//             {
//                 return res.status(404).send("No matching record found");
//             }
//             res.send(data_received);   
//         }
//     }
//     catch(err){
//         res.send('An error has occured');
//     }
// })
//creating the api to UPDATE the details
// app.patch('/update',async(req,res)=>{
//     const userId=req.body.id;
//     const updatedDetails=req.body;
//     try{
//         if(!userId)
//         {
//             return res.status(404).send("No id has been entered")
//         }
//        await User.findByIdAndUpdate(userId,updatedDetails);
//         res.send('Successfully Updated!');  

//     }
//     catch(err){
//         res.send("Oops an error has occured");
//     }
// })

//writing API to update using email address provided in the request
// app.patch('/updateByEmail',async(req,res)=>{
//     const userEmail=req.body.email;
//     const updatedDetails=req.body;
//     try{
//         if(!userEmail)
//         {
//             return res.status(404).send("No email has been enteres");
//         }
//         const doc=await User.findOneAndUpdate({email:userEmail},updatedDetails);
//         if(!doc)
//         {
//             return res.status(404).send("User not found");
//         }
//         res.send("Successfully Updated")
//     }
//     catch(err){
//         res.status(400).send("Oops an error has been occured");
//     }
// })
//writing an API to update the user using userId
// app.patch('/ubId',async (req,res)=>{
//     const UserId=req.body.userId;
//     const data=req.body;
//     try{
//         const user=await User.findByIdAndUpdate({_id:UserId},data,{
//             returnDocument:"after",
//            runValidators: true
//         });      
//         res.send("User Updated Successfully");
//     }
//     catch(err){
//         res.status(400).send("Something went wrong");
//         console.log(err);
//     }
// });
// app.patch('/ubId', async (req, res) => {
//     const UserId = req.body.userId;
//     const data = req.body;

//     // Allowed fields for update
//     const allowedUpdates = ["photoUrl", "about", "gender", "age", "skills"];
    
//     // Filter only allowed updates
//     const updates = Object.keys(data).filter(key => allowedUpdates.includes(key));
    
//     const filteredData = updates.reduce((obj, key) => {
//         obj[key] = data[key];
//         return obj;
//     }, {});

//     try {
//         if (updates.length === 0) {
//             return res.status(400).send("No valid fields to update");
//         }

//         const user = await User.findByIdAndUpdate(
//             { _id: UserId },
//             filteredData,
//             {
//                 returnDocument: "after",
//                 runValidators: true
//             }
//         );

//         res.send("User Updated Successfully");
//     } catch (err) {
//         res.status(400).send("Something went wrong");
//         console.log(err);
//     }
// });
//created a Route to show the feed to the users
// app.get('/showUsers',async(req,res)=>{
//     try{
//         const data_received=await User.find();
//         res.send(data_received)


//     }
//     catch(err){
//         res.send("An error occured");
//     }
// });
app.get('/profile',userAuth,async(req,res)=>{
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

connectDB().then(()=>{ 
    console.log("Database connection established...");
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
}).catch((err)=>{
    console.error("Database connection failed...",err);
}   );
