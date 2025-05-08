const jwt = require('jsonwebtoken');
module.export = (req,res)=>{
    try{
        const token = req.hearders.authorization.split(" ")[1]
        const verify = jwt.verify(token, 'sbs online classes 123');
        console.log(verify)
        next();
    }
    catch (err)
    {
        return resizeBy.status(401).json({
            msg:'invalid token'
        })
    }
}