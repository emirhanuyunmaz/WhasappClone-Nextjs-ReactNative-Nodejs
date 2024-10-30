'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
 
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { useLoginMutation } from "@/store/user/userApi";
import { useRouter } from "next/navigation";
import { setCookie } from 'cookies-next';



const formSchema = z.object({
    email: z.string().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
  })
export default function Page(){
    const router = useRouter()
    const [login , responseLogin] = useLoginMutation()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password:"",
        },
    })
    async function onSubmit(values) {
        console.log(values)
        const res = await login(values)
        if(res.data.succes){
            const token = res.data.token
            setCookie('token',token);
            router.push("/message")
        }
    }

    return(<div className=" flex flex-col gap-3 min-h-[93vh] justify-center items-center ">
        <h2 className="text-5xl">Login</h2>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-4/5 flex flex-col md:w-1/3">
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        
    </div>)
} 