import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StatsCards from './StatsCards';
import RequestPanel from './RequestPanel';
import MachineList from './MachineList';
import api from '../../utils/api';

function ProviderDashboard() {
    const [myMachines, setMyMachines] = useState([]);
    const [myHireRequests, setMyHireRequests] = useState([]);
    const userId = localStorage.getItem('userId');
    // Sample Data (Replace with your logic/API)

    const avialableMachineCount = myMachines.filter(machine => machine.machineStatus === 'available').length;
    const pendingMaintenanceCount = myMachines.filter(machine => machine.machineStatus === 'maintenance').length;
    const workingMachineCount = myMachines.filter(machine => machine.machineStatus === 'rented' || machine.machineStatus === 'working').length;
    const unavailableMachineCount = myMachines.filter(machine => machine.machineStatus === 'unavailable').length;
    const workingProgress = myHireRequests.filter(request => request.status === 'completed').length;
useEffect(() => {
    if (!userId) return;

    const fetchMyMachine = async () => {
        try {
            // Fetch machines
            const machineRes = await api.get(
                `/api/machine-rental/get-machine-by-userId/${userId}`
            );

            setMyMachines(machineRes?.data?.data || machineRes?.data || []);

            // Fetch hire requests
            const hireRes = await api.get(
                `/api/machine-rental/provider/${userId}`
            );
            setMyHireRequests(hireRes?.data?.data || hireRes?.data || []);

        } catch (err) {
            console.error("Failed to fetch provider dashboard data:", err);
            setMyMachines([]);
            setMyHireRequests([]);
        }
    };

    fetchMyMachine();
}, [userId]);

    const stats = { totalMachines: myMachines.length, workDone: workingProgress, hireRequests: myHireRequests.length };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Provider Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back! Here is your equipment overview.</p>
                </div>

                {/* Top Section: Progress & Requests (Matching your sketch) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Progress Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Machine stack</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Available Machines</span>
                                    <span className="text-xs font-bold text-green-600">{avialableMachineCount}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(avialableMachineCount / myMachines.length) * 100}%` }} className="h-full bg-green-600 rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Working Machines</span>
                                    <span className="text-xs font-bold text-blue-600">{workingMachineCount}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(workingMachineCount / myMachines.length) * 100}%` }} className="h-full bg-blue-600 rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Unavailable Machines</span>
                                    <span className="text-xs font-bold text-red-600">{unavailableMachineCount}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(unavailableMachineCount / myMachines.length) * 100}%` }} className="h-full bg-red-600 rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Pending Maintenance</span>
                                    <span className="text-xs font-bold text-yellow-600">{pendingMaintenanceCount}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(pendingMaintenanceCount / myMachines.length) * 100}%` }} className="h-full bg-yellow-500 rounded-full" />
                                </div>
                            </div>
                            {/* <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Work Done</span>
                                    <span className="text-xs font-bold text-indigo-600">80%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} className="h-full bg-indigo-600 rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Pending Maintenance</span>
                                    <span className="text-xs font-bold text-yellow-600">20%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "20%" }} className="h-full bg-yellow-500 rounded-full" />
                                </div>
                            </div>*/}
                        </div>
                    </div>

                    {/* Request Section */}
                    <RequestPanel requests={myHireRequests} role="machineOwner" />
                    {/* <RequestPanel requests={myHireRequests} role="farmer" /> */}

                </div>

                {/* Middle Section: Stats Cards */}
                <StatsCards stats={stats} />

                {/* Bottom Section: My Machines List */}
                <MachineList machines={myMachines} />
            </div>
        </motion.div>
    );
}

export default ProviderDashboard;