import Axios from "axios";
import { config } from ".";

export const axios = Axios.create({
  baseURL: config.apiUrl,

  headers: {},
});

axios.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("user-auth-token");

  Object.assign(config.headers, {
    Authorization: `Bearer ${authToken}`,
  });

  return config;
});
