import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, PlusCircle } from 'lucide-react';
import { BookingStats } from './farmer/BookingStats';
import { ServiceTracker } from './farmer/ServiceTracker';
import RequestPanel from './RequestPanel';
import api from '../../utils/api';


function FarmerDashboard() {
    const userId = localStorage.getItem('userId');
    const [myMachines, setMyMachines] = useState([]);
    const [myHireRequests, setMyHireRequests] = useState([]);
    const [farmerData] = useState({
        stats: { activeRentals: 3, workersHired: 8, totalSpent: 45000 },
        activeServices: [
            { serviceName: "Mahindra Tractor", providerName: "AgroServices Ltd", status: "Running", progress: 65 },
            { serviceName: "Harvesting Group (5 Men)", providerName: "Community Labor", status: "Scheduled", progress: 10 },
            { serviceName: "Pesticide Drone", providerName: "SkyFarm Tech", status: "Running", progress: 90 },
        ]
    });

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

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Top Navigation & Quick Search */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">Farmer Dashboard</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Hire machines and labor for your farm operations.</p>
                    </div>

                    <div className="flex w-full lg:w-auto gap-3">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Find machines or workers..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200"
                            />
                        </div>
                        <button className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Left/Middle Column: Stats & Quick Hire */}
                    <div className="lg:col-span-2">
                        <BookingStats stats={farmerData.stats} />

                        {/* Find Services Section */}
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2">Need more help?</h3>
                                <p className="opacity-80 mb-6 max-w-md">Browse available machines and verified labor groups in your area of Pimpri-Chinchwad.</p>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm uppercase">Hire Machine</button>
                                    <button className="px-6 py-3 bg-indigo-500 text-white border border-indigo-400 rounded-xl font-black text-sm uppercase">Hire Workers</button>
                                </div>
                            </div>
                            {/* Decorative Circle */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 rounded-full opacity-50 blur-3xl" />
                        </div>
                    </div>

                    {/* Right Column: Tracking Panel */}
                    <div className="lg:col-span-1">
                        <ServiceTracker bookings={farmerData.activeServices} />
                    </div>
                </div>

                {/* Bottom Section: Recent Notifications or History */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Activity</h3>
                        <button className="text-indigo-600 font-bold text-sm">View History</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border-l-4 border-green-500 bg-gray-50 dark:bg-gray-900 rounded-r-2xl">
                            <PlusCircle className="text-green-500" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                New machine request for <strong>Combine Harvester</strong> was accepted by Provider.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 p-4 border-l-4 border-indigo-500 bg-gray-50 dark:bg-gray-900 rounded-r-2xl">
                            <MapPin className="text-indigo-500" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Worker group <strong>"Village Power"</strong> has arrived at your location.
                            </p>
                        </div>
                    </div>
                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Progress Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Work Progress</h3>
                        <div className="space-y-6">
                            <div>
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
                            </div>
                        </div>
                    </div>

                    {/* Request Section */}
                    {/* <RequestPanel requests={myHireRequests} role="machineOwner" /> */}
                    <RequestPanel requests={myHireRequests} role="farmer" />

                </div>

            </div>
        </motion.div>
    );
}

export default FarmerDashboard;