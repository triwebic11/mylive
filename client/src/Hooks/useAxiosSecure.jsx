import axios from "axios";

const axiosSecure = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://apidata.shslira.com/api",
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
