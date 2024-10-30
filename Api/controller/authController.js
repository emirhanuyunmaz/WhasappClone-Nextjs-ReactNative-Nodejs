
const {UserModel} = require("../models/userModel")
const fs = require("fs")
const uuid = require("uuid")
const jwt = require("jsonwebtoken")

const accessToken = (id) => {
    const token = jwt.sign({ id:id , exp: Math.floor(Date.now() / 1000) + (60 * 60 * 30) }, process.env.PRIVATE_KEY)
    return token
}


const loginController =async (req,res) => {
    try{
        const {email,password} = req.body 
        console.log("Login Controller ....");
        console.log("Data:::",req.body);
        const user = await UserModel.findOne({email:email,password:password})
        console.log(user);

        if(user === null){
            res.status(404).json({massage:"User not found",succes:false})
        }else{
            const token = accessToken(user._id)
            // console.log("TOKEN::",token);
            
            res.status(201).json({token:token,messageId:user.messageId,message:"Succes",succes:true})
        }

    }catch(err) {
        console.log("Giriş yapılırken bir hata ile karşılaşıldı.",err);
        res.status(401).json({succes:false,message:err})
        
    }
}

const signupController = async (req,res) => {
    // console.log(req.body);
    
    const imageName = uuid.v4()
    const filePath = __dirname + "/.." + `/uploads/${imageName}.png`
    console.log("File Path:",filePath);
    
    fs.writeFile(filePath , req.body.image.split(";base64,").pop(), {encoding: 'base64'}, function(err) {
        console.log('File created');
    });
    
    try{

        const {name,email,password} = req.body
        const newUser = new UserModel({
            name:name,
            email:email,
            image:imageName+".png",
            password:password,
        })

        await newUser.save().then(() => console.log("User Save"))

        res.status(201).json({succes:true})
    }catch(err) {

        console.log("Kayıtt olurken bir hata ile karşılaşıldı.",err);
        res.status(401).json({message:err,succes:false})
        
    }
}


module.exports = {loginController,signupController}