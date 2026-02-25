import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:30005/api",
  // baseURL: "https://apidata.shslira.com/api",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
