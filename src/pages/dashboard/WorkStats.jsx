// components/worker/WorkStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Briefcase, Users } from 'lucide-react';

export const WorkStats = ({ stats }) => {
    const cards = [
        { label: "Works Done", value: stats.done || 0, icon: <CheckCircle2 />, color: "text-green-500" },
        { label: "Total Assignments", value: stats.total || 0, icon: <Briefcase />, color: "text-blue-500" },
        { label: "Group Size", value: stats.groupSize || "N/A", icon: <Users />, color: "text-purple-500" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className={`p-3 w-fit rounded-2xl bg-gray-50 dark:bg-gray-900 ${card.color} mb-4`}>{card.icon}</div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">{card.label}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{card.value}</p>
                </motion.div>
            ))}
        </div>
    );
};

export const WorkProgressBar = ({ progress }) => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Assignment Progress</h3>
        <div className="space-y-6">
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Task Completion</span>
                    <span className="text-xs font-bold text-indigo-600">{progress}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-indigo-600 rounded-full" />
                </div>
            </div>
        </div>
    </div>
);