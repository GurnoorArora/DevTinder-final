const express=require('express');
const userRouter=express.Router();
const {userAuth}=require('../middleware/auth');
const ConnectionRequest=require('../models/connectionRequest');

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
module.exports=userRouter;
