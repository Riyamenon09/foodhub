const express = require("express");
const { auth } = require("../middleware/auth");
const { Cart } = require("../models/cart");
const { Order } = require("../models/order");

const checkoutrouter = express.Router();

checkoutrouter.get("/", auth, async (req, res) =>
{
    const cart = await Cart.findOne({
        userId: req.user._id
    }).populate("items.menuId");

    let total = 0;

    cart.items.forEach(item =>
    {
        total += item.menuId.price * item.quantity;
    });

    res.render("checkout", { cart, total });
});

checkoutrouter.post("/placeorder", auth, async (req, res) =>
{
    const cart = await Cart.findOne({
        userId: req.user._id
    }).populate("items.menuId");

    if (!cart || cart.items.length === 0)
    {
        return res.send("Cart Empty");
    }

    let totalAmount = 0;

    const orderItems = cart.items.map(item =>
    {
        totalAmount += item.menuId.price * item.quantity;

        return {
            menuId: item.menuId._id,
            quantity: item.quantity,
            price: item.menuId.price
        };
    });

    await Order.create({
        userId: req.user._id,

        items: orderItems,

        totalAmount,

        address:
        {
            fullName: req.body.fullName,
            phone: req.body.phone,
            houseNo: req.body.houseNo,
            area: req.body.area,
            city: req.body.city,
            pincode: req.body.pincode
        },

        paymentMethod: req.body.paymentMethod
    });

    // Clear cart after order placement
    cart.items = [];

    await cart.save();

    res.redirect("/checkout/order")
});

checkoutrouter.get("/order",auth,async (req,res)=>
{
    const order=await Order.findOne({
        userId:req.user._id
    }).populate("items.menuId").sort({createdAt:-1})
    res.render("order",{order})
})
module.exports = {
    checkoutrouter
};