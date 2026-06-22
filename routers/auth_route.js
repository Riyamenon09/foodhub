const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authrouter = express.Router()

const { User } = require("../models/user")

authrouter.get("/signup", (req, res) => {
    res.render("signup")
})

authrouter.post("/signup", async (req, res) => {
    const { name, email, password } = req.body
    const userExists =await User.findOne({ email })
    if (userExists) {
        return res.send("User already exists!")
    }
    await User.create({ name, email, password })
    res.redirect("/login")
})

authrouter.get("/login", (req, res) => {
    res.render("login")
})

authrouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.send("User not found!")
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.send("Invalid credentials")
    }
    const token = jwt.sign({
        id: user._id,
        role: user.role
    },
         process.env.JWT_SECRET,
    {
        expiresIn:"7d"
    }
    );
    res.cookie("token",token)
    res.redirect("/")

})
authrouter.get("/logout",(req,res)=>
{
    res.clearCookie("token")
    res.redirect("/")
})
module.exports = { authrouter }