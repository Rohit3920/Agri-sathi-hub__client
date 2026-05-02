import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, User, Briefcase, Calendar } from "lucide-react";
import api from "../../utils/api";

const WorkerRequestPanel = ({ requests = [], userMode }) => {
    const [localRequests, setLocalRequests] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    // Synchronize local state with props
    useEffect(() => {
        setLocalRequests(requests);
    }, [requests]);

    /**
     * 🔥 STATUS CHANGE FUNCTION
     * Matches your backend: exports.updateHireStatus
     * @param {string} hireId - The ID of the hire record
     * @param {string} newStatus - The target status (accepted, rejected, etc.)
     */
    const changeStatus = async (hireId, newStatus) => {
        try {
            setLoadingId(hireId);

            // Passing status and userRole as required by your backend logic
            // In the Worker Dashboard, the role is "servicer"
            await api.patch(`/api/labor/hire/${hireId}/status`, {
                status: newStatus,
                userRole: userMode
            });

            // 🚀 Instant UI Update
            setLocalRequests(prev =>
                prev.map(r =>
                    r._id === hireId
                        ? { ...r, status: newStatus }
                        : r
                )
            );

        } catch (error) {
            console.error("Update Error:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Failed to update status");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="text-indigo-500" size={22} />
                    Hire Requests
                </h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-bold rounded-full">
                    {localRequests.filter(r => r.status === 'pending').length} New
                </span>
            </div>

            {/* Scrollable List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {localRequests.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No requests found.
                    </div>
                ) : (
                    localRequests.map((req) => (
                        <motion.div
                            whileHover={{ y: -2 }}
                            key={req._id}
                            className="relative p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 transition-all"
                        >
                            {/* Work Type & Hire Type */}
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                                        <Briefcase size={14} className="text-indigo-500" />
                                        {req.workType}
                                    </h4>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">
                                        Type: {req.hireType}
                                    </p>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-tighter
                                    ${req.status === "pending" ? "bg-amber-100 text-amber-700" : 
                                      req.status === "accepted" ? "bg-blue-100 text-blue-700" : 
                                      req.status === "completed" ? "bg-emerald-100 text-emerald-700" : 
                                      "bg-rose-100 text-rose-700"}`}
                                >
                                    {req.status}
                                </span>
                            </div>

                            {/* Farmer Info */}
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                                <User size={12} className="text-gray-400" />
                                <span>Client: <span className="font-semibold text-gray-800 dark:text-gray-200">{req.farmerId?.username || "Farmer"}</span></span>
                            </div>

                            {/* Dates */}
                            <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-4 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{new Date(req.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="font-bold text-indigo-500">{req.days} Days</div>
                            </div>

                            {/* Action Buttons based on Backend Roles */}
                            <div className="flex gap-2">
                                {req.status === "pending" && (
                                    <>
                                        <button
                                            disabled={loadingId === req._id}
                                            onClick={() => changeStatus(req._id, "accepted")}
                                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200 dark:shadow-none"
                                        >
                                            {loadingId === req._id ? "..." : "ACCEPT"}
                                        </button>
                                        <button
                                            disabled={loadingId === req._id}
                                            onClick={() => changeStatus(req._id, "rejected")}
                                            className="flex-1 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                                        >
                                            REJECT
                                        </button>
                                    </>
                                )}

                                {req.status === "accepted" && (
                                    <div className="w-full text-center py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-xl border border-blue-100 dark:border-blue-800 italic">
                                        Wait for farmer to mark as completed
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkerRequestPanel;