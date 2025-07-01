import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://apidata.shslira.com/api",
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
