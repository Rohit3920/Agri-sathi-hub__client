// import React from 'react'
// import CreateWorkerProfile from '../../components/labor-hiring/CreateWorkerProfile'
// import CreateWorkerGroup from '../../components/labor-hiring/CreateWorkerGroup'
// import StatusUpdate from '../../components/labor-hiring/StatusUpdate'

// function WorkerDashboard() {
//     const userId = localStorage.getItem('userId')
//     const hireId = "6983583f264328a6632ce056"
//     return (
//         <div>
//             <h2>This is Worker dashboard </h2>

//             <StatusUpdate hireId={hireId}/>

//             <CreateWorkerProfile userId={userId}/>

//             <CreateWorkerGroup leaderId={userId} />
//         </div>
//     )
// }

// export default WorkerDashboard


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, LayoutDashboard, Bell } from 'lucide-react';
import  { useNavigate } from 'react-router-dom';

// Import child components
import { WorkStats, WorkProgressBar } from './WorkStats';
import { TaskStatus } from './TaskStatus';
import RequestPanel from './RequestPanel'; // Reusing your RequestPanel

function WorkerDashboard() {
    // Mock State (Replace with your actual API calls)
    const navigate = useNavigate();
    const [hasGroup, setHasGroup] = useState(true);
    const [workerData, setWorkerData] = useState({
        stats: { done: 12, total: 15, groupSize: 5 },
        progress: 75,
        requests: [
            { machineName: "Field Plowing", farmerName: "Vikas Patil" },
            { machineName: "Crop Harvesting", farmerName: "Amit Shah" }
        ],
        tasks: [
            { title: "West Field Plowing", location: "Section A", status: "active" },
            { title: "Equipment Repair", location: "Main Shed", status: "pending" }
        ]
    });

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
                    <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all flex items-center" onClick={()=> navigate("/worker/create-worker")}>
                        Create Worker Profile
                    </button>

                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center" onClick={()=> navigate("/group/create-group")}>
                        Create Group Profile
                    </button>

                    {/* <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2"> */}
                        {/* <UserPlus size={18} /> Find New Work */}
                    {/* </button> */}
                </div>

                {/* Top Section: Progress & Requests (Matching Sketch) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <WorkProgressBar progress={workerData.progress} />
                    <RequestPanel requests={workerData.requests} />
                </div>

                {/* Stats Cards */}
                <WorkStats stats={workerData.stats} />

                {/* Dynamic Section: My Group + Work Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Conditional Group Component */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">My Group</h3>
                        {hasGroup ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Active Group: Green Harvest Team</p>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">Status: Ready for deployment</p>
                                </div>
                                <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300 text-sm">View Team Members</button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">You are not part of any group yet.</p>
                                <button className="px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-all">
                                    + Create or Join Group
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pending/Active Work Section */}
                    <TaskStatus tasks={workerData.tasks} />
                </div>

            </div>
        </motion.div>
    );
}

export default WorkerDashboard;
