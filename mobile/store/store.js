import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './auth/authStore'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from './user/userStore'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]:authApi.reducer,
    [userApi.reducerPath]:userApi.reducer,
  },

  middleware:(getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authApi.middleware).concat(userApi.middleware)
  }
})

setupListeners(store.dispatch)