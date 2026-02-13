import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Loader2, User, ArrowLeft } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UploadProfile({ nextClick, prevClick }) {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const userId = localStorage.getItem("userId");

    /* ================= FETCH EXISTING PROFILE ================= */
    useEffect(() => {
        if (!userId) return;

        api
            .get(`/api/auth/get-user/${userId}`)
            .then((res) => {
                if (res.data.profilePicture) {
                    setImageUrl(res.data.profilePicture);
                }
            })
            .catch(() => {
                setError("Failed to load profile picture.");
            });
    }, [userId]);

    /* ================= HANDLE UPLOAD ================= */
    const handleUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setIsUploading(true);
            setError("");

            const response = await api.post(
                "/api/file/upload-profile",
                formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
        });

            setImageUrl(response.data.imageUrl);
            toast.success("Image uploaded successfully!");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to upload image. Please try again."
            );
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
            setError("Please select a valid image file.");
        }
    };

    /* ================= SAVE PROFILE ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageUrl) {
            setError("No profile picture selected.");
            return;
        }

        try {
            await api.put(`/api/auth/update-user/${userId}`, {
                profilePicture: imageUrl,
            });

            toast.success("Profile updated successfully!");

            if (nextClick) {
                nextClick();
            } else {
                navigate("/profile");
            }
        } catch {
            setError("Failed to update profile.");
            toast.error("Update failed.");
        }
    };

    /* ================= BACK BUTTON ================= */
    const handleBack = () => {
        if (prevClick) {
            prevClick();
        } else {
            navigate(-1);
        }
    };

    /* ================= UI ================= */
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ scale: 0.85, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.85, y: 40, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className="text-gray-500 hover:text-orange-600 transition"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Profile Photo
                            </h2>
                        </div>

                        <button
                            onClick={() => navigate("/profile")}
                            className="text-gray-500 hover:text-red-500 transition"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 flex flex-col items-center space-y-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative w-44 h-44 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-lg border-4 border-gray-200 dark:border-gray-700"
                        >
                            {imageUrl ? (
                                <motion.img
                                    src={imageUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            ) : (
                                <User size={70} className="text-gray-400" />
                            )}

                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 size={40} className="text-white animate-spin" />
                                </div>
                            )}
                        </motion.div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Upload Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => fileInputRef.current.click()}
                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl shadow-md transition"
                        >
                            <UploadCloud size={18} />
                            Change Photo
                        </motion.button>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                    </div>

                    {/* Footer */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-5 border-t dark:border-gray-700 space-y-4"
                    >
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={!imageUrl}
                            className={`w-full py-2 rounded-xl font-semibold text-white transition
                ${!imageUrl
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-orange-600 hover:bg-orange-700"
                                }`}
                        >
                            Save Profile Picture
                        </motion.button>

                        {nextClick && (
                            <button
                                type="button"
                                onClick={nextClick}
                                className="w-full py-2 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition"
                            >
                                Skip
                            </button>
                        )}
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default UploadProfile;