import {configureStore} from '@reduxjs/toolkit';
import { searchAPI, signupAPI } from './apis/user';


export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [signupAPI.reducerPath]: signupAPI.reducer,
        [searchAPI.reducerPath]: searchAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            signupAPI.middleware,
            searchAPI.middleware
        ),
    });

export default store;