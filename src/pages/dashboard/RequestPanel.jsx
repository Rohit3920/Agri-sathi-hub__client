import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import api from "../../utils/api";

const RequestPanel = ({ requests = [] }) => {
    const [localRequests, setLocalRequests] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        setLocalRequests(requests);
    }, [requests]);

    // 🔥 STATUS CHANGE FUNCTION
    const changeStatus = async (rentalId, newStatus) => {
        try {
            setLoadingId(rentalId);

            await api.patch(
                `/api/machine-rental/status/${rentalId}`,
                { status: newStatus }
            );

            // 🚀 Instant UI Update (No refresh needed)
            setLocalRequests(prev =>
                prev.map(r =>
                    r._id === rentalId
                        ? { ...r, status: newStatus }
                        : r
                )
            );

        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="text-indigo-500" size={20} />
                    Rental Requests
                </h3>

                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-bold rounded-full">
                    {localRequests.length}
                </span>
            </div>

            {/* List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">

                {localRequests.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No requests available
                    </p>
                ) : (
                    localRequests.map((req) => (
                        <motion.div
                            whileHover={{ x: 4 }}
                            key={req._id}
                            className="relative p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-indigo-300 transition-all"
                        >
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {req.machineId?.machineName}
                            </p>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Farmer: {req.farmerId?.username}
                            </p>

                            {/* Status Badge */}
                            <span className={`inline-block mt-2 px-2 py-1 text-[10px] font-bold rounded-full
                                ${req.status === "pending" && "bg-yellow-100 text-yellow-700"}
                                ${req.status === "accepted" && "bg-blue-100 text-blue-700"}
                                ${req.status === "startWork" && "bg-purple-100 text-purple-700"}
                                ${req.status === "completed" && "bg-green-100 text-green-700"}
                                ${req.status === "rejected" && "bg-red-100 text-red-700"}
                                ${req.status === "cancelled" && "bg-gray-200 text-gray-700"}
                            `}>
                                {req.status}
                            </span>

                            {/* Buttons */}
                            <div className="mt-3 flex gap-2 flex-wrap">

                                {req.status === "pending" && (
                                    <>
                                        <button
                                            disabled={loadingId === req._id}
                                            onClick={() => changeStatus(req._id, "accepted")}
                                            className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase"
                                        >
                                            Accept
                                        </button>

                                        <button
                                            disabled={loadingId === req._id}
                                            onClick={() => changeStatus(req._id, "rejected")}
                                            className="px-3 py-1 bg-gray-300 text-gray-800 text-[10px] font-bold rounded-lg uppercase"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                {req.status === "accepted" && (
                                    <>
                                        <button
                                            disabled={loadingId === req._id}
                                            onClick={() => changeStatus(req._id, "startWork")}
                                            className="px-3 py-1 bg-purple-600 text-white text-[10px] font-bold rounded-lg uppercase"
                                        >
                                            Start Work
                                        </button>

                                        <button
                                            disabled={loadingId === req._id}
                                            onClick={() => changeStatus(req._id, "cancelled")}
                                            className="px-3 py-1 bg-gray-300 text-gray-800 text-[10px] font-bold rounded-lg uppercase"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {req.status === "startWork" && (
                                    <button
                                        disabled={loadingId === req._id}
                                        onClick={() => changeStatus(req._id, "completed")}
                                        className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold rounded-lg uppercase"
                                    >
                                        Complete
                                    </button>
                                )}
                            </div>

                            {/* Date */}
                            <span className="absolute bottom-3 right-4 text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                                {req.createdAt
                                    ? new Date(req.createdAt).toLocaleDateString("en-IN", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : ""}
                            </span>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RequestPanel;