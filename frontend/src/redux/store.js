import {configureStore} from '@reduxjs/toolkit';
import {loginAPI, deleteAPI, logoutAPI, searchAPI, signupAPI } from './apis/user';



export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [signupAPI.reducerPath]: signupAPI.reducer,
        [searchAPI.reducerPath]: searchAPI.reducer,
        [loginAPI.reducerPath]: loginAPI.reducer,
        [logoutAPI.reducerPath]: logoutAPI.reducer,
        [deleteAPI.reducerPath]: deleteAPI.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            signupAPI.middleware,
            searchAPI.middleware,
            loginAPI.middleware,
            logoutAPI.middleware,
            deleteAPI.middleware
        ),
    });

export default store;