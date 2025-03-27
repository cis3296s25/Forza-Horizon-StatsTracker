import {configureStore} from '@reduxjs/toolkit';
import {getUserStatsAPI, loginAPI, logoutAPI, searchAPI, deleteAPI,signupAPI } from './apis/user';


export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [signupAPI.reducerPath]: signupAPI.reducer,
        [searchAPI.reducerPath]: searchAPI.reducer,
        [loginAPI.reducerPath]: loginAPI.reducer,
        [logoutAPI.reducerPath]: logoutAPI.reducer,
        [deleteAPI.reducerPath]: deleteAPI.reducer,
        [getUserStatsAPI.reducerPath]: getUserStatsAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            signupAPI.middleware,
            searchAPI.middleware,
            loginAPI.middleware,
            logoutAPI.middleware,
            deleteAPI.middleware,
            getUserStatsAPI.middleware
        ),
    });

export default store;