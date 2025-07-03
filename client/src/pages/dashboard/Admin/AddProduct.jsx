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
                parseHTML: (element) => element.style.fontSize?.replace("px", "") || null,
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
        return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
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
    const [imageUrls, setImageUrls] = useState([]);
    const axiosSecure = useAxiosSecure()


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


    const onSubmit = async (data) => {
  
        const payload = {
            name: data.name,
            image: imageUrls,
            details: details,
            price: data.price,
            pointValue: data.pointValue,
        };

        console.log("Form Data:", payload);

        try {
          await axiosSecure.post("/products/product", payload); // Replace with your actual API
          alert("Product added successfully!");
        } catch (error) {
          console.error("Submit Error:", error);
        }
    };

    return (
        <>
        <h1 className="text-2xl pt-20 pb-5 md:ml-20 font-bold mb-2">
        Add Products{" "}
        
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
                <Dropzone onDrop={(acceptedFiles) => handleImageUpload(acceptedFiles[0])}>
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
                                            <img src={url} alt={`Uploaded ${index}`} className="max-h-32 rounded" />
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
                    <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="btn"><FaBold /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="btn"><FaItalic /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="btn"><CiCircleList /></button>
                    <button type="button" onClick={() => editor?.chain().focus().setFontSize(12).run()} className="btn">Small</button>
                    <button type="button" onClick={() => editor?.chain().focus().setFontSize(16).run()} className="btn">Medium</button>
                    <button type="button" onClick={() => editor?.chain().focus().setFontSize(20).run()} className="btn">Big</button>
                </div>

                <div className="border rounded p-2 min-h-[150px]">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Price */}
            <div>
                <label className="block mb-1 font-semibold">Price (TK)</label>
                <input
                    type="number"
                    {...register("price", { required: true })}
                    className="w-full border p-2 rounded"
                />
            </div>

            {/* Point Value */}
            <div>
                <label className="block mb-1 font-semibold">Point Value (PV)</label>
                <input
                    type="number"
                    {...register("pointValue", { required: true })}
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
        </>
    );
};

export default AddProduct;
