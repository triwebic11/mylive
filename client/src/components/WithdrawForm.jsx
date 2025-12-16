import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const WithdrawForm = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [withdrawtaka, setWithdrawtaka] = useState("");
  const [rate, setRate] = useState(1);
  let currentPoints = user?.points;
  const axiosSecure = useAxiosSecure();
  const [paymentMethod, setPaymentMethod] = useState("bkash");

  // console.log("Current Points:", currentPoints);

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

  const totaltaka = currentPoints * rate;

  // console.log(withdrawtaka)

  // console.log("totaltakaaaaaaa",totaltaka)
  const withdrawpointsconvert = withdrawtaka / rate;

  // console.log("withdrow poibts", withdrawpointsconvert)

  // Fetch user data by ID
  useEffect(() => {
    if (userId) {
      axiosSecure
        .get(`/users/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Failed to fetch user", err));
    }
  }, [axiosSecure, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!withdrawtaka || withdrawtaka <= 0) {
      return Swal.fire(
        "Invalid",
        "Please enter a valid point amount",
        "warning"
      );
    }

    if (totaltaka <= 0 || withdrawtaka > totaltaka) {
      return Swal.fire("Insufficient", "You don't have enough amount", "error");
    }

    const requestData = {
      name: user.name,
      phone: user.phone,
      userId: user._id,
      totalTaka: parseInt(withdrawtaka),
      totalwithdraw: parseInt(withdrawpointsconvert),
      paymentMethod: paymentMethod, // <-- Added here
    };

    try {
      await axiosSecure.post("/withdraw-requests", requestData);
      // console.log("Withdraw request data:", requestData);
      Swal.fire(
        "Success",
        "Your withdraw request has been submitted!",
        "success"
      );
      setWithdrawtaka("");
    } catch (error) {
      Swal.fire("Error", "Something went wrong. Try again later.", "error");
    }
  };

  if (!user) return <p className="text-center mt-4">Loading user data...</p>;

  return (
    <div className=" flex flex-col justify-center items-center bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto mt-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">
          💰 Withdraw Points
        </h2>

        {/* <p className="text-center text-gray-600 mb-4">
          You have{" "}
          <span className="font-semibold text-green-600">{Number(currentPoints).toFixed(2)}</span>{" "}
          points available.
        </p> */}
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
            Enter Withdraw Amount
          </label>
          <input
            type="number"
            min="1"
            value={withdrawtaka}
            onChange={(e) => setWithdrawtaka(e.target.value)}
            placeholder="Enter amount to withdraw"
            className="w-full mt-1 border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment By
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2 bg-white"
          >
            <option value="bkash">Bkash</option>
            <option value="nagad">Nagad</option>
            <option value="rocket">Rocket</option>
          </select>
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
