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
  tagTypes: ['UserStats'],
  endpoints: (builder) => ({
    getUserStats: builder.query({
      query: (userName) => ({
        url: `stats`,
        method: "GET",
        params: { userName },
      }),
      providesTags: (result, error, userName) => [
        { type: 'UserStats', id: userName },
      ],
    }),
  }),
});


export const getAllUserStatsAPI = createApi({
  reducerPath: "getAllUserStatsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userStats/`, 
  }),
  endpoints: (builder) => ({
    getAllUserStats: builder.query({
      query: () => ({
        url: "allUserStats", 
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
        //url: `profile-stats?userName=${userName}`, 
        url: `profile-stats`,
        method: 'GET',
        params: {userName},
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
       // params: { userName1, userName2 },
        method: 'GET',
        params: {userName1, userName2},
      }),
    }),
  }),
});


export const updateUserStatsAPI = createApi({
  reducerPath: "updateUserApi",
  // base URL for the API
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/userStats/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('jwtToken'); // Get token from localStorage
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Set Authorization header
      }
      return headers;
    },    
  }),
  tagTypes: ['UserStats'],
  endpoints: (builder) => ({
  updateUserStats: builder.mutation({
    query: (body) => ({
      url: "updateStats",
      method: "PUT",
      body,
    }),
    invalidatesTags: (result, error, arg) => [{ type: 'UserStats', id: arg.userName }],
  }),
}),
});


export const { useGetUserStatsQuery } = getUserStatsAPI;
export const { useGetUserProfileStatsQuery } = getUserProfileStatsAPI;
export const { useGetCompareStatsQuery,useLazyGetCompareStatsQuery } = getCompareStatsAPI;
export const { useUpdateUserStatsMutation } = updateUserStatsAPI;
export const { useGetAllUserStatsQuery } = getAllUserStatsAPI;

