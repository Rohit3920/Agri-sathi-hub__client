import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Calendar, Clock, Wrench, IndianRupee } from "lucide-react";

const HireMachine = ({
    machineId,
    farmerId,      // Renamed from renterId to match your model
    providerId,    // Added providerId (the owner of the machine)
    machineName,
    machineParts = [],
    rentalPricePerHour = 0,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        selectedParts: [],
        startDate: "",
        endDate: "",
        dailyHours: 1,
    });

    // Calculate total days
    const getTotalDays = () => {
        if (!form.startDate || !form.endDate) return 0;
        const start = new Date(form.startDate);
        const end = new Date(form.endDate);
        // Reset time to midnight for accurate day calculation
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const diff = (end - start) / (1000 * 60 * 60 * 24);
        return diff >= 0 ? diff + 1 : 0;
    };

    const totalDays = getTotalDays();
    const totalCost = totalDays * form.dailyHours * rentalPricePerHour;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Construct payload to match your Mongoose Model exactly
        const payload = {
            machineId,
            farmerId,
            providerId,
            selectedParts: form.selectedParts,
            startDate: form.startDate,
            endDate: form.endDate,
            dailyHours: Number(form.dailyHours),
            totalDays,
            totalCost
        };

        try {
            await api.post("/api/machine-rental/request", payload);
            onSuccess && onSuccess();
            alert("Rental request sent successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Rental request failed");
        } finally {
            setLoading(false);
        }
    };

    const togglePart = (part) => {
        setForm(prev => ({
            ...prev,
            selectedParts: prev.selectedParts.includes(part)
                ? prev.selectedParts.filter(p => p !== part)
                : [...prev.selectedParts, part]
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Wrench className="text-indigo-600" />
                Hire {machineName}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Machine Parts Selection */}
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-3 block">
                        Select Required Attachments
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {machineParts.map((part) => (
                            <button
                                key={part}
                                type="button"
                                onClick={() => togglePart(part)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all
                                ${form.selectedParts.includes(part)
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                                }`}
                            >
                                {part}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-4 text-indigo-500" size={18} />
                            <input
                                type="date"
                                required
                                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">End Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-4 text-indigo-500" size={18} />
                            <input
                                type="date"
                                required
                                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Hours Selection */}
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Daily Usage (Hours)</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-4 text-indigo-500" size={18} />
                        <input
                            type="number"
                            min="1"
                            max="24"
                            required
                            value={form.dailyHours}
                            className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            onChange={(e) => setForm({ ...form, dailyHours: e.target.value })}
                        />
                    </div>
                </div>

                {/* Price Calculation Summary */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-center">
                    <p className="font-bold text-indigo-800 dark:text-indigo-300 flex justify-center items-center gap-2">
                        <IndianRupee size={16} />
                        ₹{rentalPricePerHour} / hour
                    </p>
                    {totalDays > 0 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {totalDays} days × {form.dailyHours} hrs/day
                            </p>
                            <p className="mt-1 text-xl font-black text-indigo-900 dark:text-indigo-200">
                                Total: ₹{totalCost.toLocaleString()}
                            </p>
                        </motion.div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || totalDays <= 0}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[1.5rem] font-black tracking-widest hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "SENDING REQUEST..." : "CONFIRM RENTAL"}
                </button>
            </form>
        </div>
    );
};

export default HireMachine;