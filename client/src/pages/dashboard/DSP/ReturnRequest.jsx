import { useEffect, useState } from "react";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useProducts from "../../../Hooks/useProducts";
import TodayStatement from "../SuperAdmin/TodayStatement";
import Swal from "sweetalert2";

const ReturnRequest = ({ dspPhone }) => {
  const axiosSecure = useAxiosSecure();
  const [products, isLoading, isError, error, refetch] = useProducts();

  const [dspInventory, setDspInventory] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const selectedInv = dspInventory.find((i) => i.productId === productId);

  // Load DSP Inventory
  useEffect(() => {
    axiosSecure.get(`/inventory/${dspPhone}`).then((res) => {
      setDspInventory(res.data);
    });
  }, [dspPhone, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInv || selectedInv.quantity < quantity) {
      Swal.fire("❌ You don't have enough stock!");
      return;
    }

    const selectedProduct = products.find((p) => p.productId === productId);

    const payload = {
      dspPhone,
      productId,
      productName: selectedProduct?.name,
      quantity,
      note,
    };

    const res = await axiosSecure.post("admin-orders/dsp-return", payload);
    Swal.fire("✅ Success", res.data.message, "success");
    setProductId("");
    setQuantity(1);
    setNote("");
  };

  return (
    <div className="p-5 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Return Product to Admin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Select */}
        <div>
          <label className="font-semibold">Select Product</label>
          <select
            className="w-full border p-2 rounded"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            {dspInventory.map((p) => (
              <option key={p.productId} value={p.productId}>
                {p.productName} (Stock: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="font-semibold">Quantity</label>
          <input
            type="number"
            min="1"
            max={selectedInv?.quantity || 1}
            className="w-full border p-2 rounded"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
          {selectedInv && (
            <p className="text-sm text-gray-500">
              Available: {selectedInv.quantity}
            </p>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="font-semibold">Note (optional)</label>
          <textarea
            className="w-full border p-2 rounded"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <button
          className={`px-4 py-2 w-full text-white rounded ${
            !selectedInv || selectedInv.quantity < quantity
              ? "bg-gray-400"
              : "bg-blue-600"
          }`}
          type="submit"
          disabled={!selectedInv || selectedInv.quantity < quantity}
        >
          Send Request
        </button>
      </form>
    </div>
  );
};

export default ReturnRequest;
