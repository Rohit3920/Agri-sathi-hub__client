import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, LayoutDashboard, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import child components
import { WorkStats, WorkProgressBar } from './WorkStats';
import { TaskStatus } from './TaskStatus';
import api from '../../utils/api';
import WorkerRequestPanel from './WorkerRequestPanel';

function WorkerDashboard() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [workerHireList, setWorkerHireList] = useState([]);
    const [workerHireGroupList, setWorkerGroupHireList] = useState([]);
    const [workerList, setWorkerList] = useState([]);
    const [workerGroupList, setWorkerGroupList] = useState([]);

    // Derived State
    const totalHireReq = workerHireList.length + workerHireGroupList.length;
    
    const completeWork = [
        ...workerHireList,
        ...workerHireGroupList
    ].filter(req => req.status === "completed").length;

    // Construct the stats object for the WorkStats component
    const stats = {
        complete: completeWork,
        total: totalHireReq,
        group: workerGroupList.length,
        individual: workerList.length
    };

    // Calculate progress percentage dynamically
    const progressValue = totalHireReq > 0 ? (completeWork / totalHireReq) * 100 : 0;

    // Logic fixes for display
    const hasGroup = workerGroupList.length > 0;
    const hasWorkerProfile = workerList.length > 0;

    // Combined ALL requests (Single + Group) for the WorkerRequestPanel
    const allRequests = [...workerHireList, ...workerHireGroupList];

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const [wList, gList, wHire, gHire] = await Promise.all([
                    api.get(`/api/labor/single-worker/worker/${userId}`),
                    api.get(`/api/labor/worker-group/worker/${userId}`),
                    api.get(`/api/labor/single-worker-hire/worker/${userId}`),
                    api.get(`/api/labor/worker-group-hire/worker/${userId}`)
                ]);

                console.log("Worker:", wHire, gHire);

                // Setting state with fallbacks for different API response structures
                setWorkerList(wList?.data?.data || wList?.data || []);
                setWorkerGroupList(gList?.data?.data || gList?.data || []);
                setWorkerHireList(wHire?.data?.data || wHire?.data || []);
                setWorkerGroupHireList(gHire?.data?.data || gHire?.data || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <LayoutDashboard className="text-indigo-600" /> Worker Dashboard
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">Manage your work, groups, and rental requests.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center"
                            onClick={() => navigate("/worker/create-worker")}
                        >
                            Create Worker Profile
                        </button>

                        <button
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center"
                            onClick={() => navigate("/group/create-group")}
                        >
                            Create Group Profile
                        </button>
                    </div>
                </div>

                {/* Top Section: Progress & Requests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <WorkProgressBar progress={progressValue} />
                    {/* Ensure userRole matches what your WorkerRequestPanel expects */}
                    <WorkerRequestPanel requests={allRequests} userRole="servicer" />
                </div>

                {/* Stats Cards */}
                <WorkStats stats={stats} />

                {/* Dynamic Section: My Group + My Worker Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                    {/* My Group Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">My Group</h3>
                        {hasGroup ? (
                            workerGroupList.map((group, index) => (
                                <div className="space-y-4 mb-4" key={group._id || index}>
                                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                                            Active Group: {group?.groupName || "Assigned Team"}
                                        </p>
                                        <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">Status: Ready for deployment</p>
                                    </div>
                                    <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300 text-sm">
                                        View Team Members
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">You are not part of any group yet.</p>
                                <button
                                    className="px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-all"
                                    onClick={() => navigate("/group/create-group")}
                                >
                                    + Create or Join Group
                                </button>
                            </div>
                        )}
                    </div>

                    {/* My Worker Profile Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">My Worker Profile</h3>
                        {hasWorkerProfile ? (
                            workerList.map((item, index) => (
                                <div className="space-y-4 mb-4" key={item._id || index}>
                                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                                        <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                            Active Worker: {item?.userId?.username || "Individual Profile"}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {item?.skills?.map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-white dark:bg-gray-700 rounded-md text-[10px] font-bold text-emerald-600 uppercase border border-emerald-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">You have not created a worker profile yet.</p>
                                <button
                                    className="px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-all"
                                    onClick={() => navigate("/worker/create-worker")}
                                >
                                    + Create Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default WorkerDashboard;