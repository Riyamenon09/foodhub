const express=require("express")
const {auth}=require("../middleware/auth")
const {adminOnly}=require("../middleware/admin")
const {Restaurant}=require("../models/restaurant")
const adminRouter=express.Router()
adminRouter.get("/",auth,adminOnly,async (req,res)=>
{
    const restaurants=await Restaurant.find({})
    res.render("admindashboard",{restaurants})
})
adminRouter.post("/restaurant/add",auth,adminOnly,async (req,res)=>
{
    await Restaurant.create({
        ownerId:req.body.ownerId,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        rating:req.body.rating,
        address:req.body.address,
        deliverytime:req.body.deliverytime,
        description:req.body.description
    })
    res.redirect("/admin")
})
adminRouter.post("/restaurant/delete/:id",auth,adminOnly,async (req,res)=>
{
    await Restaurant.findByIdAndDelete(req.params.id)
    res.redirect("/admin")
})
adminRouter.post("/restaurant/update/:id",auth,adminOnly,async (req,res)=>
{
    await Restaurant.findByIdAndUpdate(req.params.id,{
         name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        rating:req.body.rating,
        address:req.body.address,
        deliverytime:req.body.deliverytime,
        description:req.body.description
    })
    res.redirect("/admin")
})
module.exports={adminRouter}