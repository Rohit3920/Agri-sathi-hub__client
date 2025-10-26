import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

const isValidImageUrl = (url) => /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg|gif)$/.test(url);


const initialFormState = {
    machineName: "",
    machineRegistationNumber: "",
    machineType: "",
    machineModel: "",
    description: "",
    machineImage: "",
    machineParts: [],
    machineWorkingArea: "",
    machineWorkingHours: 1,
    rentalPricePerHour: 0,
    availabilityStartDate: new Date().toISOString().split("T")[0],
    availabilityEndDate: "",
    location: { city: "", state: "", country: "" },
};

const AddMachine = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    if (Object.keys(errors).length > 0) {
        console.log( errors);
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (["city", "state", "country"].includes(name)) {
                return {
                    ...prev,
                    location: { ...prev.location, [name]: value },
                };
            }

            const numericFields = ["machineWorkingHours", "rentalPricePerHour"];
            const newValue =
                numericFields.includes(name) && value !== "" ? Number(value) : value;

            return { ...prev, [name]: newValue };
        });

        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[name];
            return updated;
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.machineName) newErrors.machineName = "Machine Name is required.";
        if (!formData.machineRegistationNumber)
            newErrors.machineRegistationNumber = "Registration Number is required.";
        if (!formData.machineType) newErrors.machineType = "Machine Type is required.";
        if (!formData.machineModel) newErrors.machineModel = "Machine Model is required.";
        if (!formData.machineWorkingArea)
            newErrors.machineWorkingArea = "Working Area is required.";
        if (formData.machineWorkingHours < 1)
            newErrors.machineWorkingHours = "Working Hours must be positive.";
        if (formData.rentalPricePerHour < 0)
            newErrors.rentalPricePerHour = "Price cannot be negative.";
        if (!formData.machineImage) newErrors.machineImage = "Image URL is required.";
        else if (!isValidImageUrl(formData.machineImage))
            newErrors.machineImage = "Invalid image URL.";

        const partsArray = formData.machineParts.split(",").filter((p) => p.trim() !== "");
        if (partsArray.length === 0)
            newErrors.machineParts = "Enter at least one part (comma separated).";

        if (!formData.location.city) newErrors.city = "City is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const dataToSend = {
            ...formData,
            machineParts: formData.machineParts.split(",").map((p) => p.trim()),
            machineOwner: userId
        };

        const response = await api.post("/api/machine-rental/add-machine", dataToSend);
        console.log("API Response:", response);
        toast.success("✅ Machine added successfully!");
        setFormData(initialFormState);
        setLoading(false);
        navigate("/machine-rentals");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10 transition-colors duration-300">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
                    Add Rental Machine 🚜
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Machine Details */}
                    <section className="border-b border-gray-300 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                            Machine Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label htmlFor="machineName" className="text-gray-700 dark:text-gray-300 font-medium">
                                Machine Name:
                            </label>
                            <input
                                type="text"
                                name="machineName"
                                value={formData.machineName}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />

                            <label htmlFor="machineRegistationNumber" className="text-gray-700 dark:text-gray-300 font-medium">
                                Registration Number:
                            </label>
                            <input
                                type="text"
                                name="machineRegistationNumber"
                                value={formData.machineRegistationNumber}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />

                            <label htmlFor="machineType" className="text-gray-700 dark:text-gray-300 font-medium">
                                Machine Type:
                            </label>
                            <input
                                type="text"
                                name="machineType"
                                value={formData.machineType}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />

                            <label htmlFor="machineModel" className="text-gray-700 dark:text-gray-300 font-medium">
                                Model:
                            </label>
                            <input
                                type="text"
                                name="machineModel"
                                value={formData.machineModel}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />

                            <label htmlFor="machineWorkingArea" className="text-gray-700 dark:text-gray-300 font-medium">
                                Working Area:
                            </label>
                            <input
                                type="text"
                                name="machineWorkingArea"
                                value={formData.machineWorkingArea}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />

                            <label htmlFor="rentalPricePerHour" className="text-gray-700 dark:text-gray-300 font-medium">
                                Rental Price (per hour):
                            </label>
                            <input
                                type="number"
                                name="rentalPricePerHour"
                                value={formData.rentalPricePerHour}
                                onChange={handleChange}
                                min={0}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />

                            <label htmlFor="machineWorkingHours" className="text-gray-700 dark:text-gray-300 font-medium">
                                Working Hours:
                            </label>
                            <input
                                type="number"
                                name="machineWorkingHours"
                                value={formData.machineWorkingHours}
                                onChange={handleChange}
                                min={0}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />
                        </div>

                        <label htmlFor="machineParts" className="block mt-6 text-gray-700 dark:text-gray-300 font-medium">
                            Parts (comma separated):
                        </label>
                        <input
                            name="machineParts"
                            value={formData.machineParts}
                            onChange={handleChange}
                            className="mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                        />

                        <label htmlFor="machineImage" className="block mt-6 text-gray-700 dark:text-gray-300 font-medium">
                            Image URL:
                        </label>
                        <input
                            name="machineImage"
                            type="url"
                            value={formData.machineImage}
                            onChange={handleChange}
                            className="mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                        />

                        {formData.machineImage && isValidImageUrl(formData.machineImage) && (
                            <img
                                src={formData.machineImage}
                                alt="Machine Preview"
                                className="mt-4 rounded-lg shadow-md w-full md:w-1/2"
                            />
                        )}
                    </section>

                    {/* Description */}
                    <section className="border-b border-gray-300 dark:border-gray-700 pb-6">
                        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-3 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        ></textarea>
                    </section>

                    {/* Availability */}
                    <section className="border-b border-gray-300 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                            Availability
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label htmlFor="availabilityStartDate" className="text-gray-700 dark:text-gray-300 font-medium">
                                Available From:
                            </label>
                            <input
                                name="availabilityStartDate"
                                type="date"
                                value={formData.availabilityStartDate}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />
                            <label htmlFor="availabilityEndDate" className="text-gray-700 dark:text-gray-300 font-medium">
                                Available Until:
                            </label>
                            <input
                                name="availabilityEndDate"
                                type="date"
                                value={formData.availabilityEndDate}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                            />
                        </div>
                    </section>

                    {/* Location */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                            Location Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-medium">
                                    City:
                                </label>
                                <input
                                    name="city"
                                    value={formData.location.city}
                                    onChange={handleChange}
                                    className="mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="state" className="text-gray-700 dark:text-gray-300 font-medium">
                                    State:
                                </label>
                                <input
                                    name="state"
                                    value={formData.location.state}
                                    onChange={handleChange}
                                    className="mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="country" className="text-gray-700 dark:text-gray-300 font-medium">
                                    Country:
                                </label>
                                <input
                                    name="country"
                                    value={formData.location.country}
                                    onChange={handleChange}
                                    className="mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-300 ${loading
                                ? "bg-indigo-400"
                                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
                                }`}
                        >
                            {loading ? "Adding..." : "Add Machine"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMachine;
