// 📁 components/DspInventory.jsx

import useAuth from "../../../Hooks/useAuth";
import useDspInventory from "../../../Hooks/useDspInventory";

const DspStoreProduct = () => {
  const { user } = useAuth(); // user.phone
  // console.log("Current User phone:", user?.user?.email || user?.user?.email );
  const phone = user?.user?.phone || user?.user?.email;
  const { data: inventory = [], isLoading } = useDspInventory(phone);
  // console.log("Dsp Inventory Data:", inventory);

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">📦 My Inventory</h2>
      <div className="overflow-x-auto">
        <h1 className="text-xl text-center font-semibold">Current Store</h1>
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Si No</th>
              <th className="text-left px-4 py-2">Product Name</th>

              <th className="text-left px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={item.productId} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  {item.productId}.{item.productName}
                </td>
                <td className="px-4 py-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DspStoreProduct;
