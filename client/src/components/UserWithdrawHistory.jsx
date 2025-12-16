import { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useUserById from "../Hooks/useUserById";

const UserWithdrawHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const axiosSecure = useAxiosSecure()
   const [data] = useUserById()
    const availablepoints = data?.points - data?.totalwithdraw
      const [rate, setRate] = useState(1);

      // console.log(history)

  useEffect(() => {
    if (userId) {
      axiosSecure
        .get(`/withdraw-requests/user/${userId}`)
        .then((res) => setHistory(res.data))
        .catch((err) => console.error("Failed to fetch history", err));
    }
  }, [axiosSecure, userId]);

    // ✅ Fetch conversion rate
  useEffect(() => {
    axiosSecure
      .get("/conversion-rate")
      .then((res) => {
        const currentRate = res.data?.pointToTaka || 1;
        setRate(parseFloat(currentRate).toFixed(2));
      })
      .catch((err) => console.error("Failed to fetch conversion rate:", err));
  }, [axiosSecure]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">
        💳 Withdraw History
      </h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">No approved withdraws yet.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Date</th>
              <th className="px-4 py-2 text-left text-sm">Amount</th>
              <th className="px-4 py-2 text-left text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleString(
                "en-BD",
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                }
              );
              return (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{formattedDate}</td>
                  <td className="px-4 py-2">{item?.totalTaka}</td>
                  <td className="px-4 py-2">
                    <span className="text-green-600 font-semibold capitalize">
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserWithdrawHistory;
