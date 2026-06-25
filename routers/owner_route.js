const express = require("express");
const { ownerOnly } = require("../middleware/owner");
const { auth } = require("../middleware/auth");
const { Order } = require("../models/order");
const { Menu } = require("../models/menu")
const {Restaurant}=require("../models/restaurant")
const ownerRoute = express.Router();

ownerRoute.get("/", auth, ownerOnly, async (req, res) =>
{
    const restaurant =
    await Restaurant.findOne({
        ownerId: req.user._id
    });

    const orders =
    await Order.find({})
    .populate("userId")
    .populate({
        path: "items.menuId",
        populate:
        {
            path: "restaurantId"
        }
    })
    .sort({ createdAt: -1 });

    const ownerOrders =
    orders.filter(order =>
        order.items.some(item =>
            item.menuId &&
            item.menuId.restaurantId &&
            item.menuId.restaurantId._id.toString()
            ===
            restaurant._id.toString()
        )
    );

    res.render(
        "ownerdashboard",
        {
            orders: ownerOrders
        }
    );
});
ownerRoute.post("/status/:id", auth, ownerOnly, async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: req.body.status })
    res.redirect("/owner")
})

ownerRoute.get("/ownermenu", auth, ownerOnly, async (req, res) => {
    const menus = await Menu.find({}).populate("restaurantId")
    res.render("ownermenu", { menus })
})

ownerRoute.post("/menu/add", auth, ownerOnly, async (req, res) => {
    const restaurant =
    await Restaurant.findOne({
        ownerId:req.user._id
    });
    await Menu.create(
        {
            restaurantId: restaurant._id,
            Name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            Type: req.body.Type,
            Cheese: req.body.Cheese === "true",
        }
    )
    res.redirect("/owner/ownermenu")
})
ownerRoute.post("/menu/update/:id", auth, ownerOnly, async (req, res) => {
    await Menu.findByIdAndUpdate(req.params.id,
        {
            Name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            Type: req.body.Type,
            Cheese: req.body.Cheese === "true"

        }
    )
    res.redirect("/owner/ownermenu")
})

ownerRoute.post("/menu/delete/:id", auth, ownerOnly, async (req, res) => {

    await Menu.findByIdAndDelete(req.params.id);

    res.redirect("/owner/ownermenu");

});
module.exports = { ownerRoute };