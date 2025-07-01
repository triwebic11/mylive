import { useEffect, useState } from "react";
import axios from "axios";

const UserWithdrawHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`https://apidata.shslira.com/api/withdraw-requests/user/${userId}`)
        .then((res) => setHistory(res.data))
        .catch((err) => console.error("Failed to fetch history", err));
    }
  }, [userId]);

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
              <th className="px-4 py-2 text-left text-sm">Points</th>
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
                  <td className="px-4 py-2">{item.points}</td>
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
