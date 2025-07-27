import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const usePackages = () => {

    const axiosPublic = useAxiosPublic()
    
    const { data: packages, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
        const res = await axiosPublic.get('/packages');
        return res.data;
    },
});

    //  // console.log("Products data:", products);

   
    return [packages, isLoading, isError, error, refetch]

}

export default usePackages;