import { StyleSheet, Text, View ,Image, Pressable} from 'react-native'
import React from 'react'

export default function UserCard({user,navigation}) {

    function userOnPress(){
        navigation.navigate("Message",{userId:user._id})
    }
    
  return (
    <View style={styles.container} >
        <Pressable onPress={userOnPress} style={({pressed}) => pressed ? [styles.pressed,styles.cardBG] : styles.cardBG}>
            <Image style={styles.userImage} source={{uri:`http://10.0.2.2:3001/user/getImage/${user?.image}`}} />
            <Text style={styles.userName} >{user?.name}</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        marginVertical:10,
        paddingHorizontal:10,
        borderRadius:20,
        flexDirection:"row",
        alignItems:"center",
        gap:5
    },
    pressed:{
        opacity:0.7
    },
    cardBG:{
        flex:1,
        gap:10,
        borderRadius:20,
        paddingHorizontal:10,
        paddingVertical:5,
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#B1D690"
    },
    userImage:{
        width:50,
        height:50,
        borderRadius:100
    },
    userName:{
        fontSize:20,
        color:"white"
    }

})