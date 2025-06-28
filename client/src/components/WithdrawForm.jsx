import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const WithdrawForm = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [withdrawPoints, setWithdrawPoints] = useState("");
  const [currentPoints, setCurrentPoints] = useState(0);

  // Fetch user data by ID
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Failed to fetch user", err));
    }
  }, [userId]);

  // Fetch current points
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/points/${userId}`)
        .then((res) => {
          setCurrentPoints(res.data.points || 0);
        })
        .catch((err) => {
          console.error("Failed to fetch points", err);
        });
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!withdrawPoints || withdrawPoints <= 0) {
      return Swal.fire(
        "Invalid",
        "Please enter a valid point amount",
        "warning"
      );
    }

    if (withdrawPoints > currentPoints) {
      return Swal.fire("Insufficient", "You don't have enough points", "error");
    }

    const requestData = {
      name: user.name,
      phone: user.phone,
      userId: user._id,
      points: parseInt(withdrawPoints),
    };

    try {
      await axios.post(
        "http://localhost:5000/api/withdraw-requests",
        requestData
      );
      Swal.fire(
        "Success",
        "Your withdraw request has been submitted!",
        "success"
      );
      setWithdrawPoints("");
    } catch (error) {
      console.error("Withdraw request failed:", error);
      Swal.fire("Error", "Something went wrong. Try again later.", "error");
    }
  };

  if (!user) return <p className="text-center mt-4">Loading user data...</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto mt-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">
          💰 Withdraw Points
        </h2>

        <p className="text-center text-gray-600 mb-4">
          You have{" "}
          <span className="font-semibold text-green-600">{user.points}</span>{" "}
          points available.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            value={user.phone}
            disabled
            className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <input
            type="text"
            value={user._id}
            disabled
            className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Withdraw Points
          </label>
          <input
            type="number"
            value={withdrawPoints}
            onChange={(e) => setWithdrawPoints(e.target.value)}
            placeholder="Enter points to withdraw"
            className="w-full mt-1 border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;
