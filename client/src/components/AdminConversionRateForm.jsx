import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AdminConversionRateForm = () => {
  const [currentRate, setCurrentRate] = useState(1);
  const [pointInput, setPointInput] = useState("");
  const [takaInput, setTakaInput] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/conversion-rate")
      .then((res) => {
        const rate = res.data?.pointToTaka || 1;
        setCurrentRate(rate);
      })
      .catch((err) => console.error("Failed to fetch conversion rate", err));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const points = parseFloat(pointInput);
    const taka = parseFloat(takaInput);

    if (!points || !taka || points <= 0 || taka <= 0) {
      return Swal.fire(
        "Invalid",
        "Please enter valid positive values",
        "warning"
      );
    }

    const pointToTaka = taka / points;

    try {
      await axios.put("http://localhost:5000/api/conversion-rate", {
        pointToTaka,
      });

      setCurrentRate(pointToTaka.toFixed(2));
      setPointInput("");
      setTakaInput("");

      Swal.fire(
        "Updated!",
        `New rate is 1 Point = ${pointToTaka.toFixed(2)} ৳`,
        "success"
      );
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update conversion rate", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-xl mt-8">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline mb-4 block text-center"
      >
        &larr; Back to Dashboard
      </Link>
      <h2 className="text-xl font-semibold mb-4 text-center">
        ⚙️ Update Conversion Rate
      </h2>

      <p className="text-gray-600 text-center mb-4">
        📌 Current: <span className="font-bold">1 Point = {currentRate} ৳</span>
      </p>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            step="1"
            min="1"
            value={pointInput}
            onChange={(e) => setPointInput(e.target.value)}
            placeholder="Enter Point (e.g. 5)"
            className="w-full border px-4 py-2 rounded-md shadow-sm"
          />
          <input
            type="number"
            step="0.01"
            min="1"
            value={takaInput}
            onChange={(e) => setTakaInput(e.target.value)}
            placeholder="Enter Taka (e.g. 10)"
            className="w-full border px-4 py-2 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md shadow"
        >
          Calculate & Update Rate
        </button>
      </form>
    </div>
  );
};

export default AdminConversionRateForm;
