// lib/api.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://crmm.repid.uz/api/v1/",
});

export const setAccessToken = (token: string) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default apiClient;
