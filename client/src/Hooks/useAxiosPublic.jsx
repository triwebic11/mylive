import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://apidata.shslira.com/api",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
