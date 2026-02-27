import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import LocationModal from "../users/LocationModal";
import UploadMachineRentalImage from "../uploadImages/UploadMachineRentalImage";

const steps = ["Basic Info", "Specs & Pricing", "Address & Location", "Availability"];

export default function AddMachine({ closeModal }) {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    // --- State ---
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");

    const [formData, setFormData] = useState({
        machineName: "",
        machineType: "",
        machineRegistationNumber: "",
        machineModel: "",
        description: "",
        machineParts: "",
        machineWorkingHours: 1,
        rentalPricePerHour: 0,
        location: {
            country: "INDIA",
            state: "",
            district: "",
            subDistrict: "",
            road: "",
            zipCode: "",
            latitude: "",
            longitude: ""
        },
        availabilityStartDate: new Date().toISOString().split("T")[0],
        availabilityEndDate: "",
    });

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        const addressFields = ["country", "state", "district", "subDistrict", "road", "zipCode", "latitude", "longitude"];

        if (addressFields.includes(name)) {
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUploadSuccess = (url) => {
        setUploadedImageUrl(url);
        setShowUploadModal(false);
        toast.success("Image uploaded successfully! 📸");
    };

    // --- Location Logic ---
    const handleMapConfirm = async (coords) => {
        const { lat, lng } = coords;
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, latitude: lat.toString(), longitude: lng.toString() }
        }));

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data.address) {
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        state: data.address.state || "",
                        district: data.address.city || data.address.district || "",
                        road: data.address.road || data.address.suburb || "",
                        zipCode: data.address.postcode || ""
                    }
                }));
            }
        } catch (err) {
            console.error("Geocoding failed", err);
        }
        setIsLocationModalOpen(false);
    };

    const handleDetectGPS = (setMapPosCallback) => {
        if (!navigator.geolocation) return toast.error("GPS not supported");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setMapPosCallback(coords);
                handleMapConfirm(coords);
            },
            () => toast.error("GPS Signal Failed")
        );
    };

    // --- Final Submission ---
    const handleSubmit = async () => {
        // Validation logic
        if (!formData.machineName || !uploadedImageUrl) {
            return toast.error("Please provide Name and Upload an Image");
        }
        if (!formData.location.latitude || !formData.location.longitude) {
            return toast.error("Please set machine location on map");
        }

        setLoading(true);
        try {
            // Transform data for Backend
            const payload = {
                ...formData,
                machineImage: uploadedImageUrl,
                machineModel: formData.machineModel || formData.machineType, // Ensure required field
                machineWorkingArea: formData.location.district || formData.location.state, // Ensure required field
                machineParts: formData.machineParts.split(",").map(p => p.trim()).filter(p => p !== ""),
                machineOwner: userId,
                location: {
                    ...formData.location,
                    latitude: parseFloat(formData.location.latitude),
                    longitude: parseFloat(formData.location.longitude)
                }
            };

            await api.post("/api/machine-rental/add-machine", payload);

            toast.success("Machine Listed Successfully! 🚜");
            if (closeModal) {
                closeModal();
            } else {
                navigate("/machine-rentals");
            }
        } catch (err) {
            console.error("Submission Error:", err.response?.data);
            toast.error(err.response?.data?.message || "Submission Failed");
        } finally {
            setLoading(false);
        }
    };

    const progress = ((step + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-6 md:p-10">

                {closeModal && (
                    <button
                        onClick={closeModal}
                        className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                    >
                        ✕
                    </button>
                )}

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">List Your Machine 🚜</h2>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full mb-4 overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-8">
                    Step {step + 1}: {steps[step]}
                </p>

                {/* Step 0: Basic Info */}
                {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Machine Name" name="machineName" placeholder="e.g. John Deere 5050" value={formData.machineName} onChange={handleChange} />
                        <Field label="Machine Type" name="machineType" placeholder="e.g. Harvester" value={formData.machineType} onChange={handleChange} />
                        <Field label="Machine Model" name="machineModel" placeholder="e.g. 2024 Turbo" value={formData.machineModel} onChange={handleChange} />
                        <Field label="Registration No." name="machineRegistationNumber" placeholder="e.g. GJ 01 AB 1234" value={formData.machineRegistationNumber} onChange={handleChange} />

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-2">Machine Image</label>
                            {!uploadedImageUrl ? (
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="w-full py-3 bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-2 border-dashed border-indigo-200 dark:border-indigo-900 rounded-xl font-bold hover:bg-indigo-100 transition"
                                >
                                    + Upload Image
                                </button>
                            ) : (
                                <div className="relative group">
                                    <img src={uploadedImageUrl} alt="Machine" className="h-40 w-full object-cover rounded-xl border-2 border-green-400" />
                                    <button
                                        onClick={() => setUploadedImageUrl("")}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full text-xs shadow-lg"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 1: Pricing & Specs */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-2">Description</label>
                            <textarea name="description" placeholder="Condition and tools included..." rows="3" onChange={handleChange} value={formData.description} className="input-style w-full" />
                        </div>
                        <Field label="Extra Parts (comma separated)" name="machineParts" placeholder="Trailer, Blades, Plough" value={formData.machineParts} onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Total Working Hours" name="machineWorkingHours" type="number" value={formData.machineWorkingHours} onChange={handleChange} />
                            <Field label="Price (₹ Per Hour)" name="rentalPricePerHour" type="number" value={formData.rentalPricePerHour} onChange={handleChange} />
                        </div>
                    </div>
                )}

                {/* Step 2: Address & Location */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Field label="State" name="state" value={formData.location.state} onChange={handleChange} />
                            <Field label="District/City" name="district" value={formData.location.district} onChange={handleChange} />
                            <Field label="Village/Road" name="road" value={formData.location.road} onChange={handleChange} />
                            <Field label="Pincode" name="zipCode" value={formData.location.zipCode} onChange={handleChange} />
                        </div>
                        <div className="bg-indigo-50 dark:bg-gray-700/30 p-5 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-gray-600">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">GPS Coordinates</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formData.location.latitude ? `Lat: ${formData.location.latitude}, Lng: ${formData.location.longitude}` : 'Map location not set'}
                                    </p>
                                </div>
                                <button type="button" onClick={() => setIsLocationModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition">
                                    📍 Open Map
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Availability */}
                {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        <Field label="Available From" name="availabilityStartDate" type="date" value={formData.availabilityStartDate} onChange={handleChange} />
                        <Field label="Available To" name="availabilityEndDate" type="date" value={formData.availabilityEndDate} onChange={handleChange} />
                    </div>
                )}

                {/* Footer Navigation */}
                <div className="flex justify-between mt-10">
                    <button
                        disabled={step === 0}
                        onClick={() => setStep(step - 1)}
                        className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white rounded-xl disabled:opacity-20 font-bold transition"
                    >
                        Back
                    </button>
                    {step < steps.length - 1 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-10 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold disabled:bg-gray-400 transition"
                        >
                            {loading ? "Saving..." : "Submit Machine"}
                        </button>
                    )}
                </div>
            </div>

            {/* Modals */}
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onConfirm={handleMapConfirm}
                onDetect={handleDetectGPS}
                t={(s) => s}
            />

            {showUploadModal && (
                <UploadMachineRentalImage
                    onClose={() => setShowUploadModal(false)}
                    onUploadSuccess={handleImageUploadSuccess}
                />
            )}

            <style jsx>{`
                .input-style {
                    width: 100%;
                    padding: 0.85rem 1.25rem;
                    border-radius: 1rem;
                    border: 1px solid #e5e7eb;
                    background-color: transparent;
                    color: #111827; 
                    outline: none;
                    transition: border-color 0.2s;
                }
                .input-style:focus {
                    border-color: #4f46e5;
                }
                :global(.dark) .input-style {
                    border-color: #374151;
                    color: #f9fafb;
                }
            `}</style>
        </div>
    );
}

const Field = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-2">{label}</label>
        <input className="input-style" {...props} />
    </div>
);