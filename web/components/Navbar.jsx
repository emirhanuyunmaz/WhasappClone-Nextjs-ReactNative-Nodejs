'use client'

import Cookies from "js-cookie"
import { useEffect } from "react";

/**
 * 2 -> Anasayfa => kullanıcı isimleri ve yan tarafta mesajları bulunacak
 * 3 -> Mesaj kısmı => Socket io ile yapılacak .
 * 4 -> RTK query ile 401 hatasında login ekranına yönlendirme yapılcak.  
 * 
 */



export default function Navbar(){
    let token = Cookies.get("token")
    
    useEffect(() => {
        token = Cookies.get("token")
        console.log("TOKEN::",(typeof token =="undefined"));
    },[token])

    return(<nav className="bg-green-700 px-10 py-3 text-white flex items-center justify-between">
        <div>
            <a href="#" className="text-xl font-bold border-b-2 border-green-700 hover:border-white ">Whatsapp</a>
        </div>
        <div className="flex gap-3">
            {/* {typeof(token) !== "undefined" && <a href="/profile" >Profile</a> }
            {typeof(token) == "undefined"  && <><a href="/login" className="text-white">Login</a>
            <a href="/signup" className="">Signup</a></>}
            {typeof(token) != "undefined" && <a href="/logout">Logout</a>} */}
        </div>
    </nav>)
}