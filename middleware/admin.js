function adminOnly(req,res,next)
{
    if(req.user.role!=="admin")
    {
        return res.send("Access denied!")
    }
    next();
}
module.exports={adminOnly}