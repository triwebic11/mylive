
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useUserById from "../../../Hooks/useUserById";



const UserRanksRewards = () => {
    const axiosSecure = useAxiosSecure()
    const [data] = useUserById()


    console.log("UserRanksRewards data:", data);

    const fetchRanks = async () => {
        const res = await axiosSecure.get("/updateRank");
        return res.data;
    };

  

    const { data: rewards, isLoading, isError } = useQuery({
        queryKey: ["rankRequests"],
        queryFn: fetchRanks,
    });

   

      const filteredData = rewards?.filter((item) =>
    item?.phone === data?.phone
  );





    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching data.</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Ranks and Rewards</h2>
            <table className="w-full bg-white border border-gray-200 text-sm">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="border border-gray-200 px-2 py-1">Name</th>
                        <th className="border border-gray-200 px-2 py-1">Phone</th>
                        <th className="border border-gray-200 px-2 py-1">Previous</th>
                        <th className="border border-gray-200 px-2 py-1">New</th>
                        <th className="border border-gray-200 px-2 py-1">Reward</th>
                        <th className="border border-gray-200 px-2 py-1">Left BV</th>
                        <th className="border border-gray-200 px-2 py-1">Right BV</th>
                        <th className="border border-gray-200 px-2 py-1">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredData?.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-20 ">
                                    No rank requests found for this user.
                                </td>
                            </tr>
                        )   
                    }
                    {filteredData?.map((item) => (
                        <tr key={item?._id} className="border border-gray-200">
                            <td className="border border-gray-200 px-2 py-1">{item?.name}</td>
                            <td className="border border-gray-200 px-2 py-1">{item?.phone}</td>
                            <td className="border border-gray-200 px-2 py-1">{item?.previousPosition || "-"}</td>
                            <td className="border border-gray-200 px-2 py-1">{item?.newPosition}</td>
                            <td className="border border-gray-200 px-2 py-1">{item?.reward}</td>
                            <td className="border border-gray-200 px-2 py-1">{item?.leftBV}</td>
                            <td className="border border-gray-200 px-2 py-1">{item?.rightBV}</td>
                            <td
                                className={`border border-gray-200 px-2 py-1 text-center ${item?.status === "approved"
                                        ? "text-green-600 font-semibold"
                                        : item?.status === "pending"
                                            ? "text-yellow-600 font-semibold"
                                            : item?.status === "rejected"
                                                ? "text-red-600 font-semibold"
                                                : "text-gray-600"
                                    }`}
                            >
                                {item?.status ? item.status : "N/A"}
                            </td>


                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserRanksRewards;
