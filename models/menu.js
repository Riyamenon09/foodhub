const mongoose=require("mongoose")
const menuschema=new mongoose.Schema(
    {
        restaurantId:
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"restaurant"
        },
    Name:
    {
        type:String,
        required:true
    },
    image:
    {
        type:String,
        required:true
    },
    price:
    {
        type:Number,
        required:true
    },
    Type:
    {
        type:String,
        required:true
    },
    Cheese:
    {
        type:Boolean,
    }
    }
)
const Menu=mongoose.model("menu",menuschema)
module.exports={Menu}