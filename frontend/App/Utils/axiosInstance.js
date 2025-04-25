// api.ts or axiosConfig.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.1.7:8080",
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
