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
import { useSignupMutation } from "@/store/user/userApi";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'


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
    passwordAgain: z.string().min(6, {
    message: "Username must be at least 6 characters.",
    }),
  }).refine(data => data.password === data.passwordAgain,{
    message:"The password must mutch.",
    path:["passwordAgain"] 
  })

export default function Page(){
    const { toast } = useToast()
    const router = useRouter()
    const [signup,responseSignup] = useSignupMutation()
    const [image,setImage] = useState()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email:"",
          password:"",
          passwordAgain:""
        },
      })

    async function onSubmit(values) {
    
        console.log(values)
        console.log("İMAGE:::",image)
        if(image){
            console.log("AAAAA");

            const body = {
                name:values.name,
                email:values.email,
                password:values.password,
                image:image
            }
            const res =await signup(body)
            
            if(res.data.succes){
                router.push("/login")
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

    function imageUpdate(event){

        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = () =>{
            setImage(reader.result)
        } 
    }

    
    return(<div className="min-h-[93vh] flex flex-col gap-3 justify-center items-center">
        <div className="w-4/5 md:w-1/3 mx-auto">
            <label className="border-2 w-32 h-32 flex justify-center items-center cursor-pointer rounded-xl" htmlFor="user_profile_image">
                {image ?<img src={image} /> :<Camera/> }
            </label>
            <input onChange={(event) => imageUpdate(event)} id="user_profile_image" type="file" className="hidden" />
        </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-4/5 md:w-1/3">
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
                            <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="passwordAgain"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password Again</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Password Again" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                )}
                />
                <Button className="w-full" type="submit">Submit</Button>
            </form>
            </Form>


    </div>)
}