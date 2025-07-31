import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5221/api", // .NET API port
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Add JWT token to all requests if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      console.log("Token expired or invalid, clearing from localStorage");
      localStorage.removeItem("token");

      // Redirect to home page if not already there
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
