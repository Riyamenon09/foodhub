const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
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
userschema.pre("save", async function()
{
    if(!this.isModified("password"))
    {
        return;
    }

    this.password =
    await bcrypt.hash(
        this.password,
        10
    );
});
const User=mongoose.model("user",userschema)
module.exports={User}