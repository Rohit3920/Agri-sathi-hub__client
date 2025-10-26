import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

// Utility function to validate image URL
const isValidImageUrl = (url) =>
    /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg|gif)$/.test(url);

// Initial/Fallback Form State
const initialFormState = {
    machineName: "",
    machineRegistationNumber: "",
    machineType: "",
    machineModel: "",
    description: "",
    machineImage: "",
    machineParts: "", // Store as string for input
    machineWorkingArea: "",
    machineWorkingHours: 1,
    rentalPricePerHour: 0,
    availabilityStartDate: new Date().toISOString().split("T")[0],
    availabilityEndDate: "",
    location: { city: "", state: "", country: "" },
};

const UpdateMachine = () => {
    const { machineId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchMachineData = async () => {
            if (!machineId) {
                setFetchError("No machine ID provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/machine-rental/get-machine-by-id/${machineId}`);
                // Use response.data.data or fallback to response.data
                const machineData = response.data.data || response.data;

                const formattedData = {
                    ...machineData,
                    // Convert machineParts array to comma-separated string for the input field
                    machineParts: Array.isArray(machineData.machineParts)
                        ? machineData.machineParts.join(", ")
                        : "",
                    // Ensure dates are correctly formatted for the input type="date"
                    availabilityStartDate: machineData.availabilityStartDate
                        ? machineData.availabilityStartDate.split("T")[0]
                        : "",
                    availabilityEndDate: machineData.availabilityEndDate
                        ? machineData.availabilityEndDate.split("T")[0]
                        : "",
                    // Ensure location is present and handled
                    location: machineData.location || initialFormState.location
                };

                setFormData(formattedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching machine data:", error);
                setFetchError("Failed to load machine data. ID may be invalid.");
                setLoading(false);
            }
        };

        fetchMachineData();
    }, [machineId]);

    // --- Handlers & Validation ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            // Handle nested location fields
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

        // Simple error clearing
        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[name];
            if (name === 'city') delete updated.city;
            return updated;
        });
    };

    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
        setErrors({});
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
        if (!isEditing) return;
        if (!validateForm()) return;

        setLoading(true);

        const machinePartsArray = formData.machineParts
            .split(",")
            .map((p) => p.trim())
            .filter(p => p.length > 0);

        // Key Fix: Explicitly define the payload to match the backend schema
        const dataToSend = {
            machineName: formData.machineName,
            machineRegistationNumber: formData.machineRegistationNumber,
            machineType: formData.machineType,
            machineModel: formData.machineModel,
            description: formData.description,
            machineImage: formData.machineImage,
            machineParts: machinePartsArray, // Send as Array
            machineWorkingArea: formData.machineWorkingArea,
            machineWorkingHours: formData.machineWorkingHours,
            rentalPricePerHour: formData.rentalPricePerHour,
            availabilityStartDate: formData.availabilityStartDate,
            availabilityEndDate: formData.availabilityEndDate,
            location: formData.location, // Send the nested Location Object
        };

        console.log("Data sent to API:", dataToSend);

        try {
            await api.put(`/api/machine-rental/update-machine-details/${machineId}`, { updates: dataToSend });
            toast.success("✅ Machine updated successfully!");
            setLoading(false);
            setIsEditing(false);
            navigate("/machine-rentals");
        } catch (error) {
            console.error("API Error during update:", error.response || error);
            const errorMessage = error.response?.data?.message || "Please check console for details.";
            toast.error(`❌ Failed to update machine. ${errorMessage}`);
            setLoading(false);
        }
    };

    // --- Render Logic ---
    // ... (Your loading/error checks remain the same) ...

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <p className="text-xl text-gray-700 dark:text-gray-300">Loading machine data...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <p className="text-xl text-red-600 dark:text-red-400">Error: {fetchError}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10 transition-colors duration-300">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
                    Update Machine Information 🛠️
                </h2>

                {/* Edit Toggle Button */}
                <div className="flex justify-end mb-6">
                    <button
                        type="button"
                        onClick={toggleEditMode}
                        className={`py-2 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-300 flex items-center ${isEditing
                            ? "bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                            : "bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400"
                            }`}
                    >
                        {isEditing ? (
                            <>
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                Stop Editing
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                Start Editing
                            </>
                        )}
                    </button>
                </div>
                {/* End Edit Toggle Button */}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Display an alert if not editing */}
                    {!isEditing && (
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-center font-medium">
                            Click **"Start Editing"** to enable input fields and make changes.
                        </div>
                    )}

                    {/* Machine Details */}
                    <section className="border-b border-gray-300 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                            Machine Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input fields are conditionally disabled */}
                            {[
                                { name: "machineName", label: "Machine Name", type: "text" },
                                { name: "machineRegistationNumber", label: "Registration Number", type: "text" },
                                { name: "machineType", label: "Machine Type", type: "text" },
                                { name: "machineModel", label: "Model", type: "text" },
                                { name: "machineWorkingArea", label: "Working Area", type: "text" },
                                { name: "rentalPricePerHour", label: "Rental Price (per hour)", type: "number", min: 0 },
                                { name: "machineWorkingHours", label: "Working Hours", type: "number", min: 1 },
                            ].map((field) => (
                                <React.Fragment key={field.name}>
                                    <label htmlFor={field.name} className="text-gray-700 dark:text-gray-300 font-medium">
                                        {field.label}:
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name] || ""}
                                        onChange={handleChange}
                                        min={field.min}
                                        disabled={!isEditing}
                                        className={`p-3 rounded-md border w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700 focus:ring-indigo-500'} border-gray-300 dark:border-gray-600 dark:text-gray-100 focus:ring-2`}
                                    />
                                    {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Textarea for Parts */}
                        <label htmlFor="machineParts" className="block mt-6 text-gray-700 dark:text-gray-300 font-medium">
                            Parts (comma separated):
                        </label>
                        <input
                            name="machineParts"
                            value={formData.machineParts}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`mt-1 p-3 rounded-md border w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700 focus:ring-indigo-500'} border-gray-300 dark:border-gray-600 dark:text-gray-100 focus:ring-2`}
                        />
                        {errors.machineParts && <p className="text-red-500 text-sm mt-1">{errors.machineParts}</p>}

                        {/* Image URL Input */}
                        <label htmlFor="machineImage" className="block mt-6 text-gray-700 dark:text-gray-300 font-medium">
                            Image URL:
                        </label>
                        <input
                            name="machineImage"
                            type="url"
                            value={formData.machineImage}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`mt-1 p-3 rounded-md border w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700 focus:ring-indigo-500'} border-gray-300 dark:border-gray-600 dark:text-gray-100 focus:ring-2`}
                        />
                        {errors.machineImage && <p className="text-red-500 text-sm mt-1">{errors.machineImage}</p>}

                        {/* Image Preview */}
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
                            disabled={!isEditing}
                            className={`w-full rounded-md border shadow-sm ${!isEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700 focus:ring-indigo-500'} border-gray-300 dark:border-gray-600 dark:text-gray-100 p-3 focus:ring-2`}
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
                                disabled={!isEditing}
                                className={`p-3 rounded-md border w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700 focus:ring-indigo-500'} border-gray-300 dark:border-gray-600 dark:text-gray-100 focus:ring-2`}
                            />
                            <label htmlFor="availabilityEndDate" className="text-gray-700 dark:text-gray-300 font-medium">
                                Available Until:
                            </label>
                            <input
                                name="availabilityEndDate"
                                type="date"
                                value={formData.availabilityEndDate}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`p-3 rounded-md border w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700 focus:ring-indigo-500'} border-gray-300 dark:border-gray-600 dark:text-gray-100 focus:ring-2`}
                            />
                        </div>
                    </section>

                    {/* Location */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                            Location Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* The corrected map over the location keys */}
                            {['city', 'state', 'country'].map((name) => (
                                <div key={name}>
                                    <label htmlFor={name} className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                                        {name}:
                                    </label>
                                    <input
                                        name={name}
                                        value={formData.location[name] || ""} // Use || "" to handle null/undefined safely
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`mt-1 p-3 rounded-md border w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700 focus:ring-indigo-500'} border-gray-300 dark:border-gray-600 dark:text-gray-100 focus:ring-2`}
                                    />
                                    {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !isEditing}
                            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-300 ${loading || !isEditing
                                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
                                }`}
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateMachine;