const mongoose=require('mongoose');

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",//this is creating a reference to the User model
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",//this is creating a reference to the User model
        required:true
    },
    status:{
        type:String,
        enum:{
           values: ["ignored","interested","accepted","rejected"],
            message:`{VALUE} is not a valid status`
        },
        default:"pending"
    }, 


},{
    
timestamps:true
});
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    //check if the fromUserId  is same as toUserId
    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        return next(new Error("You cannot send a connection request to yourself"));
    }
    next();
    //this is like a middleware that runs before the save operation
    //it checks if the fromUserId is same as toUserId and throws an error
})
const ConnectionRequest = mongoose.model('ConnectionRequest',connectionRequestSchema);
module.exports = ConnectionRequest;