'use client'
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { useEffect, useState } from "react";
import { useGetUserProfileQuery, useUpdateProfileImageMutation, useUpdateProfileMutation } from "@/store/user/userApi";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name Surname must be at least 2 characters.",
    }),
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
      }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
  })

export default function Page(){
    const {toast} = useToast()
    const userProfile = useGetUserProfileQuery()
    const [updateProfile,responseUpdateProfile] = useUpdateProfileMutation()
    const [updateProfileImage,responseUpdateProfileImage] = useUpdateProfileImageMutation()
    const [image,setImage] = useState()
    
    const [updateImage,setUpdateImage] = useState()
    let form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email:"",
          password:"",
        },
    })

    async function imageUpdate(event){

        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = () =>{
            setUpdateImage(reader.result)
        }
    }

    async function updateImageSend(){
        
        const body = {
            image : updateImage
        }
        const res = await updateProfileImage(body)

        console.log(res);
        
        if(res.data.isSucces){
            toast({
                description: "Succes Update Image",
            })
        }else{
            toast({
                variant: "destructive",
                description: "ERROR TRY AGAIN",
            })
        }
    }
    
    async function onSubmit(values) {
    
        console.log(values)
        console.log("İMAGE:::",image)
        if(image){
            console.log("AAAAA");

            const body = {
                name:values.name,
                email:values.email,
                password:values.password,
                // image:image
            }
            const res = await updateProfile(body)
            
            if(res.data.isSucces){                
                toast({
                    description: "Succes",
                })
            }
            
        }else{
            toast({
                variant: "destructive",
                description: "Image is emty",
            })

        }
    }

    function userInput(user){
        form.setValue("email",user.email)
        form.setValue("name",user.name)
        form.setValue("password",user.password)
        setImage(user.image)
    }
    
    useEffect(() => {
        if(userProfile.isSuccess){
            console.log(userProfile.data.data);
            userInput(userProfile.data.data)
        }
    },[userProfile.isFetching,userProfile.isSuccess,userProfile.isError])

    useEffect(() => {
        if(updateImage){
            updateImageSend()
        }
    },[updateImage])

    return (<div className="min-h-[93vh] flex flex-col md:flex-row  justify-center items-center w-3/4">
        
        <div className="w-full flex flex-col justify-center items-center md:justify-start md:gap-3 md:items-end pe-20">
            <label className="border-2 w-32 h-32 flex justify-center items-center cursor-pointer rounded-xl" htmlFor="user_profile_image">
                {image && !updateImage ?<img className="w-full" src={`http://localhost:3001/user/getImage/${image}`} /> : !updateImage &&<Camera/> }
                {updateImage && <img className="w-full" src={updateImage} />} 
            </label>
            <input onChange={(event) => imageUpdate(event)} id="user_profile_image" type="file" className="hidden" />
        </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full ms-20 ">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name Surname</FormLabel>
                    <FormControl>
                        <Input placeholder="Name Surname" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                )}
                />

                
                <Button className="w-full mt-5" type="submit">Update</Button>
            </form>
            </Form>

    </div>)
}