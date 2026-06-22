require("dotenv").config()
const express=require("express")
const cookieParser=require("cookie-parser")
const path=require("path")
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")

const app=express()
const port =8000
const {category}=require("./models/category")
const {categoryconnect}=require("./connection")
const {restaurantrouter}=require("./routers/restaurant_route")
const {authrouter}=require("./routers/auth_route")
const {auth}=require("./middleware/auth")
const {User}=require("./models/user")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

//global middleware
app.use(async(req,res,next)=>
{
    try
    {
        res.locals.user = null;   

        const token = req.cookies.token;

        if(token)
        {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(
                decoded.id
            );

            req.user = user;
            res.locals.user = user;
        }

        next();
    }
    catch(err)
    {
        res.locals.user = null;
        next();
    }
});
app.get(
"/profile",
auth,
(req,res)=>
{
    res.render(
        "profile",
        {
            user:req.user
        }
    );
});

categoryconnect("mongodb://127.0.0.1:27017/Foodhub").then(()=>{console.log("category database connected!")}).catch((err)=>{console.log(`Error detected ${err}`)})


app.use(express.static(path.join(__dirname,"public")));

app.use("/restaurant",restaurantrouter)
app.use("/",authrouter)
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