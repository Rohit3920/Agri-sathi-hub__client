import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, User, Briefcase, Calendar, Clock } from "lucide-react";
import api from "../../utils/api";

const WorkerRequestPanel = ({ requests = [], userRole = "servicer" }) => {
    const [localRequests, setLocalRequests] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        setLocalRequests(requests);
    }, [requests]);

    const changeStatus = async (hireId, newStatus) => {
        try {
            setLoadingId(hireId);

            // Matches your backend route and controller expectations
            await api.patch(`/api/labor/hire/${hireId}/status`, {
                status: newStatus,
                userRole: userRole
            });

            // Instant Local UI Update
            setLocalRequests(prev =>
                prev.map(r => r._id === hireId ? { ...r, status: newStatus } : r)
            );

        } catch (error) {
            console.error("Update Error:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Action not allowed for your role.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                        <Bell className="text-indigo-600 dark:text-indigo-400" size={20} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                        {userRole === "servicer" ? "Work Invites" : "Hiring History"}
                    </h3>
                </div>
                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    {localRequests.length} Total
                </span>
            </div>

            {/* List Container */}
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow" style={{ maxHeight: "450px" }}>
                {localRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-40">
                        <Clock size={40} className="mb-2" />
                        <p className="text-sm font-bold">No requests found</p>
                    </div>
                ) : (
                    localRequests.map((req) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={req._id}
                            className="relative p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group"
                        >
                            {/* Work Info */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter mb-0.5">
                                        {req.hireType} Hire
                                    </p>
                                    <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Briefcase size={16} className="opacity-50" />
                                        {req.workType}
                                    </h4>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase
                                    ${req.status === "pending" ? "bg-amber-100 text-amber-700" :
                                        req.status === "accepted" ? "bg-blue-100 text-blue-700" :
                                            req.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                                                "bg-rose-100 text-rose-700"}`}
                                >
                                    {req.status}
                                </div>
                            </div>

                            {/* Details Row */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <User size={14} className="text-gray-400" />
                                    <span className="truncate">{req.farmerId?.username || "Unknown Client"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span>{req.days} Days</span>
                                </div>
                            </div>

                            {/* Dynamic Buttons based on userRole & Backend Logic */}
                            <div className="flex gap-2">
                                {/* SERVICER ACTIONS */}
                                {userRole === "servicer" && req.status === "pending" && (
                                    <>
                                        <button
                                            disabled={loadingId === req._id}
                                            onClick={() => changeStatus(req._id, "accepted")}
                                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                                        >
                                            {loadingId === req._id ? "Processing..." : "Accept"}
                                        </button>
                                        <button
                                            disabled={loadingId === req._id}
                                            onClick={() => changeStatus(req._id, "rejected")}
                                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-500 text-[10px] font-black rounded-xl uppercase hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                {/* FARMER ACTIONS */}
                                {userRole === "farmer" && (
                                    <>
                                        {req.status === "pending" && (
                                            <button
                                                disabled={loadingId === req._id}
                                                onClick={() => changeStatus(req._id, "rejected")}
                                                className="flex-1 py-2 bg-rose-100 text-rose-700 text-[10px] font-black rounded-xl uppercase hover:bg-rose-600 hover:text-white transition-all"
                                            >
                                                Cancel Request
                                            </button>
                                        )}
                                        {req.status === "accepted" && (
                                            <button
                                                disabled={loadingId === req._id}
                                                onClick={() => changeStatus(req._id, "completed")}
                                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl uppercase transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                    </>
                                )}

                                {/* Read-only State for Servicer when Accepted */}
                                {userRole === "servicer" && req.status === "accepted" && (
                                    <div className="w-full text-center py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[9px] font-bold uppercase border border-dashed border-blue-200">
                                        Confirmed • Waiting for Client Completion
                                    </div>
                                )}
                            </div>

                            {/* Timestamp */}
                            <p className="absolute bottom-3 right-5 text-[9px] text-gray-400 font-medium">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkerRequestPanel;