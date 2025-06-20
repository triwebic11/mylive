import React from 'react';
import { data } from 'react-router-dom';

const useUserData = () => {
    const {data, isLoading, isError, error, refetch} = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            const response = await fetch('http://localhost:5000/api/users/userData');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
    })
    return [data, isLoading, isError, error, refetch]

}

export default useUserData;