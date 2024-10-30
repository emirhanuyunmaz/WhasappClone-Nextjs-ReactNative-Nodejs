const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const jwt = require("jsonwebtoken")
const http = require("http")
const fs = require("fs")
const {Server} = require("socket.io")
const server = http.createServer(app)
const uuid = require("uuid")
const io = new Server(server,{
    cors:{
        origin:"*",// React uygulamanın çalıştığı adres
        methods:["GET","POST","DELETE"]
    }
})
// Routes
const loginRoute = require("./routers/login")
const signupRoute = require("./routers/signup")
const userRoute = require("./routers/user")

// Models
const {MessageModel} = require("./models/messageModel")

dotenv.config() // .env dosyası için gerekli .
app.use(cors()) //Veri aktarımı için gerekli.
app.use(express.json({limit:"500mb"})) // bu sayede gelen verileri json olarak alabiliriz.
app.use(express.static('./uploads'));

async function mainDB(){
    // DB bağlantısı yapılması işlemi .
    mongoose.connect(`mongodb://127.0.0.1:27017/whatsapp`).then(() => console.log("mongoDB connect"))
}

mainDB()

app.use("/login",loginRoute)
app.use("/signup",signupRoute)
app.use("/user",userRoute)

io.use((socket, next) => {
    const token = socket.handshake.query.token;
    const userId = socket.handshake.query.userId
    
    if (token) {
      jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) {
            // console.log("SSSS:S::S:S:S:S:S:",err);
            
          return next(new Error('Authentication error'));
        }
        // console.log("DDD::",decoded.id);
        socket.recipientId = userId
        console.log("USERID:",userId);
        
        socket.user = decoded; // Token'dan kullanıcı bilgilerini al        
        next();
    });
} 
});



// Socket io ile veri dinleme işlemi .
io.on("connection", (socket) => {
    socket.join(socket.user.id)
    socket.on('sendMessage' ,async (messageData) => {
        try{

            // isImage => bu veriye göre kaydetme işlemi yapılacak.
            console.log("SOCKET:",socket.recipientId);
            console.log("RESİMMİ::",messageData.isImage);
            const decoded = jwt.decode(messageData.token,process.env.PRIVATE_KEY)            
            
            if(!messageData.isImage){
                // Kullanıcı mesaj gönderdiği zaman sunucunun mesajı kaydetme ve kullnıcılara göndermesi işlemi.
                
                const newMessage = new MessageModel({message:messageData.text,sender:decoded.id,recipient:messageData.getUserId,isImage:messageData.isImage})
                await newMessage.save()
                io.to(socket.recipientId).emit("receiveMessage",newMessage)
            }else{
                const imageName = uuid.v4()
                const filePath = __dirname + `/uploads/${imageName}.png`
                console.log("File Path:",filePath);
                
                fs.writeFile(filePath , messageData.text.split(";base64,").pop(), {encoding: 'base64'}, function(err) {
                    console.log('File created');
                });
                const newMessage = new MessageModel({message:`${imageName}.png`,sender:decoded.id,recipient:messageData.getUserId,isImage:messageData.isImage})
                await newMessage.save()
                io.to(socket.recipientId).emit("receiveMessage",newMessage)
            }
            // io.to(socket.user.id).emit("receiveMessage",newMessage)
        }catch(err){
            console.log("Bir hata socket io:",err);
            
        }
    })


    socket.on('connect_error', (err) => {
        console.log('Connection Error:', err); // Bağlantı hatasını logla
      });
      
      socket.on('error', (err) => {
        console.log('Socket Error:', err); // Socket hatalarını logla
      });

    socket.on("disconnect" , () =>{
        console.log("Bir kullanıcı ayrıldı.",socket.id);
    })

})



const port = process.env.PORT || 5000

server.listen(port,() => {
    console.log(`Listen port:${port}`);
    
})
