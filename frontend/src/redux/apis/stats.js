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

export const { useGetUserStatsQuery } = getUserStatsAPI;