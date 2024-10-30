import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const userApi = createApi({
    reducerPath:"userApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`http://10.0.2.2:3001`,
        prepareHeaders:async(headers)=>{
            const token = await AsyncStorage.getItem("token")
            headers.append("token",token)
            return headers
        }
    }),
    
    endpoints:(builder) => ({

        getDeneme:builder.query({
            query(){
                return "/user/deneme"
            }
        }),

        getAllUser:builder.query({
            query(){
                return "/user/getAllUser"
            }
        }),

        getAllMessage:builder.mutation({
            query:(body)=>({
                url:`/user/getAllMessage`,
                method:"POST",
                body:body
            })
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

        
        
    })
 

})

export const {useGetDenemeQuery,useGetAllUserQuery,useGetAllMessageMutation,useGetUserProfileQuery,useUpdateProfileMutation} = userApi