const express=require("express")
const path=require("path")
const mongoose=require("mongoose")
const app=express()
const port =8000


const {category}=require("./models/category")
const {categoryconnect}=require("./connection")
const {restaurantrouter}=require("./routers/restaurant_route")

categoryconnect("mongodb://127.0.0.1:27017/Foodhub").then(()=>{console.log("category database connected!")}).catch((err)=>{console.log(`Error detected ${err}`)})

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,"public")));

app.use("/restaurant",restaurantrouter)
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.get("/",async(req,res)=>
{
    const categories=await category.find({})
    console.log(categories)
    res.render("home",{categories})
})
app.listen(port,()=>
{
    console.log("Server listening to port 8000")
})