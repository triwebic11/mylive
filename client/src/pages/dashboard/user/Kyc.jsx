import React, { useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import useKycStatus from "../../../components/useKycStatus";
import useRole from "../../../Hooks/useRole";

// Cloudinary credentials
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlmbqhvnm/image/upload";
const UPLOAD_PRESET = "SHSLIRA";

const Kyc = () => {
  const { user } = useAuth();
  const userId = user?.user?._id;
  const phone = user?.user?.phone || "";
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const axiosSecure = useAxiosSecure();
  const kycStatus = useKycStatus();
  const role = useRole();
  // console.log("your kyc status - ", kycStatus); // Custom hook to get KYC status

  // Front image upload handler
  const handleFrontUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      setFrontImage(response.data.secure_url);
    } catch (error) {
      console.error("Front Image Upload Error:", error);
    }
  };

  // Back image upload handler
  const handleBackUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      setBackImage(response.data.secure_url);
    } catch (error) {
      console.error("Back Image Upload Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!frontImage || !backImage) {
      alert("Please upload both front and back NID images.");
      return;
    }

    const payload = {
      frontImage,
      backImage,
      userId,
      phone,
    };

    try {
      await axiosSecure.post("/kyc", payload);
      Swal.fire("Success", "KYC submitted successfully!", "success");
      setFrontImage("");
      setBackImage("");
    } catch (error) {
      console.error("Submit Error:", error);
      Swal.fire("Error", "Failed to submit KYC. Try again.", "error");
    }
  };

  return (
    <>
      <div
        className={`px-6 py-4 ${
          role === "dsp" ? "bg-purple-600 text-white" : ""
        }`}
      >
        <h1 className="text-2xl font-bold text-center mb-4">KYC Status</h1>
        <div className="flex justify-center">
          {kycStatus === "verified" ? (
            <div className="bg-green-100 text-green-800 border border-green-400 px-6 py-3 rounded-lg shadow-sm text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">✅</span> User Verified
            </div>
          ) : kycStatus === "pending" ? (
            <div className="bg-yellow-100 text-yellow-800 border border-yellow-400 px-6 py-3 rounded-lg shadow-sm text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">⏳</span> KYC Pending...
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 border border-red-400 px-6 py-3 rounded-lg shadow-sm text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">❌</span> Not Submitted
            </div>
          )}
        </div>
      </div>

      <h1 className="text-2xl pt-20 pb-5 md:ml-20 font-bold mb-2">
        Upload Your NID (Front & Back)
      </h1>
      <form
        onSubmit={handleSubmit}
        className="md:max-w-[80%] w-full mx-auto p-4 space-y-6 bg-white shadow rounded"
      >
        {/* Front Side Upload */}
        <div>
          <label className="block mb-1 font-semibold">Front Side</label>
          <Dropzone
            onDrop={(acceptedFiles) => handleFrontUpload(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="border-2 py-10 border-dashed p-4 text-center rounded cursor-pointer"
              >
                <input {...getInputProps()} />
                {frontImage ? (
                  <div className="relative w-fit mx-auto">
                    <img
                      src={frontImage}
                      alt="Front NID"
                      className="max-h-40 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFrontImage("")}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p>Drag & drop or click to upload front side of NID</p>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        {/* Back Side Upload */}
        <div>
          <label className="block mb-1 font-semibold">Back Side</label>
          <Dropzone
            onDrop={(acceptedFiles) => handleBackUpload(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="border-2 py-10 border-dashed p-4 text-center rounded cursor-pointer"
              >
                <input {...getInputProps()} />
                {backImage ? (
                  <div className="relative w-fit mx-auto">
                    <img
                      src={backImage}
                      alt="Back NID"
                      className="max-h-40 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setBackImage("")}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p>Drag & drop or click to upload back side of NID</p>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit your Images
        </button>
      </form>
    </>
  );
};

export default Kyc;
