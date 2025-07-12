const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const User=require('../models/users');
const { connection, Connection } = require('mongoose');
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status=req.params.status;
        
        const allowedStatus=["ignored","interested"];
        if(allowedStatus.includes(status))
        {
            return res.status(400).send("Invalid status provided");
        }
        //checking if the toUserId is valid
        const toUser=await User.findById(toUserId);
        if(!toUser)
        {   
        return res.status(404).send("User not found");
        }
        //check if the fromUserId is same as toUserId
        if(fromUserId.toString() === toUserId.toString()) {
            return res.status(400).send("You cannot send a connection request to yourself");
        }
        //checking if there is already a connection request sent by the user
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId } // Check for reverse request
                //checking if the other user has sent a request to the current user
            ]
          
        });
        if(existingConnectionRequest) {
            return res.status(400).send("Connection request already exists");
        }

        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        //we created a new instance of connectionRequest 
        //now we will save it to the db

        const data=await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data
        });
         

    }
    catch(err){
        res.status(500).send("Internal Server Error");
        console.error("Error sending connection request:", err);
    }
});
module.exports = requestRouter;