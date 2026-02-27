import React from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckCircle, Briefcase } from 'lucide-react';

const StatsCards = ({ stats }) => {
    const cards = [
        { label: "Total Machines", value: stats.totalMachines || 0, icon: <Settings />, color: "text-blue-500" },
        { label: "Work Done", value: stats.workDone || 0, icon: <CheckCircle />, color: "text-green-500" },
        { label: "Hire Requests", value: stats.hireRequests || 0, icon: <Briefcase />, color: "text-purple-500" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700"
                >
                    <div className={`p-3 w-fit rounded-2xl bg-gray-50 dark:bg-gray-900 ${card.color} mb-4`}>
                        {card.icon}
                    </div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.label}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{card.value}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsCards;