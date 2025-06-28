import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { Mark, mergeAttributes } from "@tiptap/core";
import { FaBold, FaItalic } from "react-icons/fa6";
import { CiCircleList } from "react-icons/ci";
import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlmbqhvnm/image/upload";
const UPLOAD_PRESET = "SHSLIRA";

const FontSize = Mark.create({
    name: "fontSize",
    addAttributes() {
        return {
            size: {
                default: null,
                parseHTML: (el) => el.style.fontSize?.replace("px", "") || null,
                renderHTML: (attrs) => attrs.size ? { style: `font-size: ${attrs.size}px` } : {},
            },
        };
    },
    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(HTMLAttributes), 0];
    },
    addCommands() {
        return {
            setFontSize: (size) => ({ commands }) =>
                commands.setMark(this.name, { size }),
        };
    },
});

const ProductForm = ({ defaultValues = {}, onSubmit, buttonText = "Add Product" }) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: defaultValues.name || "",
            price: defaultValues.price || "",
            pointValue: defaultValues.pointValue || "",
        },
    });

    const [imageUrls, setImageUrls] = useState(defaultValues.image || []);
    const [details, setDetails] = useState(defaultValues.details || "");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ bulletList: false, listItem: false }),
            Bold,
            Italic,
            Heading.configure({ levels: [1, 2, 3] }),
            TextStyle,
            FontSize,
            BulletList,
            ListItem,
        ],
        content: defaultValues.details || "",
        onUpdate: ({ editor }) => setDetails(editor.getHTML()),
    });

    useEffect(() => {
        reset({
            name: defaultValues.name || "",
            price: defaultValues.price || "",
            pointValue: defaultValues.pointValue || "",
        });
        setDetails(defaultValues.details || "");
        setImageUrls(defaultValues.image || []);
        editor?.commands.setContent(defaultValues.details || "");
    }, [defaultValues, reset, editor]);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await axios.post(CLOUDINARY_URL, formData);
            setImageUrls((prev) => [...prev, res.data.secure_url]);
        } catch (err) {
            console.error("Image Upload Error:", err);
        }
    };

    const deleteImage = (urlToRemove) => {
        setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
    };

    const submitHandler = (data) => {
        onSubmit({
            ...data,
            details,
            image: imageUrls,
        });
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
                <label className="block mb-1 font-semibold">Product Name</label>
                <input {...register("name", { required: true })} className="w-full border p-2 rounded" />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Upload Image</label>
                <Dropzone onDrop={(files) => handleImageUpload(files[0])}>
                    {({ getRootProps, getInputProps }) => (
                        <div
                            {...getRootProps()}
                            className="border-2 border-dashed p-4 text-center rounded cursor-pointer"
                        >
                            <input {...getInputProps()} />
                            {imageUrls.length ? (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {imageUrls.map((url, i) => (
                                        <div key={i} className="relative">
                                            <img src={url} className="max-h-32 rounded" />
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

            <div>
                <label className="block mb-1 font-semibold">Details</label>
                <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}><FaBold /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}><FaItalic /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}><CiCircleList /></button>
                    <button type="button" onClick={() => editor?.chain().focus().setFontSize(12).run()}>Small</button>
                    <button type="button" onClick={() => editor?.chain().focus().setFontSize(16).run()}>Medium</button>
                    <button type="button" onClick={() => editor?.chain().focus().setFontSize(20).run()}>Big</button>
                </div>
                <div className="border p-2 rounded min-h-[100px]">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div>
                <label className="block mb-1 font-semibold">Price (TK)</label>
                <input type="number" {...register("price", { required: true })} className="w-full border p-2 rounded" />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Point Value (PV)</label>
                <input type="number" {...register("pointValue", { required: true })} className="w-full border p-2 rounded" />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {buttonText}
            </button>
        </form>
    );
};

export default ProductForm;
