import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const getUserStatsAPI = createApi({
  reducerPath: "getUserStatsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userStats/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }, 
  }),
  endpoints: (builder) => ({
    getUserStats: builder.query({
      query: (userName) => ({
        url: `stats?userName=${userName}`,
        method: "GET",
      }),
    }),
  }),
});


export const getUserProfileStatsAPI = createApi({
  reducerPath: 'getUserProfileStatsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userStats/`, // Update base URL accordingly
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('jwtToken'); // Get token from localStorage
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Set Authorization header
      }
      return headers;
    },    
  }),
  endpoints: (builder) => ({
    getUserProfileStats: builder.query({
      query: (userName) => ({
        url: `profile-stats?userName=${userName}`, 
        method: 'GET',
      }),
    }),
  }),
});

export const getCompareStatsAPI = createApi({
  reducerPath: 'getCompareStatsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userStats/`,
  }),
  endpoints: (builder) => ({
    getCompareStats: builder.query({
      query: ({ userName1, userName2 }) => ({
        url: 'compareStats',
        params: { userName1, userName2 },
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserStatsQuery } = getUserStatsAPI;
export const { useGetUserProfileStatsQuery } = getUserProfileStatsAPI;
export const { useGetCompareStatsQuery } = getCompareStatsAPI;