import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useUserData from '../../../Hooks/useUserData';
import { useState } from 'react';

const FundDistribute = () => {

    const axiosSecure = useAxiosSecure()
    const [data] = useUserData()

    const positionLevels = [
        { rank: 1, position: "Executive Officer", fundKey: "Executive_Officer_sum" },
        { rank: 2, position: "Executive Manager", fundKey: "Special_Fund_sum" },
        { rank: 3, position: "Executive Director", fundKey: "Tour_Fund_sum" },
        { rank: 10, position: "Diamond", fundKey: "Car_Fund_sum" },
        { rank: 12, position: "Crown Director", fundKey: "Home_Fund_sum" },
    ];

    const { data: adminstore, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['adminstore'],
        queryFn: async () => {
            const res = await axiosSecure.get('/adminstore/getsummery');
            return res.data;
        },
    });
    
  const [postStatus, setPostStatus] = useState(null);

  const handleDistributeFunds = async () => {
    setPostStatus(null);
    try {
      await axiosSecure.post('/adminstore/post', { distribute: true });
      setPostStatus({ success: true, message: 'Funds distribution triggered on backend!' });
      refetch();
    } catch (err) {
      setPostStatus({ success: false, message: err.response?.data?.message || 'Failed to trigger distribution.' });
    }
  };

    // Group users by their position from positionLevels
    // Create a map: position -> array of users
    const usersByPosition = {};
    positionLevels.forEach(({ position }) => {
        usersByPosition[position] = [];
    });

    data?.forEach(user => {
        if (usersByPosition[user.Position]) {
            usersByPosition[user.Position].push(user);
        }
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;


    return (
        <div>
            <h1 className='py-10 text-center text-2xl font-semibold bg-blue-400 mb-5 text-white rounded-2xl'>Total Company Funds</h1>
            <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-5 gap-5'>
                <div className='bg-sky-100 py-10 text-center text-black text-5xl rounded-2xl'>
                    <p className='text-xl'>Executive Officer</p>
                    {adminstore?.Executive_Officer_sum.toFixed(2)}
                </div>
                <div className='bg-purple-100 py-10 text-center text-black text-5xl rounded-2xl'>
                    <p className='text-xl'>Executive Manager</p>
                    {adminstore?.Special_Fund_sum.toFixed(2)}
                </div>
                <div className='bg-green-100 py-10 text-center text-black text-5xl rounded-2xl'>
                    <p className='text-xl'>Executive Director</p>
                    {adminstore?.Tour_Fund_sum.toFixed(2)}
                </div>
                <div className='bg-blue-100 py-10 text-center text-black text-5xl rounded-2xl'>
                    <p className='text-xl'>Diamond</p>
                    {adminstore?.Car_Fund_sum.toFixed(2)}
                </div>
                <div className='bg-red-100 py-10 text-center text-black text-5xl rounded-2xl'>
                    <p className='text-xl'>Crown Director</p>
                    {adminstore?.Home_Fund_sum.toFixed(2)}
                </div>

            </div>
            <h1 className='py-10 text-center text-2xl font-semibold bg-sky-100 my-10 text-black rounded-2xl'>Funds Distribute</h1>
            <div className='text-center my-10'>
        <button
          onClick={handleDistributeFunds}
          className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg'
        >
          Distribute Funds (Backend)
        </button>

        {postStatus && (
          <p
            className={`mt-4 ${postStatus.success ? 'text-green-600' : 'text-red-600'} font-semibold`}
          >
            {postStatus.message}
          </p>
        )}
      </div>


            {positionLevels?.map(({ position, fundKey }) => {
                const users = usersByPosition[position] || [];
                const totalFund = adminstore?.[fundKey] ?? 0;
                const perUserFund = users.length > 0 ? totalFund / users.length : 0;

                return (
                    <div key={position} className="mb-10 mx-auto max-w-3xl">
                        <h2 className="text-xl bg-gray-300 py-1 px-4 font-semibold mb-4">
                            {position} ({users.length} users)
                        </h2>

                        {users?.length > 0 ? (
                            <ul className='list-disc list-inside'>
                                {users.map((user, idx) => (
                                    <li key={user._id} className='text-lg mb-1'>
                                        {idx + 1}. {user.name || user.username || "No name"} — Position: {user.Position} —
                                        <span className="font-semibold ml-2">
                                            Fund Share: ৳{perUserFund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No users found for this position.</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default FundDistribute;