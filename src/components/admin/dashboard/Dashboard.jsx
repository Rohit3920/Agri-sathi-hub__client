import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    Users, Settings2, UserCog, CalendarCheck, 
    FileText, LayoutDashboard, Briefcase, Boxes 
} from "lucide-react";
import api from "../../../utils/api";
import AgriLoader from "../../commonComponent/AgriLoader";

const Dashboard = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({
        workers: 0,
        workerGroups: 0,
        schemes: 0,
        machines: 0,
        bookings: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                const [
                    workerRes, 
                    groupRes, 
                    schemeRes, 
                    machineRes, 
                    machineBookings, 
                    laborBookings,
                    userRes
                ] = await Promise.all([
                    api.get("/api/labor/workers/available"),
                    api.get("/api/labor/worker-groups"),
                    api.get("/api/gov-scheme"),
                    api.get("/api/machine-rental/list-machines"),
                    api.get("/api/machine-rental/all-requests"),
                    api.get("/api/labor/hire"),
                    api.get("/api/auth/get-all-users")
                ]);

                setCounts({
                    workers: workerRes.data?.length || 0,
                    workerGroups: groupRes.data?.length || 0,
                    schemes: schemeRes.data?.data?.length || 0,
                    machines: machineRes.data?.data?.length || 0,
                    bookings: (machineBookings.data?.data?.length || 0) + (laborBookings.data?.length || 0),
                    users: userRes.data?.length || 0
                });
            } catch (error) {
                console.error("Dashboard count fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <AgriLoader contentHeader="Syncing Dashboard..." />;

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 p-6 transition-colors duration-300">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-600 rounded-2xl shadow-xl shadow-green-600/20">
                        <LayoutDashboard className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                            Admin Overview
                        </h1>
                        <p className="text-gray-500 font-medium italic">Real-time statistics for Agri Sathi Hub</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <CountCard 
                    title="Available Workers" 
                    count={counts.workers} 
                    icon={<UserCog size={32} />} 
                    color="bg-blue-500" 
                    path="/admin/labor" 
                    navigate={navigate}
                />

                <CountCard 
                    title="Worker Groups" 
                    count={counts.workerGroups} 
                    icon={<Boxes size={32} />} 
                    color="bg-purple-500" 
                    path="/admin/labor" 
                    navigate={navigate}
                />

                <CountCard 
                    title="Active Schemes" 
                    count={counts.schemes} 
                    icon={<FileText size={32} />} 
                    color="bg-green-600" 
                    path="/admin/schemes" 
                    navigate={navigate}
                />

                <CountCard 
                    title="Total Machines" 
                    count={counts.machines} 
                    icon={<Settings2 size={32} />} 
                    color="bg-orange-500" 
                    path="/admin/machines" 
                    navigate={navigate}
                />

                <CountCard 
                    title="Total Bookings" 
                    count={counts.bookings} 
                    icon={<CalendarCheck size={32} />} 
                    color="bg-rose-500" 
                    path="/admin/bookings" 
                    navigate={navigate}
                />

                <CountCard 
                    title="System Users" 
                    count={counts.users} 
                    icon={<Users size={32} />} 
                    color="bg-indigo-600" 
                    path="/admin/users" 
                    navigate={navigate}
                />

            </div>
        </div>
    );
};

const CountCard = ({ title, count, icon, color, path, navigate }) => {
    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(path)}
            className="group cursor-pointer bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col justify-between transition-all"
        >
            <div className="flex justify-between items-start">
                <div className={`p-4 ${color} text-white rounded-2xl shadow-lg group-hover:rotate-6 transition-transform`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
                    <h3 className="text-5xl font-black text-gray-900 dark:text-white mt-2">
                        {count}
                    </h3>
                </div>
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t dark:border-gray-800 pt-4">
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-green-600 transition-colors uppercase">
                    View Details →
                </span>
                <div className="h-1 w-12 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} w-2/3`} />
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;