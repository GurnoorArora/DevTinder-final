const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://gurnoora51:Ggg%406350107686@devtinder.npbge.mongodb.net/"

    )
}
module.exports=connectDB;