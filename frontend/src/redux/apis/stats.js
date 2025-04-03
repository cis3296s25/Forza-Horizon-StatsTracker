import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const getUserStatsAPI = createApi({
  reducerPath: 'getUserStatsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userStats/`, // Update base URL accordingly
  }),
  endpoints: (builder) => ({
    getUserStats: builder.query({
      query: (userName) => ({
        url: `stats?userName=${userName}`, 
        method: 'GET',
      }),
    }),
  }),
});

export const getUserProfileStatsAPI = createApi({
  reducerPath: 'getUserProfileStatsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userStats/`, // Update base URL accordingly
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

export const { useGetUserStatsQuery } = getUserStatsAPI;
export const { useGetUserProfileStatsQuery } = getUserProfileStatsAPI;