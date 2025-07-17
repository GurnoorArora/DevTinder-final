const express=require('express');
const userRouter=express.Router();
const {userAuth}=require('../middleware/auth');
const ConnectionRequest=require('../models/connectionRequest');
const User=require('../models/users');
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
//building the feed api

userRouter.get('/feed',userAuth,async(req,res)=>{
    try{
        //user should see all the user cards except
        // his own card
        // his connections
        //ignored people
        //already sent connection requests
        const loggedInUser=req.user;
        //find all the connection requests sent or received by the logged-in user
        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10; // Number of users per page
        limit=limit>50?50:limit; // Limit to a maximum of 50 users per page
        const skip=(page-1)*limit;
        const connectionRequests=await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId ").populate("fromUserId","firstName");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req=>{
            hideUsersFromFeed.add(req.fromUserId._id.toString());
            hideUsersFromFeed.add(req.toUserId._id.toString());
        })
        const user=await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } }, // Exclude logged-in user
                { _id: { $nin: Array.from(hideUsersFromFeed) } } // Exclude connections and ignored users
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({
            message: "Feed fetched successfully",
            data: user
        });
    }
    
    catch(err){
        res.status(400).send({message:err.message});

    }
})
module.exports=userRouter;
