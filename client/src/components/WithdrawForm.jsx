import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useUserById from "../Hooks/useUserById";
import socket from "./socket";
const WithdrawForm = ({ userId }) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [user, setUser] = useState(null);
  const [withdrawtaka, setWithdrawtaka] = useState("");
  const [rate, setRate] = useState(1);
  let currentPoints = user?.points;
  const axiosSecure = useAxiosSecure();
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [phone, setPhone] = useState("");
  const [point, setPoint] = useState(0);
  const [history, setHistory] = useState([]);
  const [taka, setTaka] = useState(0);

  const [data] = useUserById();
  const availablepoints = data?.points - data?.totalwithdraw;

  console.log("history------:", history);
  // ✅ Fetch user points
  useEffect(() => {
    if (userId) {
      axiosSecure
        .get(`/users/${userId}`)
        .then((res) => {
          const userPoints = res.data?.points || 0;
          setPoint(userPoints);
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [axiosSecure, userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = () => {
      axiosSecure
        .get(`/withdraw-requests/user/${userId}`)
        .then((res) => setHistory(res.data))
        .catch((err) => console.error("Failed to fetch history", err));
    };

    // 🔹 initial fetch
    fetchHistory();

    // 🔹 2s interval fetch
    const interval = setInterval(fetchHistory, 2000);

    // 🔴 cleanup (important)
    return () => clearInterval(interval);
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

  // ✅ Calculate taka
  useEffect(() => {
    setTaka(availablepoints * rate);
  }, [availablepoints, rate]);

  // ✅ Listen to real-time updates
  useEffect(() => {
    socket.on("connect", () => {
      // console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("balance-updated", ({ userId: targetId, newPoints }) => {
      if (targetId === userId) {
        setPoint(newPoints);
        // console.log("🎯 Points updated via socket:", newPoints);
      }
    });

    socket.on("conversionRateChanged", ({ pointToTaka }) => {
      setRate(pointToTaka);
      // console.log("💸 Conversion rate updated:", pointToTaka);
    });

    return () => {
      socket.off("connect");
      socket.off("balance-updated");
      socket.off("conversionRateChanged");
    };
  }, [userId]);
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

  const MIN_WITHDRAW = 200;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawAmount = Number(withdrawtaka);
    const availableBalance = Number(totaltaka);
    console.log("Available Balance:", availableBalance);

    // 1️⃣ Invalid amount
    if (!withdrawAmount || withdrawAmount <= 0) {
      return Swal.fire(
        "Invalid Amount",
        "Please enter a valid withdraw amount",
        "warning"
      );
    }

    // 2️⃣ Minimum withdraw check
    if (withdrawAmount < MIN_WITHDRAW) {
      return Swal.fire(
        "Minimum Withdraw Limit",
        `You must withdraw at least ৳${MIN_WITHDRAW}`,
        "warning"
      );
    }

    // 3️⃣ Balance check
    if (withdrawAmount > taka) {
      return Swal.fire(
        "Insufficient Balance",
        `You only have ৳${taka.toFixed(2)} available`,
        "error"
      );
    }

    // 4️⃣ Convert taka → points
    const withdrawPoints = withdrawAmount / rate;

    const requestData = {
      name: user.name,
      phone,
      userId: user._id,
      totalTaka: Math.floor(withdrawAmount),
      totalwithdraw: Math.floor(withdrawPoints),
      paymentMethod,
    };

    try {
      await axiosSecure.post("/withdraw-requests", requestData);

      Swal.fire(
        "Success 🎉",
        "Your withdraw request has been submitted successfully",
        "success"
      );

      setWithdrawtaka("");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Something went wrong. Try again later.",
        "error"
      );
    }
    setReloadKey((prev) => prev + 1);
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

      <form key={reloadKey} onSubmit={handleSubmit} className="space-y-4">
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
          <p className="text-sm text-gray-500 mt-1">
            Minimum withdraw amount: ৳200
          </p>
          <p className="text-sm text-green-600">
            Available balance: ৳{Number(taka).toFixed(2)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone / AC Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone/AC number"
            className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
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
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        {history[0]?.status === "approved" ||
        history[0]?.status === "rejected" ||
        history.length === 0 ? (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Request
          </button>
        ) : (
          <p className="text-sm text-red-500">
            At a time, only one withdraw request can be pending.
          </p>
        )}
      </form>
    </div>
  );
};

export default WithdrawForm;
