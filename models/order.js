const mongoose = require("mongoose");
const orderSchema =new mongoose.Schema(
{
    userId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    items:
    [
        {
            menuId:
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"menu",
                required:true
            },

            quantity:
            {
                type:Number,
                required:true
            },

            price:
            {
                type:Number,
                required:true
            }
        }
    ],

    totalAmount:
    {
        type:Number,
        required:true
    },

    address:
    {
        fullName:String,
        phone:String,
        houseNo:String,
        area:String,
        city:String,
        pincode:String
    },

    paymentMethod:
    {
        type:String,

        enum:
        ["COD","UPI","CARD"],
        default:"COD"
    },

    status:
    {
        type:String,

        enum:
        ["Placed","Preparing","Out For Delivery","Delivered","Cancelled"],
        default:"Placed"
    }

},
{
    timestamps:true
});

const Order =mongoose.model("order",orderSchema);
module.exports ={Order};