const express=require('express');
const { connect } = require('mongoose');
const app=express();//create an express app
const port=3000;//port number
const jwt=require('jsonwebtoken');
const connectDB=require('./config/database');
const User=require('./models/users');
const {userAuth}=require("./middleware/auth");
const cookieParser=require("cookie-parser");
const cors=require("cors");
app.use(express.json());
app.use(cookieParser());
const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/request');
const userRouter=require('./routes/user');

app.use('/',authRouter);
app.use('/',profileRouter); 
app.use('/',requestRouter);
app.use('/',userRouter);
//creating a route for signing up the user

//creatig an api to login 

// });

app.get('/',(req,res)=>{
    res.send("Welcome to the Dev Tinder");
});
connectDB().then(()=>{ 
    console.log("Database connection established...");
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
}).catch((err)=>{
    console.error("Database connection failed...",err);
}   );
