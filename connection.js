const mongoose= require("mongoose");
async function categoryconnect(url)
{
    return mongoose.connect(url)
}
module.exports={categoryconnect}