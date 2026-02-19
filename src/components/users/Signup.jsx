import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import LocationModal from "./LocationModal";
import AddressFields from "./AddressFields";
import { useTranslation } from "react-i18next";

export default function Signup() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [userMode, setUserMode] = useState("farmer");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        MobileNum: "",
        password: "",
        confirmPassword: "",
        address: {
            street: "",
            city: "",
            district: "",
            state: "",
            zipCode: "",
            country: "INDIA",
            addressType: "Permanent"
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const addressFields = ["street", "city", "district", "zipCode", "state"];

        if (addressFields.includes(name)) {
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDetect = (callback) => {
        if (!navigator.geolocation)
            return toast.error("Geolocation not supported");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                callback(coords);
                toast.success("Location detected!");
            },
            () => toast.error("GPS Failed. Please select manually on the map.")
        );
    };

    const finalSubmit = async (coords = null) => {
        const payload = {
            ...formData,
            userMode,
            latitude: coords?.lat,
            longitude: coords?.lng
        };

        try {
            await api.post("/api/auth/register", payload);
            toast.success("Welcome to Agri Sathi Hub! 🎉");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword)
            return toast.error("Passwords mismatch");

        toast.info(
            ({ closeToast }) => (
                <div className="space-y-3">
                    <p className="font-semibold text-gray-800 dark:text-white">
                        📍 Add your location
                    </p>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => {
                                closeToast();
                                handleDetect((coords) => finalSubmit(coords));
                            }}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Confirm Current Location
                        </button>

                        <button
                            onClick={() => {
                                closeToast();
                                setIsModalOpen(true);
                            }}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Manually Add Location
                        </button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                position: "top-center"
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
            <div className="max-w-xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-8">

                <form onSubmit={handleInitialSubmit} autoComplete="on" className="space-y-4">

                    {/* User Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
                        {["farmer", "servicer", "worker"].map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setUserMode(mode)}
                                className={`flex-1 py-2 rounded-lg capitalize transition ${
                                    userMode === mode
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-500"
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        autoComplete="username"
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:text-white"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:text-white"
                        required
                    />

                    <input
                        type="tel"
                        name="MobileNum"
                        placeholder="Mobile"
                        autoComplete="tel"
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:text-white"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            onChange={handleChange}
                            className="px-4 py-3 border rounded-xl dark:bg-gray-700 dark:text-white"
                            required
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm"
                            autoComplete="new-password"
                            onChange={handleChange}
                            className="px-4 py-3 border rounded-xl dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <AddressFields
                        formData={formData}
                        handleChange={handleChange}
                        t={(s) => s}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition"
                    >
                        Complete Registration
                    </button>

                </form>
            </div>

            <LocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={(coords) => finalSubmit(coords)}
                onDetect={handleDetect}
                t={t}
            />
        </div>
    );
}
