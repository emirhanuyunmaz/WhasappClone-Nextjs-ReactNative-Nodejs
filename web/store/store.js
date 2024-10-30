import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './user/userApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import { messageApi } from './message/messageApi';


export const store = configureStore({

    reducer:{
        [userApi.reducerPath] : userApi.reducer,
        [messageApi.reducerPath] : messageApi.reducer
    },

    middleware:(getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(userApi.middleware).concat(messageApi.middleware)
    }
})

setupListeners(store.dispatch)