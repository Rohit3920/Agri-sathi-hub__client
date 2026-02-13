import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Calendar, Briefcase, Clock, CheckCircle } from "lucide-react";

const HireWorker = ({ workerId, farmerId, skills = [], onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ workType: "", startDate: "", days: 1 });
    const [customWork, setCustomWork] = useState(false);

    const calculateEndDate = (start, days) => {
        if (!start) return "";
        const d = new Date(start);
        d.setDate(d.getDate() + (parseInt(days) || 1));
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/labor/hire", {
                farmerId,
                workerId,
                hireType: "single",
                ...form,
                endDate: new Date(new Date(form.startDate).getTime() + (form.days * 86400000)).toISOString().split('T')[0]
            });
            onSuccess();
        } catch (err) {
            alert("Request failed: " + (err.response?.data?.message || "Server Error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <CheckCircle className="text-indigo-600" /> Hiring Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Skill Selection */}
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-3 block">Select Nature of Work</label>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <button
                                key={skill} type="button"
                                onClick={() => { setForm({ ...form, workType: skill }); setCustomWork(false); }}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${form.workType === skill ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}
                            >
                                {skill}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => { setCustomWork(true); setForm({ ...form, workType: "" }); }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border ${customWork ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
                        >
                            Other...
                        </button>
                    </div>
                </div>

                {customWork && (
                    <motion.input
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        type="text" placeholder="Specify work type..." required
                        className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none ring-2 ring-indigo-100 dark:ring-gray-600 focus:ring-indigo-500 transition-all outline-none"
                        onChange={(e) => setForm({ ...form, workType: e.target.value })}
                    />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-4 text-indigo-500" size={18} />
                            <input
                                type="date" required
                                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase">Duration (Days)</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-4 text-indigo-500" size={18} />
                            <input
                                type="number" min="1" required value={form.days}
                                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={(e) => setForm({ ...form, days: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {form.startDate && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-center">
                        <p className="text-sm font-bold text-indigo-800 dark:text-indigo-300">
                            Work ends on: <span className="text-lg">{calculateEndDate(form.startDate, form.days)}</span>
                        </p>
                    </div>
                )}

                <button
                    disabled={loading || !form.workType}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[1.5rem] font-black tracking-widest hover:shadow-2xl transition-all disabled:opacity-50"
                >
                    {loading ? "PROCESSING..." : "SEND HIRE REQUEST"}
                </button>
            </form>
        </div>
    );
};

export default HireWorker;