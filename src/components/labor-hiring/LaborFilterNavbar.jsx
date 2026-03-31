import React from "react";
import { Search } from "lucide-react";

const LaborFilterNavbar = ({
    searchTerm,
    setSearchTerm,
    availability,
    setAvailability,
    skill,
    setSkill,
    wageRange,
    setWageRange,
}) => {
    return (
        <div className="w-full bg-white dark:text-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 mb-6">

            {/* 🔥 Top Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

                {/* 🔍 Search */}
                <div className="relative w-full lg:w-1/3">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search workers, groups, skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                        bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* 🎯 Filters */}
                <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-start lg:justify-end">

                    {/* Availability */}
                    <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 
                        bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All</option>
                        <option value="available">Available</option>
                        <option value="working">Working</option>
                        <option value="unavailable">Unavailable</option>
                    </select>

                    {/* Skill */}
                    <input
                        type="text"
                        placeholder="Skill (plumbing, farming...)"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        className="px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 
                        bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Wage */}
                    <select
                        value={wageRange}
                        onChange={(e) => setWageRange(e.target.value)}
                        className="px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 
                        bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Wages</option>
                        <option value="0-500">₹0 - ₹500</option>
                        <option value="500-1000">₹500 - ₹1000</option>
                        <option value="1000-2000">₹1000 - ₹2000</option>
                        <option value="2000-5000">₹2000 - ₹5000</option>
                        <option value="5000+">₹5000+</option>
                    </select>

                </div>
            </div>

            {/* 🔥 Bottom Tip */}
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                <span>💡 Tip: Try searching "labor, lobor work, group leader"</span>
            </div>

        </div>
    );
};

export default LaborFilterNavbar;