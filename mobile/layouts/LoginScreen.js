import { Pressable, StyleSheet, Text, TextInput, View  } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useLoginMutation } from '../store/auth/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({navigation}) {
    
    const [loginUser,responseLogin] = useLoginMutation()
    const [Token,setToken] = useState()
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
          email:"",
          password:"",          
        }
      });

    async function onSubmit(data) {
        // veri gönderme işlemi ve 
        // console.log("RESRESRES::",responseLogin.isSuccess);
        await loginUser(data)
    }
    function signup(){
        navigation.navigate("Signup")
    }

    async function tokenSave(token,messageId){
        await AsyncStorage.setItem("token",token)
        await AsyncStorage.setItem("messageId",messageId)
        console.log("Message Id",messageId);
        
    }

    async function getToken(){
        const data = await AsyncStorage.getItem("token")
        console.log(data);
        setToken(data)
        
    }

    useLayoutEffect(() => {
        getToken()
    },[])

    useEffect(() => {
        if(responseLogin.isSuccess){
            console.log("İşlem başarılı");
            tokenSave(responseLogin.data.token,responseLogin.data.messageId)
            //Async storage token bilgisine göre yönlendirme işlemi.
            navigation.navigate("Drawer") 
        }
        
    },[responseLogin.isSuccess,responseLogin.data])

    if(Token){
        navigation.navigate("Drawer")
    }

  return (
    <View style={styles.mainContainer} >
        {/* <View style={styles.subContainer} > */}
        <Text style={styles.title} >LOGIN</Text>
        <Controller control={control} rules={{required:true}}
            render={({field: { onChange, onBlur, value } }) => (
            <TextInput
                autoCapitalize="none"
                style={styles.input}
                placeholder='Email'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                />)}
                name='email'
        />
        {errors.email && <Text style={styles.errorInput}>Email is required.</Text>}
                
        <Controller control={control} rules={{required:true}}
            render={({field: { onChange, onBlur, value } }) => (
            <TextInput
                autoCapitalize="none"
                style={styles.input}
                placeholder='Password'
                onBlur={onBlur}
                secureTextEntry
                onChangeText={onChange}
                value={value}
                />)}
                name='password'
        />
        {errors.password && <Text style={styles.errorInput}>Password is required.</Text>}
        

        
        <Pressable onPress={handleSubmit(onSubmit)} style={({pressed}) => pressed ? [styles.button,styles.buttonPress]:styles.button}>
            <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={signup} >
            <Text style={styles.signupText} >SignUp</Text>
        </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        gap:15
    },
    title:{
        fontSize:32,
        fontWeight:"bold"
    },
    
    input:{
        width:"80%",
        borderWidth:2,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
        fontSize:18
    },
    errorInput:{
        color:"red",
        marginStart:15
    },
    button:{
        backgroundColor: "green",
        alignItems:"center",
        marginHorizontal:"auto",
        paddingHorizontal:32,
        paddingVertical:6,
        borderRadius:10
        
    },
    buttonPress:{
        opacity:0.75
    },
    buttonText:{
        fontSize:18,
        fontWeight:"bold",
        color:"white"
    },
    signupText:{
        fontSize:16,
        borderBottomWidth:2
    }
})