import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from "js-cookie";


export const messageApi = createApi({
    reducerPath:"messageApi",
    baseQuery:fetchBaseQuery({
        baseUrl : "http://localhost:3001/",
        prepareHeaders(header){
            const token = Cookies.get("token")
        
            if(token){
                header.set("token",token)
            }
            return header
        },
    }),
    
    endpoints:(builder) => ({

        getAllMessage:builder.mutation({
            query:(body) => ({
                url:`/user/getAllMessage`,
                method:"POST",
                body:body
            })
        })


    })
})

export const { useGetAllMessageMutation } = messageApi