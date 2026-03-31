import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        userMode: "farmer",
        username: "",
        profilePicture: "",
        email: "",
        MobileNum: "",
        isAvailable: true,
        latitude: "",
        longitude: "",
        address: {
            street: "",
            subDistrict: "",
            district: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            addressType: "Current"
        }
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/api/auth/get-user/${userId}`);
                const user = res.data;

                setFormData({
                    userMode: user.userMode || "farmer",
                    username: user.username || "",
                    profilePicture: user.profilePicture || "",
                    email: user.email || "",
                    MobileNum: user.MobileNum || "",
                    isAvailable: user.isAvailable,
                    latitude: user.location?.coordinates?.[1] || "",
                    longitude: user.location?.coordinates?.[0] || "",
                    address: user.address?.[0] || {}
                });

            } catch {
                toast.error("Failed to load user");
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.address) {
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [name]: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                location: {
                    type: "Point",
                    coordinates: [
                        Number(formData.longitude),
                        Number(formData.latitude)
                    ]
                },
                address: [formData.address]
            };

            await api.put(`/api/auth/update-user/${userId}`, payload);
            toast.success("Profile Updated Successfully");

            setTimeout(() => {
                navigate("/profile");
            }, 1000);

        } catch {
            toast.error("Update Failed");
        }
    };

    const progress = (step / 3) * 100;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:to-gray-800 px-6 py-10">

            <div className="w-full h-full bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8">

                {/* HEADER */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-green-600 mb-2">
                        Update Your Profile
                    </h2>
                    <p className="text-gray-500">Complete your profile to get better services</p>
                </div>

                {/* PROGRESS */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-10">
                    <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="grid md:grid-cols-2 gap-8">

                        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-inner">
                            <img
                                src={formData.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                className="w-32 h-32 rounded-full border-4 border-green-500 object-cover mb-4"
                            />
                            <h1>{formData.username}</h1>
                            <h2>{`( ${formData.userMode} )`}</h2>
                        </div>

                        <div className="space-y-4">

                            <div>
                                <label className="font-semibold">User Mode</label>
                                <select name="userMode" value={formData.userMode} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                    <option value="farmer">Farmer</option>
                                    <option value="servicer">Servicer</option>
                                    <option value="worker">Worker</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold">Username</label>
                                <input name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                            </div>

                            <div>
                                <label className="font-semibold">Email</label>
                                <input name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" disabled/>
                            </div>

                            <div>
                                <label className="font-semibold">Mobile Number</label>
                                <input name="MobileNum" value={formData.MobileNum} onChange={handleChange} className="w-full p-2 border rounded-lg" disabled/>
                            </div>

                            <button onClick={() => setStep(2)} className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                                Continue →
                            </button>

                        </div>
                    </div>
                )}

                {/* STEP 2 (UPDATED WITH LABELS ✅) */}
                {step === 2 && (
                    <div className="space-y-6">

                        <label className="flex items-center gap-2 text-lg">
                            <input
                                type="checkbox"
                                checked={formData.isAvailable}
                                onChange={(e) =>
                                    setFormData({ ...formData, isAvailable: e.target.checked })
                                }
                            />
                            Available for Work
                        </label>

                        {/* ROW 1 */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-semibold">Street</label>
                                <input name="street" value={formData.address.street || ""} onChange={handleChange} className="p-3 border rounded-lg w-full" />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">Sub District</label>
                                <input name="subDistrict" value={formData.address.subDistrict || ""} onChange={handleChange} className="p-3 border rounded-lg w-full" />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">District</label>
                                <input name="district" value={formData.address.district || ""} onChange={handleChange} className="p-3 border rounded-lg w-full" />
                            </div>
                        </div>

                        {/* ROW 2 */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-semibold">City</label>
                                <input name="city" value={formData.address.city || ""} onChange={handleChange} className="p-3 border rounded-lg w-full" />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">State</label>
                                <input name="state" value={formData.address.state || ""} onChange={handleChange} className="p-3 border rounded-lg w-full" />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">Zip Code</label>
                                <input name="zipCode" value={formData.address.zipCode || ""} onChange={handleChange} className="p-3 border rounded-lg w-full" />
                            </div>
                        </div>

                        {/* ROW 3 */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold">Country</label>
                                <input name="country" value={formData.address.country || ""} onChange={handleChange} className="p-3 border rounded-lg w-full" />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">Address Type</label>
                                <select name="addressType" value={formData.address.addressType || "Current"} onChange={handleChange} className="p-3 border rounded-lg w-full">
                                    <option value="Permanent">Permanent</option>
                                    <option value="Current">Current</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button onClick={() => setStep(1)} className="px-6 py-2 bg-gray-400 text-white rounded-lg">
                                ← Back
                            </button>
                            <button onClick={() => setStep(3)} className="px-6 py-2 bg-green-600 text-white rounded-lg">
                                Continue →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="text-center space-y-6">

                        <h3 className="text-2xl font-bold text-green-600">Review Your Details</h3>

                        <img src={formData.profilePicture} className="w-24 h-24 rounded-full mx-auto border" />

                        <div className="grid md:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
                            <p><strong>Name:</strong> {formData.username}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Mobile:</strong> {formData.MobileNum}</p>
                            <p><strong>Role:</strong> {formData.userMode}</p>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button onClick={() => setStep(2)} className="px-6 py-2 bg-gray-400 text-white rounded-lg">
                                Back
                            </button>
                            <button onClick={handleSubmit} className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">
                                Submit
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}