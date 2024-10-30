const path = require("path")
const fs = require("fs")
const {UserModel} = require("../models/userModel")
const {MessageModel} = require("../models/messageModel")

const getAllUser = async(req,res) => {

    try{
        const id = req.headers.id
        console.log(req.headers.id);
        // find işlemi içerisindeki filtre sayesinde gelen id bilgisi dışındaki veriyi getiriyor.
        // Gelecek olan verileri filtreleme işlemi .(.select)
        const data = await UserModel.find({"_id":{ $ne:id }}).select("_id name email image ")
        console.log("DDD:DDD:D:D:D:",data);
        
        res.status(201).json({message:"Succes",isSucces:true,data:data})
    }catch(err) {
        console.log("Kullanıcılar çekilirken bir hata ile karşılaşıldı .",err);
        
        res.status(404).json({message:err,isSucces:false})
    }
}

const getAllMessage = async (req,res) => {
    try{

        // console.log("Kullanıcı id:",req.headers.id);
        // console.log("Mesaj gönderilen id :",req.body.userId);
        
        const user1 = req.headers.id
        const user2 = req.body.userId
        const data = await MessageModel.find({$or:[{sender:user1,recipient:user2},{sender:user2,recipient:user1}]})
        // console.log("DATADATA::::",data);
        
        res.status(201).json({message:"succes",isSucces:true,data:data})
    }catch(err){
        console.log("Messajları çekerken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,isSucces:false})
    }
}

const pushUserImage = async (req,res) => {
    console.log("Resim çekme işlemi");
    
    try{
        const name = req.params.name
        if(name){
            res.status(201).sendFile(path.join(__dirname+`/../uploads/${name}`))
        }
    }catch(err) {
        res.status(404).json({message:err,isSucces:false})
    }
}

const getProfile = async (req,res) => {
    try{
        const id = req.headers.id
        console.log("Profile id::",id);
        // Kullanıcı bilgilerini çekme işlemi.
        const user = await UserModel.findById(id)
        res.status(201).json({message:"Succes",isSucces:true,data:user})
    }catch(err) {
        console.log("Kullanıcı profili çekilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,isSucces:false})
        
    }
}

const updateProfile = async (req,res) => {

    try{
        const id = req.headers.id
        const {name,email,password} = req.body
        console.log("UPDATE ID:",id);

        await UserModel.findByIdAndUpdate(id,{
            name:name,
            email:email,
            password:password
        })
        
        res.status(201).json({message:"succes",isSucces:true})
    }catch(err){
        console.log("Kullanıcı profili güncellenirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,isSucces:false})
    }
}

const imageUpdate = async (req,res) => {
    console.log("Resim güncelleme için istek atıldı.",req.body.image);
    
    try{
        const {image} = req.body
        if(image){
            const id = req.headers.id
            console.log("RESİM::",req.body.image);
            
            const user = await UserModel.findById(id)

            const filePath = __dirname + "/.." + `/uploads/${user.image}`
            console.log("File Path:",filePath);
            
            fs.writeFile(filePath , req.body.image.split(";base64,").pop(), {encoding: 'base64'}, function(err) {
                console.log('File created');
            });

            res.status(201).json({message:"succes",isSucces:true})
        }
    }catch(err){
        console.log("REsim güncellenirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,isSucces:false})
        
    }
}


module.exports = {getAllUser,pushUserImage,getAllMessage,getProfile,updateProfile,imageUpdate}