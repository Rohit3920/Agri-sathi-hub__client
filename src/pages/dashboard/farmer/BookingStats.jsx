// components/farmer/BookingStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Users, CreditCard } from 'lucide-react';

export const BookingStats = ({ stats }) => {
    const cards = [
        { label: "Active Rentals", value: stats.activeRentals || 0, icon: <Truck />, color: "text-blue-500" },
        { label: "Workers Hired", value: stats.workersHired || 0, icon: <Users />, color: "text-green-500" },
        { label: "Total Spent", value: `₹${stats.totalSpent?.toLocaleString()}`, icon: <CreditCard />, color: "text-amber-500" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className={`p-3 w-fit rounded-2xl bg-gray-50 dark:bg-gray-900 ${card.color} mb-4`}>{card.icon}</div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">{card.label}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{card.value}</p>
                </motion.div>
            ))}
        </div>
    );
};