import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 使用 Vite 环境变量
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Approval", "Category"],
  endpoints: () => ({}),
});

export default api;
