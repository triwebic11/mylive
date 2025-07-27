import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useProducts = () => {

    const axiosPublic = useAxiosPublic()
    
    const { data: products, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
        const res = await axiosPublic.get('/products/product');
        return res.data;
    },
});

    //  // console.log("Products data:", products);

   
    return [products, isLoading, isError, error, refetch]

}

export default useProducts;