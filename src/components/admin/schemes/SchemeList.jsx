import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Trash2, Eye, ExternalLink, Users, IndianRupee, Globe, FileText, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../../utils/api";
import AgriLoader from "../../commonComponent/AgriLoader";
import SchemeForm from "./SchemeForm"; // Imported SchemeForm

const SchemeList = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false); // State to toggle Form

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSchemes, setTotalSchemes] = useState(0);
    const limit = 10; // Schemes per page

    // ================= FETCH DATA WITH PAGINATION =================
    const fetchSchemes = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/gov-scheme", {
                params: {
                    page: currentPage,
                    limit: limit,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    search: searchTerm || undefined
                }
            });

            setSchemes(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setTotalSchemes(res.data.pagination?.totalCount || (res.data.data?.length || 0));
        } catch (error) {
            console.error("Error fetching schemes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchemes();
    }, [currentPage, statusFilter]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (currentPage !== 1) setCurrentPage(1);
            else fetchSchemes();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // ================= DELETE LOGIC =================
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this scheme?")) {
            try {
                await api.delete(`/api/gov-scheme/${id}`);
                fetchSchemes();
            } catch (error) {
                console.error("Error deleting scheme:", error);
                alert("Failed to delete the scheme.");
            }
        }
    };

    if (loading && schemes.length === 0) return <AgriLoader contentHeader="Government Schemes" />;

    // Conditional Rendering for the Add Form
    if (showAddForm) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
                <div className="max-w-4xl mx-auto">
                    <SchemeForm 
                        onClose={() => setShowAddForm(false)} 
                        onRefresh={fetchSchemes} 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
            
            {/* HEADER & SEARCH SECTION */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="w-2 h-8 bg-green-600 rounded-full" />
                            Scheme Portal
                        </h1>
                        <p className="text-gray-500 mt-1">Showing {schemes.length} of {totalSchemes} total initiatives</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20"
                            onClick={() => setShowAddForm(true)}
                        >
                            <Plus size={20} />
                            Add Scheme
                        </button>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search schemes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-xl border-none bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border-none bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 outline-none dark:text-white cursor-pointer font-medium"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active Only</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatBox icon={<CheckCircle className="text-green-500" />} label="Total Schemes" value={totalSchemes} />
                <StatBox icon={<Users className="text-blue-500" />} label="Total Beneficiaries" value="1.2M+" />
                <StatBox icon={<IndianRupee className="text-orange-500" />} label="Avg. Benefit" value="₹5,000+" />
            </div>

            {/* TABLE CONTAINER */}
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
                            <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Scheme Identification</th>
                                <th className="px-6 py-4">Target Group</th>
                                <th className="px-6 py-4">Benefit Details</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            <AnimatePresence mode="popLayout">
                                {schemes.map((scheme) => (
                                    <motion.tr
                                        key={scheme._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setSelectedScheme(scheme)}
                                        className="group cursor-pointer hover:bg-green-50/30 dark:hover:bg-green-900/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-green-600 dark:text-green-500">{scheme.scheme_id}</span>
                                                <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 transition-colors">
                                                    {scheme.scheme_name}
                                                </span>
                                                <span className="text-xs text-gray-400 mt-1 italic">{scheme.scheme_type}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Users size={14} className="text-blue-500" />
                                                {scheme.target_beneficiaries}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-500">{scheme.benefit_type}</span>
                                                <span className="text-sm font-black text-green-700 dark:text-green-400">
                                                    ₹{scheme.benefit_amount}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge status={scheme.scheme_status} />
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-green-600 hover:text-white transition-all">
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(e, scheme._id)}
                                                    className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between border-t dark:border-gray-800">
                    <p className="text-sm text-gray-500">
                        Page <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 disabled:opacity-50 text-gray-600 dark:text-gray-400"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 disabled:opacity-50 text-gray-600 dark:text-gray-400"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* DETAIL MODAL */}
            <AnimatePresence>
                {selectedScheme && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedScheme(null)}>
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedScheme.scheme_name}</h2>
                                    <p className="text-green-600 font-bold uppercase text-xs tracking-tighter mt-1">{selectedScheme.scheme_id}</p>
                                </div>
                                <button onClick={() => setSelectedScheme(null)} className="text-gray-400 hover:text-black text-2xl">✕</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem icon={<Globe size={16}/>} label="Launch Year" value={selectedScheme.launch_year} />
                                <DetailItem icon={<FileText size={16}/>} label="Eligibility" value={selectedScheme.eligibility_criteria} />
                                <DetailItem icon={<Users size={16}/>} label="Beneficiaries Count" value={selectedScheme.beneficiaries_count} />
                                <DetailItem icon={<IndianRupee size={16}/>} label="Funds Disbursed" value={selectedScheme.fund_disbursed_core} />
                                
                                <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Documents Required</label>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedScheme.document_required_column || "No documents specified"}</p>
                                </div>

                                <a 
                                    href={selectedScheme.scheme_website_link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="col-span-2 flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20"
                                >
                                    <ExternalLink size={18} /> Visit Official Website
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatBox = ({ icon, label, value }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">{icon}</div>
        <div>
            <p className="text-xs font-medium text-gray-400">{label}</p>
            <h3 className="text-xl font-black dark:text-white">{value}</h3>
        </div>
    </div>
);

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
        status === "Active" 
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
        {status}
    </span>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 text-green-600">{icon}</div>
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{value || "N/A"}</p>
        </div>
    </div>
);

export default SchemeList;