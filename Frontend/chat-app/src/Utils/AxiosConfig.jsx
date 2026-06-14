import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {

  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }

  return config;
});

// Response interceptor to unwrap `{ success: true, data: ... }` envelope
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === true && response.data.hasOwnProperty("data")) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;