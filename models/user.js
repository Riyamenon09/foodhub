const mongoose=require("mongoose")
const userschema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        email:
        {
            type:String,
            required:true,
            unique:true
        },
        password:
        {
            type:String,
            required:true
        },
        profilepic:
        {
            type:String,
            default:"/images/default.png"
        },
        role:
        {
            type:String,
            enum:["customer","owner","admin"],
            default:"customer"

        },
    },{timestamps:true}
)
const User=mongoose.model("user",userschema)
module.exports={User}