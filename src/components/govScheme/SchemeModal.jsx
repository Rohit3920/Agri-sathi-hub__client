import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SchemeModal = ({ scheme, onClose }) => {
    return (
        <AnimatePresence>
            {scheme && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ y: 50, scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 50, scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-900
            text-gray-800 dark:text-gray-100
            rounded-3xl w-full max-w-3xl max-h-[90vh]
            overflow-y-auto shadow-2xl"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-700 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                                Scheme Details
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-6">
                            <section>
                                <h1 className="text-2xl font-bold mb-2">
                                    {scheme.scheme_name}
                                </h1>
                                <p className="text-green-600 dark:text-green-400 font-semibold">
                                    {scheme.scheme_id} | Launched in {scheme.launch_year}
                                </p>
                            </section>

                            {/* Grid Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y dark:border-gray-700">
                                <div>
                                    <p className="text-xs uppercase text-gray-400">State</p>
                                    {/* Changed logic to handle array of states */}
                                    <p>
                                        {Array.isArray(scheme.state) 
                                            ? scheme.state.join(", ") 
                                            : scheme.state}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-400">
                                        Benefit Amount
                                    </p>
                                    <p className="text-green-600 dark:text-green-400 font-bold">
                                        {scheme.benefit_amount}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-400">
                                        Scheme Type
                                    </p>
                                    <p>{scheme.scheme_type}</p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-400">
                                        Benefit Type
                                    </p>
                                    <p>{scheme.benefit_type}</p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-400">
                                        Scheme Status
                                    </p>
                                    <p
                                        className={`font-semibold ${scheme.scheme_status === "Active"
                                                ? "text-green-600"
                                                : "text-red-500"
                                            }`}
                                    >
                                        {scheme.scheme_status}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-400">
                                        Target Beneficiaries
                                    </p>
                                    <p>{scheme.target_beneficiaries}</p>
                                </div>
                            </div>

                            {/* Eligibility */}
                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Eligibility Criteria
                                </p>
                                <p className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mt-2">
                                    {scheme.eligibility_criteria}
                                </p>
                            </div>

                            {/* Documents Required */}
                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Required Documents
                                </p>
                                <p className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mt-2">
                                    {scheme.document_required_column}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex gap-4">
                            <a
                                href={scheme.scheme_website_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-green-700 hover:bg-green-800 
                text-white text-center py-3 rounded-xl font-bold transition"
                            >
                                Apply Now
                            </a>

                            <button
                                onClick={onClose}
                                className="px-6 py-3 border rounded-xl dark:border-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SchemeModal;