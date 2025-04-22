// api.ts or axiosConfig.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.1.6:8080", // your BACKEND_URL
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("clerkToken");
    const smartcarToken = await AsyncStorage.getItem("smartcarToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (smartcarToken) {
      config.headers["smartcar-token"] = `${smartcarToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
