const mongoose=require("mongoose");
const validator=require("validator");
const JWT=require("jsonwebtoken");
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({ 
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:40
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true, //this identifies if the entered email id is unique or not, if it is not then it is rejected
        trim:true,
        lowercase:true,
        validate:(value)=>{
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid email format")
            }
        }      
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:false,
        min:18
    },
    gender:{
        type:String,
        required:false,
        //adding custom validation to gender
        validate(value)
        {
            if(!["male","female","others"].includes(value))
            {
                throw new Error("Entered Gender is not valid");
                
            }


        }
        //by default this validation function will only work if we are 
        //putting in new data if we want it to work on upate method we neeed to 
        //enable it first
        
    }
    ,photoUrl:{
        type:String,
        default:"https://pngtree.com/freepng/default-male-avatar_5939655.html",
        validate:(value)=>{
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL format");
            }

        }
    },
    skills:{
        type:[String]
    },
    about:{
        type:String,
        default:"This is a default about of the user!"
    }
},{
    timestamps:true
}); 

userSchema.methods.getJWT= async function()
{
    const user=this;
    const token=await JWT.sign({_id:user._id},"gurnoorarora",{expiresIn:'7d'});
    return token;
    
};
userSchema.methods.validatePassword=async function(passwordInputByUser)
{
    const user=this;
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,user.password);
    return isPasswordValid;
    
}
const userModel=mongoose.model("User",userSchema);
module.exports=userModel; 