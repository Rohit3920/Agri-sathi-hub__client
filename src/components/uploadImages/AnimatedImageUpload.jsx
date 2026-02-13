import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

function AnimatedImageUpload({ title, uploadEndpoint, onClose, onUploadSuccess }) {
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpload = async (file) => {
        const uploadData = new FormData();
        uploadData.append("image", file);

        try {
            setIsUploading(true);
            setError("");
            const res = await api.post(uploadEndpoint, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const finalUrl = res.data.imageUrl;
            setImageUrl(finalUrl);
            
            // Send the URL back to the parent form
            if (onUploadSuccess) {
                onUploadSuccess(finalUrl);
            }
            
            toast.success("Image uploaded successfully!");
        } catch (err) {
            setError("Upload failed. Please try again.");
            toast.error("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            handleUpload(file);
        } else {
            setError("Please select a valid image.");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 50, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
                            <X size={22} />
                        </button>
                    </div>

                    <div className="p-8 flex flex-col items-center space-y-5">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-lg">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={60} className="text-gray-400" />
                            )}

                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 size={40} className="text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>

                    <div className="p-5 border-t dark:border-gray-700 flex justify-center">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl shadow-md transition"
                        >
                            <UploadCloud size={18} />
                            {imageUrl ? "Change Image" : "Upload Image"}
                        </button>
                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default AnimatedImageUpload;