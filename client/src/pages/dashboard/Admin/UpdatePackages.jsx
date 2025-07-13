/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import usePackages from "../../../Hooks/usePackages";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UpdatePackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const axiosSecure = useAxiosSecure();

  const [packages, isLoading, isError, error, refetch] = usePackages(); // Custom hook to fetch packages

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      name: "",
      price: "",
      PV: "",
      decreasePV: "",
      description: "",
      GenerationLevel: 0,
      MegaGenerationLevel: 0,
      features: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  // When package is selected, fill the form
  useEffect(() => {
    if (selectedPackage) {
      reset({
        ...selectedPackage,
        features: selectedPackage.features.length
          ? selectedPackage.features
          : [""],
        decreasePV: selectedPackage.decreasePV || "",
      });
    }
  }, [selectedPackage, reset]);

  // Submit update
  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.patch(
        `/packages/${selectedPackage?._id}`,
        data
      );
      console.log(res.data);
      if (res?.data?.message === "Package updated successfully") {
        Swal.fire("Package updated successfully");
      }
      setSelectedPackage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update package");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Membership Packages</h2>

      <table className="w-full border border-gray-300 overflow-scroll">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">PV</th>
            <th className="p-1 border">Dercrease PV</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages?.map((pkg) => (
            <tr key={pkg._id}>
              <td className="p-2 border">{pkg.name}</td>
              <td className="p-2 border">{pkg.price}</td>
              <td className="p-2 border">{pkg.PV}</td>
              <td className="p-1 border text-center">{pkg.decreasePV}</td>
              <td className="p-2 border">
                <div className="flex justify-center">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    Update
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPackage && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50  flex items-center justify-center z-50">
          <div className="bg-white border border-gray-500 shadow-2xl p-6 rounded-lg w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Update Package - {selectedPackage.name}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  {...register("name")}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Price</label>
                <input
                  {...register("price")}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">PV</label>
                <input
                  type="number"
                  {...register("PV")}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Decrease PV</label>
                <input
                  type="number"
                  {...register("decreasePV")}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">
                  Generation Commission Level
                </label>
                <input
                  type="number"
                  {...register("GenerationLevel")}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">
                  Mega Generation Commission Level{" "}
                </label>
                <input
                  type="number"
                  {...register("MegaGenerationLevel")}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  {...register("description")}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Features</label>
                {fields?.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center mb-2">
                    <input
                      {...register(`features.${index}`)}
                      className="w-full border p-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append("")}
                  className="text-blue-600 text-sm"
                >
                  + Add Feature
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePackages;
