import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://apidata.shslira.com/api",
});

// ✅ Add request interceptor to attach token
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token"); // 👈 তোমার token যেখানেই store করা থাকে

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
