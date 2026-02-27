// components/farmer/ServiceTracker.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const ServiceTracker = ({ bookings }) => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Service Status</h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {bookings.map((item, i) => (
                <motion.div whileHover={{ x: 5 }} key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-black text-gray-900 dark:text-white">{item.serviceName}</p>
                            <p className="text-xs text-gray-500">Provider: {item.providerName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {item.status}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            className={`h-full rounded-full ${item.status === 'Running' ? 'bg-green-500' : 'bg-blue-500'}`}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);