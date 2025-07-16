const express=require('express');
const userRouter=express.Router();
const {userAuth}=require('../middleware/auth');
const ConnectionRequest=require('../models/connectionRequest');

const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills";
//Get all the pending connection requests for the logged-in user
userRouter.get('/user/requests/received',userAuth, async (req, res) => {
    try {
        const loggedInUser=req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:'interested'
        }).populate('fromUserId',"firstName lastName photoUrl gender about skills");
        console.log("Connection Requests: ", connectionRequests);
        res.json({
            message:"Data Fetched Successfully",
            data: connectionRequests
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");  
    }
});
//this api shows the users accepted connections
//A->B, B->C and both are accepted so B has 2 connections
userRouter.get("/user/connections",userAuth,async (req, res) => {
    try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data=connectionRequests.map((row)=>
            {
                if(row.fromUserId._id.toString() === loggedInUser._id.toString())
                {
                    return row.toUserId
                }
                else
                {
                    return row.fromUserId;
                }
            
            });
        res.json({
            message: "Connections fetched successfully",
            data: data
        })
    }
    catch (err) {
        res.status(400).send({message:err.message});
        console.error("Error fetching connections:", err);
    }   
});
module.exports=userRouter;
