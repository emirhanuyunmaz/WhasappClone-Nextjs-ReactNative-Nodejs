import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from "js-cookie"

export const userApi = createApi({
    reducerPath:"userApi",
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
        signup:builder.mutation({
            query:(body) => ({
                url:"/signup",
                method:"POST",
                body:body
            })
        }),

        login:builder.mutation({
            query:(body) => ({
                url:"/login",
                method:"POST",
                body:body
            })
        }),

        getUserList:builder.query({
            query:() => {
                return "/user/getAllUser/"
            }
        }),

        getUserProfile:builder.query({
            query:() => {
                return `/user/profile`
            }
        }),

        updateProfile:builder.mutation({
            query:(body) => ({
              url:`/user/updateProfile`,
              method:"POST",
              body:body
            } )
        }),

        updateProfileImage:builder.mutation({
            query:(body) => ({
              url:`/user/updateProfileImage`,
              method:"POST",
              body:body
            } )
        }),
    })
})

export const {useSignupMutation,useLoginMutation,useGetUserListQuery,useGetUserProfileQuery,useUpdateProfileMutation,useUpdateProfileImageMutation} = userApi