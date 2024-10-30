import { Button, FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {io} from "socket.io-client"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetAllMessageMutation } from '../store/user/userStore';
import { ImageDown, SendHorizontal } from 'lucide-react-native';
import * as ImagePicker from "expo-image-picker"

export default function MessageScreen({route}) {
  const[ socket,setSocket] = useState(null) //= io('http://10.0.2.2:3001', {token:"", transports: ['websocket'], reconnection: true });
  // Parametre olarak gönderilen verinin alıması işlemi .
  const userId = route.params.userId
  const [messageText,setMessageText] = useState("")
  const [messageList,setMessageList] = useState([])
  const [getAllMessage,responseAllMessage] = useGetAllMessageMutation()
  const [selectImage,setSelectImage] = useState(undefined)

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
    async function handlerImagePickerPress(){
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
          alert('Fotoğraf galerisine erişim izni verilmedi!');
      return;
      }

      let res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.Images,
          // allowsEditing:true,
          // aspect:[1,1],
          quality:1,
          base64:true
      })

      if(res.canceled){
          console.log("CANCELL",res.assets[0]);  
      }else{
        // Send message
        setSelectImage()
        console.log("RESSSSIMM");
        
        if(socket !== null){
          const token = await AsyncStorage.getItem("token")
          // Sunucuya mesaj gönderme olayı
          try{
            // console.log("MESAJ GİTTİ:",token);
            socket.emit('sendMessage', {text:res.assets[0].base64,isImage:true,token:token ,getUserId:userId})
            setMessageText("")
          }catch(err){
            console.log("EEEE::",err);
            // Toast message:
          }
        }else{
          console.log("NOTSOCKET:::::");
          
        }
        getMessageList()

      }
    }
  const connectSocket = async () => {
    const token = await AsyncStorage.getItem('token'); // Token'ı async storage'dan al
    
    let s = io('http://10.0.2.2:3001', {query:{token:token,userId:userId}, transports: ['websocket'], reconnection: true });;
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
      const token = await AsyncStorage.getItem("token")
      // Sunucuya mesaj gönderme olayı
      try{
        // console.log("MESAJ GİTTİ:",token);
        socket.emit('sendMessage', {text:messageText,isImage:false,token:token ,getUserId:userId})
        setMessageText("")
      }catch(err){
        console.log("EEEE::",err);
        // Toast message:
      }
    }else{
      console.log("NOTSOCKET:::::");
      
    }
    getMessageList()
  }
  
  async function getMessageList(){
    const dd=await getAllMessage({userId:userId})
    if(dd.data.isSucces){
      // console.log("IDDIDIID::",dd.data)
      // setMessageId(dd.data.data[0].messageId)
      setMessageList(dd.data.data)
    }
  }
    
    useEffect(() => {
      getMessageList()
    },[])

    useEffect(() => {  
      connectSocket();

      // Bağlantı kesilmeden önce Socket'i temizle
      // return () => {
      //   socket.disconnect();
      // }

    },[])
  return (
    <ImageBackground source={require("../assets/message_bg.jpg")} style={styles.mainContainer}>
      <View style={styles.subContainer} >
        <View style={styles.messageContainer}>
      {/* <ScrollView style={styles.scrollView} contentContainerStyle={{flexGrow:1}} > */}
          <FlatList
            data={messageList}
            renderItem={({item}) => <>
              {item.sender == userId &&<View style={styles.sendMessage} >
                  <View>
                    {item.isImage && <Image style={{width:100,height:100}} source={{uri:`http://10.0.2.2:3001/user/getImage/${item?.message}`}} />}
                    {!item.isImage && <Text style={styles.sendMessageText} >{item.message} {item.isImage}</Text>}
                    <Text style={styles.incomingMessageDate} >{formatDate(item.createAt)}</Text>
                  </View>
                </View>
              }
              {item.recipient == userId && <View style={styles.incomingMessage}>
                <View style={styles.sendMessageSubView}>
                    {item.isImage && <Image style={{width:100,height:100}} source={{uri:`http://10.0.2.2:3001/user/getImage/${item?.message}`}} />}
                    {!item.isImage && <Text style={styles.sendMessageText} >{item.message} {item.isImage}</Text>}
                    <Text style={styles.sendMessageDate} >{formatDate(item.createAt)}</Text>
                  </View>
                </View>}
            </>}
            
          
          />
      {/* </ScrollView> */}
        </View>

        <View style={styles.inputContainer} >
          <TextInput value={messageText} onChangeText={(text) => setMessageText(text)} style={styles.messageInput} placeholder='Message' />
          <Pressable onPress={sendMessage} style={({pressed}) => pressed ? [styles.sendButton,styles.press]:styles.sendButton} >
            <View style={styles.buttonText}><SendHorizontal color={"white"} /></View>
          </Pressable>

          <Pressable onPress={handlerImagePickerPress} style={({pressed}) => pressed ? [styles.sendButton,styles.press]:styles.sendButton} >
            <View style={styles.buttonText}><ImageDown color={"white"} /></View>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({

  mainContainer:{
    flex:1,
    height:"100%",
    width:"100%",
    paddingHorizontal:15,
    paddingVertical:15
  },
  scrollView:{
    flex:1,
    
  },
  subContainer:{
    flex:1,
    height:"100%",
    justifyContent:"space-between",
  },
  messageContainer:{
    gap:10,
    marginBottom:15,
    height:"90%",

  },
  sendMessage:{
    backgroundColor:"green",
    paddingHorizontal:10,
    paddingVertical:10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    marginEnd:"auto",
    color:"white",
    fontSize:16,
    marginBottom:5
  },
  sendMessageSubView:{
    gap:5
  },
  sendMessageText:{
    color:"white",
    fontSize:16,
    textAlign:"right"
  },
  sendMessageDate:{
    color:"white",
    fontSize:12,
  },

  incomingMessageText:{
    color:"white",
    fontSize:16,
    textAlign:"left"
  },
  incomingMessageDate:{
    color:"white",
    fontSize:12,
    textAlign:"right"
  },
  incomingMessage:{
    backgroundColor:"green",
    paddingHorizontal:10,
    paddingVertical:10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderBottomLeftRadius:10,
    marginStart:"auto",
    color:"white",
    fontSize:16,
    marginBottom:5
  },
  inputContainer:{
    flexDirection:"row",
    zIndex:10,
    height:"auto",
    backgroundColor:"white"
  },
  messageInput:{
    width:"75%",
    borderWidth:2,
    borderRadius:10,
    fontSize:16,
    paddingHorizontal:10,
    paddingVertical:5
  },
  sendButton:{
    backgroundColor:"green",
    width:"10%",
    textAlign:"center",
    justifyContent:"center",
    marginHorizontal:5,
    borderRadius:10,
    marginStart:"auto"
  },
  press:{
    opacity:0.75
  },
  buttonText:{
    textAlign:"center",
    color:"white",
    justifyContent:"center",
    alignItems:"center"
  }

})