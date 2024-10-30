import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({baseUrl:`http://10.0.2.2:3001`}),
    endpoints:(builder) => ({

        signup:builder.mutation({
            
            query:(body) => ({
                url:`/signup`,
                method:'POST',
                body:body
            })

        }),

        login:builder.mutation({
            query:(body) => ({
                url:`/login`,
                method:"POST",
                body:body
            })
        })



    })
})


export const {useSignupMutation,useLoginMutation} = authApi