require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const app = express()
const port = 8000

const { categoryconnect } = require("./connection")
categoryconnect("mongodb://127.0.0.1:27017/Foodhub").then(() => { console.log("Database connected!") }).catch((err) => { console.log(`Error detected ${err}`) })

const { User } = require("./models/user")
const { category } = require("./models/category")
const { Cart } = require("./models/cart")

const { auth } = require("./middleware/auth")
const { adminOnly } = require("./middleware/admin")
const { ownerOnly } = require("./middleware/owner")

const { authrouter } = require("./routers/auth_route")
const { restaurantrouter } = require("./routers/restaurant_route")
const { cartrouter } = require("./routers/cart_route")
const { checkoutrouter } = require("./routers/checkout")
const { ownerRoute } = require("./routers/owner_route")
const { adminRouter } = require("./routers/admin_route")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(async (req, res, next) => {
    try {
        res.locals.user = null;

        const token = req.cookies.token;

        if (token) {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(
                decoded.id
            );

            req.user = user;
            res.locals.user = user;

            if (user) 
            {
                const cart = await Cart.findOne({ userId: user._id })
            
                let cartcount = 0
                
                if(cart)
                {
                    cartcount=cart.items.reduce((sum,items)=>sum+items.quantity,0)
                }
            res.locals.cartcount=cartcount
        }
            else
            {
                res.locals.cartcount=0;
            }
        }

        next();
    }
    catch (err) {
        res.locals.user = null;
        next();
    }
});

// app.get("/admin",auth,adminOnly,(req,res)=>
// {
//     res.send("Admin Welcome")
// })
// app.get("/owner",auth,ownerOnly,(req,res)=>
// {
//     res.send("Owner Welcome!")
// })




app.use("/", authrouter)
app.use("/restaurant", restaurantrouter)
app.use("/cart", cartrouter)
app.use("/checkout", checkoutrouter)
app.use("/owner", ownerRoute)
app.use("/admin", adminRouter)

app.get("/", async (req, res) => {
    const categories = await category.find({})
    res.render("home", { categories })
})
app.get("/profile", auth, (req, res) => {
    res.render("profile", { user: req.user })
})


app.listen(port, () => {
    console.log("Server listening to port 8000")
})