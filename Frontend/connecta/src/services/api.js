import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

// Response interceptor to unwrap `{ success: true, data: ... }` envelope
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === true && Object.prototype.hasOwnProperty.call(response.data, "data")) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
