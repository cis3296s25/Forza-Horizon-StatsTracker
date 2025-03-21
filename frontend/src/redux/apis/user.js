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


export const { useSearchMutation } = searchAPI; 
export const { useSignupMutation } = signupAPI;
