const mongoose=require("mongoose")
const cartschema=new mongoose.Schema(
    {
        userId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        },
        items:[
        {
            menuId:
            {
                type:mongoose.Schema.Types.ObjectId,
            ref:"menu"
            },
            quantity:
            {
                type:Number,
                default:1
            }
    }]
    },{timestamps:true}
)
const Cart=mongoose.model("cart",cartschema)
module.exports={Cart}