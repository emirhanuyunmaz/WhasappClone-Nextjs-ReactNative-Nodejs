const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {

    try{
        const token = req.headers.token
        jwt.verify(token,process.env.PRIVATE_KEY,function(err,decoded){
            if(err){
                res.status(401).json({message:err,isSucces:false})
            }
            else{
                req.headers.id = decoded.id
                next()
            }
        })
    }catch(err) {
        console.log("Kullanıcı bilgileri kontrol edilirken bir hata ile karşılaşıldı::",err);
        res.status(401).json({message:err,isSucces:false})
    }
}

module.exports = {authMiddleware}