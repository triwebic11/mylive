import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import axios from "axios";

// Tiptap Imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { Mark, mergeAttributes } from "@tiptap/core";
import { FaBold, FaFont, FaItalic } from "react-icons/fa6";
import { CiCircleList } from "react-icons/ci";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

// Cloudinary
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlmbqhvnm/image/upload";
const UPLOAD_PRESET = "SHSLIRA";

// ✅ Custom FontSize Extension
const FontSize = Mark.create({
  name: "fontSize",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) =>
          element.style.fontSize?.replace("px", "") || null,
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return {
            style: `font-size: ${attributes.size}px`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ style: "font-size" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ commands }) => {
          return commands.setMark(this.name, { size });
        },
    };
  },
});

const AddProduct = () => {
  const { register, handleSubmit } = useForm();
  const [details, setDetails] = useState("");
  const [repurchaseFree, setRepurchaseFree] = useState(false);
  const [consistencyFree, setConsistencyFree] = useState(false);
  const [freeOrPaid, setFreeOrPaid] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);
  const axiosSecure = useAxiosSecure();

  const [productOptions, setProductOptions] = useState({
    isRepurchaseFree: false,
    isConsistencyFree: false,
    // advanceConsistency: "",
    // addConsistencyFreeProduct: "",
  });

  // ✅ Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        listItem: false,
        textStyle: false, // Required for TextStyle + FontSize
      }),
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      TextStyle,
      FontSize,
      BulletList,
      ListItem,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setDetails(editor.getHTML());
    },
  });
  const deleteImage = (urlToRemove) => {
    setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      setImageUrls((prev) => [...prev, response.data.secure_url]);
    } catch (error) {
      console.error("Image Upload Error:", error);
    }
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setProductOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      image: imageUrls,
      details: details,
      price: data.price,
      mrpPrice: data.mrpPrice ? Number(data.mrpPrice) : 0,
      quantity: data.quantity ? Number(data.quantity) : 0,
      pointValue: data.pointValue ? Number(data.pointValue) : 0,
      productId: data.productId || " ",
      rfp: data.rfp || "",
      acfp: data.acfp || "",
      productRole: freeOrPaid ? "paid" : "free",
      ...productOptions, // Include the new 4 fields here
    };

    // console.log("Form Data:", payload);

    try {
      await axiosSecure.post("/products/product", payload); // Replace with your actual API

      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "Product added successfully!",
        showConfirmButton: true,
      });
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl pt-20 pb-5 md:ml-20 font-bold mb-2">
        Add Products{" "}
      </h1>
      <div className="md:max-w-[80%] w-full mx-auto p-4 space-y-4 bg-white shadow rounded">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Type
        </label>
        <input
          list="typeOptions"
          name="type"
          id="type"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Choose Paid or Free"
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            if (value === "free") {
              setFreeOrPaid(false);
            } else if (value === "paid") {
              setFreeOrPaid(true);
            }
          }}
        />
        <datalist id="typeOptions">
          <option value="Paid" />
          <option value="Free" />
        </datalist>
      </div>
      {freeOrPaid ? (
        <div>
          <h1 className="md:max-w-[80%] w-full text-green-900 font-bold mx-auto text-xl text-center bg-white shadow rounded">
            Upload Paid Product
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:max-w-[80%] w-full mx-auto p-4 space-y-4 bg-white shadow rounded"
          >
            {/* Product Name */}
            <div>
              <label className="block mb-1 font-semibold">Product Name</label>
              <input
                {...register("name", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-1 font-semibold">Upload Image</label>
              <Dropzone
                onDrop={(acceptedFiles) => handleImageUpload(acceptedFiles[0])}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="border-2 py-10 border-dashed p-4 text-center rounded cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    {imageUrls.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Uploaded ${index}`}
                              className="max-h-32 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => deleteImage(url)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Drag & drop image here, or click to select</p>
                    )}
                  </div>
                )}
              </Dropzone>
            </div>

            {/* Tiptap Editor */}
            <div>
              <label className="block mb-1 font-semibold">Details</label>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className="btn"
                >
                  <FaBold />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className="btn"
                >
                  <FaItalic />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  className="btn"
                >
                  <CiCircleList />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setFontSize(12).run()}
                  className="btn"
                >
                  Small
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setFontSize(16).run()}
                  className="btn"
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setFontSize(20).run()}
                  className="btn"
                >
                  Big
                </button>
              </div>

              <div className="border rounded p-2 min-h-[150px]">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block mb-1 font-semibold">DP(TK)</label>
              <input
                type="number"
                {...register("price", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">MRP(TK)</label>
              <input
                type="number"
                {...register("mrpPrice", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>
               <div>
              <label className="block mb-1 font-semibold">Quantity</label>
              <input
                type="number"
                {...register("quantity", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Point Value */}
            <div>
              <label className="block mb-1 font-semibold">
                Point Value (PV)
              </label>
              <input
                type="number"
                {...register("pointValue", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>
            {/* Product Id */}
            <div>
              <label className="block mb-1 font-semibold">Product Id</label>
              <input
                type="number"
                {...register("productId", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Repurchase Free Product */}
              {/* Repurchase Free Product */}
              <div className="form-control mb-4">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    onClick={() => setRepurchaseFree(!repurchaseFree)}
                    type="checkbox"
                    {...register("isRepurchaseFree")}
                    className="toggle toggle-success mr-1 text-2xl"
                  />
                  <span className="label-text font-semibold">
                    Repurchase Free Product
                  </span>
                </label>
                {repurchaseFree && (
                  <div>
                    <div className=" p-2 m-4 rounded-lg shadow-xl">
                      <label className="block mb-1 font-semibold">
                        Set % for repurchase free{" "}
                      </label>
                      <input
                        {...register("rfp")}
                        placeholder="Enter percentage value"
                        className="border p-1 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Consistency Free Product */}
              <div className="form-control mb-4">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    onClick={() => setConsistencyFree(!consistencyFree)}
                    type="checkbox"
                    {...register("isConsistencyFree")}
                    className="toggle toggle-success mr-1"
                  />
                  <span className="label-text font-semibold">
                    Advance Consistency Free Product
                  </span>
                </label>
                {consistencyFree && (
                  <div>
                    <div className=" p-2 m-4 rounded-lg shadow-xl">
                      <label className="block mb-1 font-semibold">
                        Set % for Advance Consistency Free{" "}
                      </label>
                      <input
                        {...register("acfp")}
                        placeholder="Enter percentage value"
                        className="border p-1 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Advance Consistency */}
              {/* <div>
            <label className="block mb-1 font-semibold">
              Advance Consistency
            </label>
            <select
              name="advanceConsistency"
              value={productOptions.advanceConsistency}
              onChange={handleOptionChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Add Consistency Free Product */}
              {/* <div>
            <label className="block mb-1 font-semibold">
              Add Consistency Free Product
            </label>
            <select
              name="addConsistencyFreeProduct"
              value={productOptions.addConsistencyFreeProduct}
              onChange={handleOptionChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>  */}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="md:max-w-[80%] w-full text-yellow-700 font-bold mx-auto text-xl text-center bg-white shadow rounded">
            Give Free Product
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:max-w-[80%] w-full mx-auto p-4 space-y-4 bg-white shadow rounded"
          >
            {/* Product Name */}
            <div>
              <label className="block mb-1 font-semibold">Product Name</label>
              <input
                {...register("name", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-1 font-semibold">Upload Image</label>
              <Dropzone
                onDrop={(acceptedFiles) => handleImageUpload(acceptedFiles[0])}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="border-2 py-10 border-dashed p-4 text-center rounded cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    {imageUrls.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Uploaded ${index}`}
                              className="max-h-32 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => deleteImage(url)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Drag & drop image here, or click to select</p>
                    )}
                  </div>
                )}
              </Dropzone>
            </div>

            {/* Tiptap Editor */}
            <div>
              <label className="block mb-1 font-semibold">Details</label>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className="btn"
                >
                  <FaBold />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className="btn"
                >
                  <FaItalic />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  className="btn"
                >
                  <CiCircleList />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setFontSize(12).run()}
                  className="btn"
                >
                  Small
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setFontSize(16).run()}
                  className="btn"
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setFontSize(20).run()}
                  className="btn"
                >
                  Big
                </button>
              </div>

              <div className="border rounded p-2 min-h-[150px]">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block mb-1 font-semibold">Price(TK)</label>
              <input
                type="number"
                {...register("price", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>
            {/* <div>
          <label className="block mb-1 font-semibold">MRP(TK)</label>
          <input
            type="number"
            {...register("mrpPrice", { required: true })}
            className="w-full border p-2 rounded"
          />
        </div> */}

            {/* Point Value */}
            {/* <div>
              <label className="block mb-1 font-semibold">
                Point Value (PV)
              </label>
              <input
                type="number"
                {...register("pointValue", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div> */}
            {/* Product Id */}
            <div>
              <label className="block mb-1 font-semibold">Product Id</label>
              <input
                type="number"
                {...register("productId", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddProduct;
