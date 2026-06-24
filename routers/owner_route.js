const express = require("express");
const { ownerOnly } = require("../middleware/owner");
const { auth } = require("../middleware/auth");
const { Order } = require("../models/order");
const { Menu } = require("../models/menu")

const ownerRoute = express.Router();

ownerRoute.get("/",auth,ownerOnly,async (req, res) => {
        const orders =await Order.find({})
                .populate("userId")
                .populate("items.menuId")
                .sort({ createdAt: -1 });

        res.render("ownerdashboard",{orders});
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
    await Menu.create(
        {
            Name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            Type: req.body.Type,
            Cheese: req.body.Cheese === "true",
        }
    )
    res.redirect("/owner/menu")
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
    res.redirect("/owner/menu")
})

ownerRoute.post("/menu/update/:id", auth, ownerOnly, async (req, res) => {
    await Menu.findByIdAndDelete(req.params.id)
    res.redirect("/owner/menu")
})
module.exports = { ownerRoute };