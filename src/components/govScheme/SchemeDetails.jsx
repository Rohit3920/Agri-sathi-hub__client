import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, RotateCcw } from "lucide-react";
import SchemeCard from "./SchemeCard";
import SchemeModal from "./SchemeModal";
import api from "../../utils/api";

const SchemeDetails = () => {
    const [schemesData, setSchemesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedBenefit, setSelectedBenefit] = useState("");
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [loading, setLoading] = useState(true);

    // ================= PAGINATION =================
    const [currentPage, setCurrentPage] = useState(1);
    const schemesPerPage = 6;

    // ================= FETCH DATA =================
    useEffect(() => {
        const dataLoad = async () => {
            try {
                const res = await api.get("/api/gov-scheme");
                setSchemesData(res.data.data || []);
            } catch (error) {
                console.error("Error fetching schemes:", error);
            } finally {
                setLoading(false);
            }
        };

        dataLoad();
    }, []);

    // ================= FILTER LOGIC =================
    const filteredSchemes = useMemo(() => {
        return schemesData.filter((scheme) => {
            const search = searchTerm.toLowerCase().trim();

            const matchesSearch = search === "" || [
                scheme["scheme_id"],
                scheme["scheme_name"],
                scheme["benefit_type"],
                scheme.state, // This will be joined/checked below
                scheme["scheme_status"],
                scheme["launch_year"]
            ].some(field =>
                Array.isArray(field)
                    ? field.some(val => val?.toString().toLowerCase().includes(search))
                    : field?.toString().toLowerCase().includes(search)
            );

            // UPDATED STATE FILTER: Checks if selectedState exists in the scheme.state array
            const matchesState =
                selectedState === "" ||
                (Array.isArray(scheme.state)
                    ? scheme.state.includes(selectedState)
                    : scheme.state === selectedState);

            const matchesBenefit =
                selectedBenefit === "" ||
                scheme["benefit_type"] === selectedBenefit;

            return matchesSearch && matchesState && matchesBenefit;
        });
    }, [schemesData, searchTerm, selectedState, selectedBenefit]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedState, selectedBenefit]);

    // ================= PAGINATION LOGIC =================
    const totalPages = Math.ceil(filteredSchemes.length / schemesPerPage);

    const paginatedSchemes = useMemo(() => {
        const startIndex = (currentPage - 1) * schemesPerPage;
        const endIndex = startIndex + schemesPerPage;
        return filteredSchemes.slice(startIndex, endIndex);
    }, [filteredSchemes, currentPage]);

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedState("");
        setSelectedBenefit("");
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950
        text-gray-800 dark:text-gray-100 transition-colors duration-300">

            {/* ================= SIDEBAR ================= */}
            <motion.aside
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-[320px] flex-shrink-0
                bg-white dark:bg-gray-900
                p-6 space-y-6 border-r dark:border-gray-800"
            >
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <Filter size={18} /> Filters
                </h2>

                {/* State Filter */}
                <div>
                    <label className="text-sm font-medium block mb-2">
                        State
                    </label>
                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                        <option value="">All States</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                    </select>
                </div>

                {/* Benefit Filter */}
                <div>
                    <label className="text-sm font-medium block mb-2">
                        Benefit Type
                    </label>
                    <select
                        value={selectedBenefit}
                        onChange={(e) => setSelectedBenefit(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                        <option value="">All Types</option>
                        <option value="DBT">Direct Benefit Transfer (DBT)</option>
                        <option value="Subsidy">Subsidy</option>
                        <option value="Crop insurance">Crop insurance</option>
                        <option value="Loan">Loan</option>
                        <option value="Livelihood support">Livelihood support</option>
                        <option value="Housing grant">Housing grant</option>
                        <option value="Wage employment">Wage employment</option>
                        <option value="Road connectivity">Road connectivity</option>
                        <option value="Incentive">Incentive</option>
                    </select>
                </div>

                <button
                    onClick={resetFilters}
                    className="flex items-center justify-center gap-2
                    w-full bg-green-600 hover:bg-green-700
                    text-white py-3 rounded-lg transition"
                >
                    <RotateCcw size={16} /> Reset Filters
                </button>
            </motion.aside>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 p-6">

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search scheme..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-3 rounded-lg
                        bg-gray-50 dark:bg-gray-800
                        focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>

                {/* Count */}
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Found{" "}
                    <span className="font-bold text-green-600">
                        {filteredSchemes.length}
                    </span>{" "}
                    schemes
                </p>

                {/* Loading */}
                {loading && (
                    <p className="text-center text-gray-500">
                        Loading schemes...
                    </p>
                )}

                {/* Empty */}
                {!loading && filteredSchemes.length === 0 && (
                    <p className="text-center text-gray-500">
                        No schemes found.
                    </p>
                )}

                {/* List */}
                <motion.div layout className="max-w-4xl mx-auto space-y-5">
                    <AnimatePresence>
                        {paginatedSchemes.map((scheme) => (
                            <motion.div
                                key={scheme._id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <SchemeCard
                                    scheme={scheme}
                                    onClick={setSelectedScheme}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* ================= PAGINATION ================= */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">

                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="px-3 py-1 rounded border disabled:opacity-40"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded border 
                                    ${currentPage === index + 1
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-white dark:bg-gray-800"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="px-3 py-1 rounded border disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {/* ================= MODAL ================= */}
            <SchemeModal
                scheme={selectedScheme}
                onClose={() => setSelectedScheme(null)}
            />
        </div>
    );
};

export default SchemeDetails;