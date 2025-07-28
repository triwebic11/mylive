/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import useProducts from "../../../Hooks/useProducts";
import ProductForm from "./ProductForm";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllProducts = () => {
  const [products, isLoading, isError, error, refetch] = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrpPrice: "",
    pointValue: "",
    productId: "",
    details: "",
  });

  const onUpdate = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      mrpPrice: product.mrpPrice,
      pointValue: product.pointValue,
      productId: product.productId,
      details: product.details,
      isRepurchaseFree: product.isRepurchaseFree || false,
      isConsistencyFree: product.isConsistencyFree || false,
    });
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      price: "",
      mrpPrice: "",
      pointValue: "",
      productId: "",
      details: "",
    });
  };

  const handleUpdateProduct = async (updatedData) => {
    try {
      const res = await axiosSecure.patch(
        `/products/${selectedProduct._id}`,
        updatedData
      );

      // console.log(res.data);

      refetch();
      setSelectedProduct(null); // Close modal
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "Product update successfully!",
        showConfirmButton: true,
      });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await axiosSecure.delete(`/products/${product._id}`);
        // console.log(res.data);
        refetch();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl pt-20 pb-5  font-bold mb-2">All Products </h1>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Details</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">MRP Price</th>
              <th className="px-4 py-2 border">Point Value</th>
              <th className="px-4 py-2 border">Product Id</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="text-sm text-gray-700">
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">
                  <img src={product.image} className="w-20" alt="" />
                </td>
                <td
                  className="px-4 py-2 border"
                  dangerouslySetInnerHTML={{ __html: product.details }}
                />
                <td className="px-4 py-2 border">{product.price} TK</td>
                <td className="px-4 py-2 border">{product.mrpPrice} TK</td>
                <td className="px-4 py-2 border">{product.pointValue}</td>
                <td className="px-4 py-2 border">{product.productId}</td>
                <td className="px-4 py-2 border">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => onUpdate(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Updating Product */}
      {/* Modal for Updating Product */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 overflow-auto p-4">
          <div className="bg-white border border-gray-500 p-6 rounded shadow-md w-full max-w-lg relative max-h-screen overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Update Product</h2>
            <ProductForm
              defaultValues={selectedProduct}
              onSubmit={handleUpdateProduct}
              buttonText="Update Product"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
