import axios from "axios";

const axiosSecure = axios.create({
<<<<<<< HEAD
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://apiarco.arkoelectronics.com/api",
=======
  baseURL: "http://localhost:5000/api",
   withCredentials: true,
  // baseURL: "https://apidata.shslira.com/api",
>>>>>>> 3e0a96eb7ae45f24097d099b90e69a5d3cd67524
});

// ✅ Request interceptor: attach JWT token
axiosSecure.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token; // এখানেই ঠিক key বসাতে হবে
    // console.log("Using token:", token); // ✅ token দেখা যাবে
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// console.log("Token from localStorage:", JSON.parse(localStorage.getItem("user")));

// ✅ Response interceptor: handle 401 / 403 globally (optional)
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn("Unauthorized / Forbidden - redirect to login?");
      // Optional: localStorage.clear() অথবা navigate to login
    }
    return Promise.reject(error);
  }
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
