import useUserById from './useUserById';

const useRole = () => {
    const [data, isLoading] = useUserById();

    const role = data?.role;

    return { role, isLoading };
};

export default useRole;
