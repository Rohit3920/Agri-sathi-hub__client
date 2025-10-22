import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        MobileNum: "",
        password: "",
        confirmPassword: "",
        profilePicture: "",
        address: {
            street: "",
            subDistrict: "",
            district: "",
            city: "",
            state: "",
            zipCode: "",
            country: "INDIA",
            addressType: "Permanent",
        }
    });

    // List of address fields to identify nested changes
    const addressFields = ["street", "subDistrict", "district", "city", "state", "zipCode", "country", "addressType"];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (addressFields.includes(name)) {
            // Handle nested address fields
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                },
            }));
        } else {
            // Handle top-level fields
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic frontend validation
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match ❌");
            return;
        }

        if (!formData.username || !formData.email || !formData.MobileNum || !formData.password) {
            toast.error("Please fill all required fields ⚠️");
            return;
        }

        // Create a data object for the API request without confirmPassword
        const { confirmPassword, ...dataToSend } = formData;
        console.log("Signup data to send:", dataToSend);

        try {
            // Reset form after submission
            setFormData({
                username: "",
                email: "",
                MobileNum: "",
                password: "",
                confirmPassword: "",
                profilePicture: "",
                address: {
                    street: "",
                    subDistrict: "",
                    district: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "INDIA",
                    addressType: "Permanent",
                }
            });

            // Send dataToSend (without confirmPassword)
            const response = await api.post('/api/auth/register', dataToSend);
            console.log("User signup data:", response.data);
            toast.success("Account created successfully 🎉");
        } catch (error) {
            // You might need to adjust how you access the error message
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(`Signup failed. Try again ❌: ${errorMessage}`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                            Username
                        </label>
                        <input type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                            Email
                        </label>
                        <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                            Mobile Number
                        </label>
                        <input type="tel" name="MobileNum" placeholder="Enter mobile number" value={formData.MobileNum} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                            Password
                        </label>
                        <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                            Confirm Password
                        </label>
                        <input type="password" name="confirmPassword" placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
                            required
                        />
                    </div>

                    {/* Address Fields */}

                    {/* Street and City */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                                Street
                            </label>
                            <input type="text" name="street" placeholder="Street" value={formData.address.street} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                                City
                            </label>
                            <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    {/* Sub-District and District */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                                Sub-District / Taluka
                            </label>
                            <input type="text" name="subDistrict" placeholder="Sub-District / Taluka" value={formData.address.subDistrict} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                                District
                            </label>
                            <input type="text" name="district" placeholder="District" value={formData.address.district} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <input type="text" name="state" placeholder="State" value={formData.address.state} onChange={handleChange} className="px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        />

                        <input type="text" name="zipCode" placeholder="ZIP Code" value={formData.address.zipCode} onChange={handleChange} className="px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        />
                        <input type="text" name="country" placeholder="Country" value={formData.address.country} onChange={handleChange} className="px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        />
                    </div>

                    {/* Address Type */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                            Address Type
                        </label>
                        <select
                            name="addressType"
                            value={formData.address.addressType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="Permanent">Permanent</option>
                            <option value="Current">Current</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}