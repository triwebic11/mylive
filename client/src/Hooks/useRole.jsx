import useUserById from "./useUserById";

const useRole = () => {
  const [data, isLoading] = useUserById();

  const role = data?.role;
  console.log("User Role from useRole hook = ", role);

  return { role, isLoading };
};

export default useRole;
