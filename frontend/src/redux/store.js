import {configureStore} from '@reduxjs/toolkit';
import {loginAPI, logoutAPI, searchAPI, deleteAPI,signupAPI } from './apis/user';
import {getUserStatsAPI,getUserProfileStatsAPI, getCompareStatsAPI} from './apis/stats'


export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [signupAPI.reducerPath]: signupAPI.reducer,
        [searchAPI.reducerPath]: searchAPI.reducer,
        [loginAPI.reducerPath]: loginAPI.reducer,
        [logoutAPI.reducerPath]: logoutAPI.reducer,
        [deleteAPI.reducerPath]: deleteAPI.reducer,
        [getUserStatsAPI.reducerPath]: getUserStatsAPI.reducer,
        [getUserProfileStatsAPI.reducerPath]: getUserProfileStatsAPI.reducer,
        [getCompareStatsAPI.reducerPath]: getCompareStatsAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            signupAPI.middleware,
            searchAPI.middleware,
            loginAPI.middleware,
            logoutAPI.middleware,
            deleteAPI.middleware,
            getUserStatsAPI.middleware,
            getUserProfileStatsAPI.middleware,
            getCompareStatsAPI.middleware
        ),
    });

export default store;