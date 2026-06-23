const express = require("express");
const { auth } = require("../middleware/auth");
const { Cart } = require("../models/cart");

const cartrouter = express.Router();

cartrouter.get("/", auth, async (req, res) => {

    const cart = await Cart.findOne({
        userId: req.user._id
    }).populate({
    path:"items.menuId",
    populate:{
        path:"restaurantId"
    }
})

    res.render("cart", { cart });

});

cartrouter.post("/add/:menuId", auth, async (req, res) => {

    const userId = req.user._id;
    const menuId = req.params.menuId;

    let cart = await Cart.findOne({
        userId
    });

    if (!cart) {

        cart = await Cart.create({
            userId,
            items: []
        });

    }

    const existingItem = cart.items.find(
        item =>
            item.menuId.toString() === menuId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.items.push({
            menuId,
            quantity: 1
        });

    }

    await cart.save();

    res.redirect(req.get("Referer") || "/")

});
cartrouter.post("/increase/:menuId",auth,async (req,res)=>
{
    const cart=await Cart.findOne({
        userId:req.user._id
    })
    const item=cart.items.find(item=>item.menuId.toString()===req.params.menuId)
    if(item)
    {
        item.quantity++;
    }
    await cart.save();
    res.redirect("/cart");
})
cartrouter.post("/decrease/:menuId",auth,async (req,res)=>
{
    const cart=await Cart.findOne({
        userId:req.user._id
    })
    const item=cart.items.find(item=>item.menuId.toString()===req.params.menuId)
    if(item)
    {
        item.quantity--;
    }
    if(item.quantity <= 0)
        {
            cart.items =
            cart.items.filter(
                item =>
                item.menuId.toString()
                !==
                req.params.menuId
            );
        }
    await cart.save();
    res.redirect(req.get("Referer") || "/");
})
module.exports = { cartrouter };