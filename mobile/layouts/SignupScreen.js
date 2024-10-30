import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View , ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import { useForm, Controller } from "react-hook-form";
import { useSignupMutation } from '../store/auth/authStore';


export default function SignupScreen({navigation}) {

    const [selectImage,setSelectImage] = useState(undefined)

    const [signup,responseSignup] = useSignupMutation()

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
          name:"",
          email:"",
          password:"",
          passwordAgain:"",
          
        }
      });
      async function onSubmit (data) {
        
        const signupUser = {
            name:data.name,
            email:data.email,
            password:data.password,
            image:selectImage.base64
        }
        await signup(signupUser)
        
      }

      useEffect(() => {
        if(responseSignup.isSuccess){
            // console.log("SSS::XXXXX:",responseSignup.status);
            navigation.navigate("Login")
        }
        
      },[responseSignup.isSuccess,responseSignup.isError])

    async function handlerImagePickerPress(){
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Fotoğraf galerisine erişim izni verilmedi!');
        return;
        }

        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[1,1],
            quality:1,
            base64:true
        })

        if(!res.canceled){
            // console.log(res.assets[0]);
            
            setSelectImage(res.assets[0])
        }
    }

  return (
    <View style={styles.mainContainer}>
        <ScrollView style={{flex:1,flexGrow:1,width:"100%",height:"100%"}} >
        <View style={styles.subContainer}>
                <Text style={styles.mainText} >Signup</Text>
                <TouchableOpacity onPress={() => handlerImagePickerPress()} >
                    <Image  source={selectImage === undefined ? require("../assets/default_user.jpg") : {uri:selectImage.uri}} style={styles.image} />
                </TouchableOpacity>
      
                <Controller control={control} rules={{required:true}}
                    render={({field: { onChange, onBlur, value } }) => (
                    <TextInput
                        autoCapitalize="none"
                        style={styles.input}
                        placeholder='Name'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                       />)}
                       name='name'
                />
                {errors.name && <Text style={styles.errorInput}>Name is required.</Text>}

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
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                       />)}
                       name='password'
                />
                {errors.password && <Text style={styles.errorInput} >Password is required.</Text>}


                <Controller control={control} rules={{required:true}}
                    render={({field: { onChange, onBlur, value } }) => (
                    <TextInput
                        autoCapitalize="none"
                        style={styles.input}
                        placeholder='Password Again'
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                       />)}
                       name='passwordAgain'
                />
                {errors.passwordAgain && <Text style={styles.errorInput}>Password Again is required.</Text>}

                <Pressable onPress={handleSubmit(onSubmit)} style={({pressed}) => pressed ? [styles.button,styles.buttonPress]:styles.button}>
                    <Text style={styles.buttonText}>Signup</Text>
                </Pressable>
            
        </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    mainText:{
        fontSize:32,
        fontWeight:"bold",
        marginBottom:32,
        marginHorizontal:"auto"
    },
    subContainer:{
        flex:1,
        width:"80%",
        gap:10,
        marginHorizontal:"auto"

    },
    image:{
        width:150,
        height:150,
        marginHorizontal:"auto",
        borderRadius:100
    },
    input:{
        flex:1,
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
    }

})