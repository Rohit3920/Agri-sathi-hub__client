import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Tractor,
    FileText,
    LayoutDashboard,
    ChevronRight,
    ArrowUpRight,
    MessageCircle,
    Info
} from "lucide-react";

const ServiceHub = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Labor Hire",
            desc: "Connect with skilled agricultural workers & management groups for manual farming tasks.",
            icon: <Users className="w-8 h-8 text-blue-600" />,
            path: "/labor-hire",
            color: "bg-blue-50 dark:bg-blue-900/20",
            borderColor: "border-blue-100 dark:border-blue-800",
            badge: "Active Workers"
        },
        {
            title: "Machine Rental",
            desc: "Access a wide range of modern tractors, tillers, and harvesters from verified owners.",
            icon: <Tractor className="w-8 h-8 text-emerald-600" />,
            path: "/machine-rentals",
            color: "bg-emerald-50 dark:bg-emerald-900/20",
            borderColor: "border-emerald-100 dark:border-emerald-800",
            badge: "Instant Booking"
        },
        {
            title: "Gov Schemes",
            desc: "Browse and apply for the latest government agricultural subsidies and E-Gov services.",
            icon: <FileText className="w-8 h-8 text-purple-600" />,
            path: "/egov-services",
            color: "bg-purple-50 dark:bg-purple-900/20",
            borderColor: "border-purple-100 dark:border-purple-800",
            badge: "E-Gov Portal"
        },
        {
            title: "Agri Dashboard",
            desc: "Comprehensive overview of your farm activities, equipment rentals, and crop progress.",
            icon: <LayoutDashboard className="w-8 h-8 text-orange-600" />,
            path: "/dashboard",
            color: "bg-orange-50 dark:bg-orange-900/20",
            borderColor: "border-orange-100 dark:border-orange-800",
            badge: "Analytics"
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none">
                    <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Agri Sathi Services</h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Digital Solutions for Modern Farmers</p>
                </div>
            </div>

            {/* 2x2 Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        onClick={() => navigate(service.path)}
                        className={`group cursor-pointer p-8 rounded-[2.5rem] border-2 ${service.borderColor} ${service.color} transition-all shadow-2xl shadow-transparent hover:shadow-emerald-500/10 flex flex-col justify-between min-h-[240px]`}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 bg-white/60 dark:bg-black/30 rounded-full text-gray-600 dark:text-gray-300 border border-white/50 dark:border-gray-700">
                                    {service.badge}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                {service.title}
                                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-emerald-600" />
                            </h3>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                {service.desc}
                            </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                                Access Service <ChevronRight className="w-4 h-4" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                <ChevronRight className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Support Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-12 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Agri Sathi Support</h4>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">Our AI Chatbot is here to guide you through these services</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/user/messages')}
                    className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-105 transition-transform"
                >
                    Contact Expert
                </button>
            </motion.div>
        </div>
    );
};

export default ServiceHub;