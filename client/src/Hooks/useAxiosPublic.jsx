import axios from "axios";

const axiosPublic = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://apiarco.arkoelectronics.com/api",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
