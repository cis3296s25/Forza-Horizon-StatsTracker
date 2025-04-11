import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API for Signup (Mutation)
export const signupAPI = createApi({
  reducerPath: "signupApi",
  // base URL for the API
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userAccount/`,
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "newUser",
        method: "POST",  
        body,            
      }),
    }),
  }),
});

// API for Search (Query)

export const searchAPI = createApi({
  reducerPath: "searchApi",
  // base URL for the API
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userAccount/`,
  }),
  endpoints: (builder) => ({
    search: builder.mutation({
      query: (body) => ({
        url: "search", 
        method: "POST", 
        body,     
      }),
    }),
  }),
});

export const loginAPI = createApi({
  reducerPath: "loginApi",
  // base URL for the API
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userAccount/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),
  }),
});

// logout API
export const logoutAPI = createApi({
  reducerPath: "logoutApi",
  // base URL for the API
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userAccount/`,
  }),
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
  }),
});

// delete API
export const deleteAPI = createApi({
  reducerPath: "deleteApi",
  // base URL for the API
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userAccount/`,
  }),
  endpoints: (builder) => ({
    deleteUser: builder.mutation({
      query: (body) => ({
        url: "delete",
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const getUsersListAPI = createApi({
  reducerPath: "getUsersListApi",
  // base URL for the API
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userAccount/`,
  }),
  endpoints: (builder) => ({
    getUsersList: builder.query({
      query: (prefix) => ({
        url: `list?prefix=${prefix}`,
        method: "GET",
      }),
    }),
  }),
});


export const { useSearchMutation } = searchAPI; 
export const { useSignupMutation } = signupAPI;
export const { useLoginMutation } = loginAPI;
export const { useLogoutMutation } = logoutAPI;
export const { useDeleteUserMutation } = deleteAPI;
export const { useGetUsersListQuery } = getUsersListAPI;