'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetAllMessageMutation } from "@/store/message/messageApi"
import { useGetUserListQuery } from "@/store/user/userApi"
import Cookies from "js-cookie"
import { ImageDown, Search, SendHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import {io} from "socket.io-client"


export default function Page(){
    const[ socket,setSocket] = useState(null)
    const [messageText,setMessageText] = useState("")
    const [searchText,setSearchText] = useState("")
    const [allUser,setAllUser] = useState([])
    const [userId,setUserId] = useState("")
    const [messageList,setMessageList] = useState([])
    const getAllUser = useGetUserListQuery()
    const [allMessage,responseAllMessage] = useGetAllMessageMutation() 
    const [image,setImage] = useState()
    function formatDate(date) {
        let d =new Date(date)
        let datePart = [
        d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()
        ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
        let timePart = [
        d.getHours(),
        d.getMinutes(),
        ].map((n, i) => n.toString().padStart(2, "0")).join(":");
        return timePart;
    }

    const connectSocket = async () => {
        const token = Cookies.get('token'); // Token'ı async storage'dan al
        
        let s = io('http://localhost:3001/', {query:{token:token,userId:userId}, transports: ['websocket'], reconnection: true });;
        setSocket(s)
        
        // Alıcıya mesaj geldiğinde dinle
        s.on('receiveMessage', (newMessage) => {
            console.log("NEW MESSAGE::",newMessage);
            setMessageList((prevMessages) => [...prevMessages, newMessage]);
          // }
        });
    };
    async function sendMessage(){
        if(socket !== null){
          const token = Cookies.get("token")
          // Sunucuya mesaj gönderme olayı
          try{
            // console.log("MESAJ GİTTİ:",token);
            socket.emit('sendMessage', {text:messageText,token:token ,getUserId:userId})
            setMessageText("")
          }catch(err){
            console.log("EEEE::",err);
            // Toast message:
          }
        }else{
          console.log("NOTSOCKET:::::");
          
        }
        getAllMessage()
        
      }

      function imageUpdate(event){

        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = () =>{
            // setImage(reader.result)
            if(socket !== null){
                const token = Cookies.get("token")
                // Sunucuya mesaj gönderme olayı
                try{
                  // console.log("MESAJ GİTTİ:",token);
                  socket.emit('sendMessage', {text:reader.result,isImage:true,token:token ,getUserId:userId})
                  setMessageText("")
                }catch(err){
                  console.log("EEEE::",err);
                  // Toast message:
                }
              }else{
                console.log("NOTSOCKET:::::");
                
              }
              getAllMessage()
        }
        
        
    }



    async function getAllMessage(){
        const body ={
            userId:userId
        }
        const res = await allMessage(body)
        setMessageList(res.data.data)
        console.log(res.data)
        
    }

    useEffect(() => {
        if(userId !== ""){
            getAllMessage()
        }
    },[userId]) 

    useEffect(() => {

        if(getAllUser.isSuccess){
            console.log(getAllUser.data);
            setAllUser(getAllUser.data.data)
        }

    },[getAllUser.isSuccess,getAllUser.isFetching,getAllUser.isError])


    useEffect(() => {  
        if(userId !== ""){
            connectSocket();
  
        }
        // Bağlantı kesilmeden önce Socket'i temizle
        // return () => {
        //   socket.disconnect();
        // }
  
      },[userId])

    return(<div className="flex min-h-[93vh]">
        
        <div className="w-1/3 bg-gray-200 pt-5">
            <div className="mx-10 flex gap-1">
                <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} className=" mx-auto mb-5" placeholder="Search" />
                <Button variant="outline"><Search /></Button>
            </div>

            {/* ::USER:: */}
            {getAllUser.isSuccess && allUser.map((user) => {
                return <button onClick={() => setUserId(user._id)} key={user._id} className="w-[80%] text-white flex items-center gap-3 bg-green-400 rounded-xl mx-10 px-3 py-1 hover:bg-green-500 duration-300 cursor-pointer ">
                <img src={`http://localhost:3001/user/getImage/${user.image}`} className="w-16 h-16 rounded-full" alt="" />
                <p>{user.name}</p>
            </button>
            }) }
            
        
        </div>

        <div className="w-2/3 ">
            {/* Message */}
            
            <div  className="bg-[url('/message_bg.jpg')] flex flex-col gap-3 max-h-[85vh] min-h-[85vh] bg-orange-200 overflow-y-auto pt-3 px-3">
            {messageList.map((message) => {
                return <div className="flex" key = {message._id}>
                    {/* GET MESSAGE */}
                    {userId == message.sender && <div className="text-white flex flex-col me-auto bg-green-600 py-3 px-6 rounded-tr-xl rounded-br-xl rounded-tl-xl ">
                        {message.isImage && <img src={`http://localhost:3001/user/getImage/${message.message}`} className="w-20 h-20 rounded-xl" alt="" />}
                        {!message.isImage && <p className="text-left">{message.message}</p>}
                        <p className="text-sm text-right">{formatDate(message.createAt)}</p>
                    </div>}

                    {/* SEND MESSAGE */}
                    {userId == message.recipient &&  <div className="text-white flex flex-col ms-auto bg-green-600 py-3 px-6 rounded-tr-xl rounded-bl-xl rounded-tl-xl ">
                        {message.isImage && <img src={`http://localhost:3001/user/getImage/${message.message}`} className="w-20 h-20 rounded-xl" alt="" />}
                        {!message.isImage && <p className="text-left">{message.message}</p>}
                        <p className="text-sm text-left">{formatDate(message.createAt)}</p>
                    </div>}
                </div >
            })}
                

            </div>

            {/* İnput */}
            <div className=" flex w-[95%] mx-auto my-3  gap-3">
                <Input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Message" />
                <Button onClick={sendMessage} variant="outline"><SendHorizontal /></Button>
                <Button variant="outline" className="cursor-pointer" ><label className="cursor-pointer" htmlFor="user_profile_image"><ImageDown /></label></Button>
                <input onChange={(event) => imageUpdate(event)} id="user_profile_image" type="file" className="hidden" />
            </div>

        </div>

    </div>)
}