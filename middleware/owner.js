function ownerOnly(req,res,next)
{
    if(req.user.role!=="owner")
    {
        return res.send("Access denied!")
    }
    next();
}
module.exports={ownerOnly}