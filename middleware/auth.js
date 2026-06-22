const jwt=require("jsonwebtoken")
function auth(req,res,next)
{
    const token=req.cookies.token
    if(!token)
    {
        return res.redirect("/login")
    }
    try{
        const decoded=jwt.verify(token,"foodhubsecret")
        req.user=decoded
        next()
    }
    catch(err)
    {
        return res.redirect("/login")
    }

}
module.exports={auth}