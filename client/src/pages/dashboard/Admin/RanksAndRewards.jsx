
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";



const RanksAndRewards = () => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure()

    const fetchRanks = async () => {
        const res = await axiosSecure.get("/updateRank");
        return res.data;
    };

    const updateRankStatus = async ({ id, status }) => {
        const res = await axiosSecure.patch(`/updateRank/${id}`, {
            status,
        });
        return res.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["rankRequests"],
        queryFn: fetchRanks,
    });

    const mutation = useMutation({
        mutationFn: updateRankStatus,
        onSuccess: () => {
            queryClient.invalidateQueries(["rankRequests"]);
        },
    });



    const handleStatusChange = (id, newStatus) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to change the status to "${newStatus}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
        }).then((result) => {
            if (result.isConfirmed) {
                mutation.mutate(
                    { id, status: newStatus },
                    {
                        onSuccess: () => {
                            Swal.fire('Updated!', 'Status has been updated.', 'success');
                        },
                        onError: () => {
                            Swal.fire('Error!', 'Something went wrong.', 'error');
                        },
                    }
                );
            }
        });
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching data.</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Ranks and Rewards</h2>
            <table className="w-full border border-gray-200 text-sm">
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
                        <th className="border border-gray-200 px-2 py-1">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item) => (
                        <tr key={item._id} className="border border-gray-200">
                            <td className="border border-gray-200 px-2 py-1">{item.name}</td>
                            <td className="border border-gray-200 px-2 py-1">{item.phone}</td>
                            <td className="border border-gray-200 px-2 py-1">{item.previousPosition || "-"}</td>
                            <td className="border border-gray-200 px-2 py-1">{item.newPosition}</td>
                            <td className="border border-gray-200 px-2 py-1">{item.reward}</td>
                            <td className="border border-gray-200 px-2 py-1">{item.leftBV}</td>
                            <td className="border border-gray-200 px-2 py-1">{item.rightBV}</td>
                            <td className="border border-gray-200 px-2 py-1">{item.status}</td>
                            <td className="border border-gray-200  px-2 py-1">
                                <select
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                    className={`border px-2 py-2 rounded 
    ${item.status === 'approved' ? 'bg-green-100 text-green-700 border-green-400' : ''}
    ${item.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-400' : ''}
    ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-400' : ''}
  `}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RanksAndRewards;
