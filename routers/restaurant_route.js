const express=require("express")
const restaurantrouter=express.Router()
const {Restaurant}=require("../models/restaurant")
const {Menu}=require("../models/menu")
restaurantrouter.get("/:category",async (req,res)=>
{
    const categoryname=req.params.category;
    const restaurant=await Restaurant.find({
        category:categoryname
    })
    res.render("restaurant",{restaurant,categoryName:categoryname})
})
restaurantrouter.get("/menu/:id",async (req,res)=>
{
    const restaurant=await Restaurant.findById(req.params.id)
    const menus=await Menu.find({restaurantId:req.params.id})
    res.render("menu",{restaurant,menus})
})



module.exports={restaurantrouter}