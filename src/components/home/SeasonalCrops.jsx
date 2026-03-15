import React, { useState } from "react";

const SeasonalCrops = ({ crops, selectCrop }) => {
    // 1. Logic for Crop Type Sorting and Dropdown Options
    const typeOrder = [
        "fruit", "plantation", "spice", "medicinal", "cereal", 
        "cash crop", "pulse", "oilseed", "vegetable", "tuber", 
        "flower", "ornamental"
    ];

    // State to handle manual Crop Type selection
    // Defaulting to "all" to show everything initially
    const [activeType, setActiveType] = useState("all");

    // 2. Filter logic based on the selected Crop Type
    const filteredCrops = crops.filter(crop => {
        if (activeType === "all") return true;
        return crop.cropType?.some(t => t.toLowerCase() === activeType.toLowerCase());
    });

    // 3. Grouping logic for the filtered results
    const groupedCrops = filteredCrops.reduce((acc, crop) => {
        const type = crop.cropType?.[0] || "Other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(crop);
        return acc;
    }, {});

    // 4. Sort the groups based on your handwritten list
    const sortedTypes = Object.keys(groupedCrops).sort((a, b) => {
        let indexA = typeOrder.indexOf(a.toLowerCase());
        let indexB = typeOrder.indexOf(b.toLowerCase());
        if (indexA === -1) indexA = 99;
        if (indexB === -1) indexB = 99;
        return indexA - indexB;
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 max-h-[80vh] overflow-y-auto">
            {/* Header with Crop Type Select Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 border-b pb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Seasonal Crops
                </h2>

                <select
                    value={activeType}
                    onChange={(e) => setActiveType(e.target.value)}
                    className="bg-blue-50 dark:bg-gray-700 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full sm:w-auto"
                >
                    <option value="all">All Types</option>
                    {typeOrder.map((type) => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-6">
                {sortedTypes.length > 0 ? (
                    sortedTypes.map((type) => (
                        <div key={type} className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1 border-l-2 border-blue-500 ml-1 pl-2">
                                {type}s
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                {groupedCrops[type].map((c) => (
                                    <div
                                        key={c._id}
                                        onClick={() => selectCrop(c)}
                                        className="border rounded-lg p-3 text-center bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700 hover:border-blue-500 transition-colors shadow-sm"
                                    >
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                            {c.cropName}
                                        </p>
                                        {c.cropSubName && (
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                                {c.cropSubName}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                            No crops found for the type "{activeType}".
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeasonalCrops;