const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const User=require('../models/users');
const { connection, Connection } = require('mongoose');
const ConnectionRequest = require('../models/connectionRequest');
const sendEmail=require('../utils/sendEmail');


requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req, res) => {
    try{
      //  console.log(req);
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status=req.params.status;
        
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status))
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
        const name=req.user.firstName+" "+req.user.lastName;

        const data=await connectionRequest.save();
        const emailRes = await sendEmail.run(
            "A new friend request from " + name,  // subject
            "You have received a new friend request on DevTinder from " + name  // body
        );

        console.log("Email Response:", emailRes);
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
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
         const loggedInUserId=req.user;
         const {status,requestId}=req.params;
         console.log("Status:", status);
         console.log("Request ID:", requestId);
         const allowedStatus=["accepted","rejected"];
         if(!allowedStatus.includes(req.params.status)) {
            return res.status(400).json({"message":"Invalid status provided"});
         }  

         const connectionRequest=await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId._id ,// Ensure the request is for the logged-in user        
            status:"interested",
         });
         if(!connectionRequest) {
            return res.status(404).json({message:"Connection request not found or already processed"});
         }
         connectionRequest.status=status;
        const data= connectionRequest.save();
       res.json({
        message:"Connection request"+status,
        data: data

       });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
        console.error("Error reviewing connection request:", err);
    }
});
module.exports = requestRouter;