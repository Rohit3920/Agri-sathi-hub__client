import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SchemeCard = ({ scheme, onClick }) => {
    return (
        <motion.div
            onClick={() => onClick(scheme)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.25 }}
            className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-green-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
        >
            {/* LEFT SIDE */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span
                        className="px-2 py-0.5
            bg-green-100 dark:bg-green-900
            text-green-700 dark:text-green-300
            text-xs font-bold rounded"
                    >
                        {scheme.scheme_id}
                    </span>

                    <span className="text-gray-400 dark:text-gray-500 text-sm">
                        Launch: {scheme.launch_year}
                    </span>

                    <span
                        className={`text-xs px-2 py-0.5 rounded font-semibold ${scheme.scheme_status === "Active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                            }`}
                    >
                        {scheme.scheme_status}
                    </span>
                </div>

                <h3
                    className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-green-800 dark:group-hover:text-green-400"
                >
                    {scheme.scheme_name}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">
                    {scheme.scheme_type}
                </p>

                {/* UPDATED STATE FIELD LOGIC */}
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    State: {Array.isArray(scheme.state) ? scheme.state.join(", ") : scheme.state}
                </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="mt-4 md:mt-0 text-left md:text-right flex items-center gap-3 justify-between md:justify-end">
                <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                        Benefit
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {scheme.benefit_amount}
                    </p>
                </div>

                <ArrowRight
                    size={20}
                    className="text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition"
                />
            </div>
        </motion.div>
    );
};

export default SchemeCard;