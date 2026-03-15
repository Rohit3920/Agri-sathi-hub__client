import React, { useState } from "react";

const BestCrops = ({ crops, selectCrop }) => {
    // 1. Helper to get default season based on current month
    const getDefaultSeason = () => {
        const month = new Date().getMonth() + 1;
        if (month >= 6 && month <= 10) return "kharif";
        if (month >= 11 || month <= 3) return "rabi";
        return "zaid";
    };

    // State to handle manual season selection
    const [activeSeason, setActiveSeason] = useState(getDefaultSeason());

    // 2. Logic to map the internal name to all possible database aliases
    const getSeasonAliases = (season) => {
        const aliases = {
            kharif: ["kharif", "monsoon", "summer", "rainy", "all"],
            rabi: ["rabi", "winter", "all"],
            zaid: ["zaid", "summer", "spring", "all"]
        };
        return aliases[season] || [season];
    };

    const currentAliases = getSeasonAliases(activeSeason);

    // 3. Filter crops by the selected season (checks all aliases)
    const seasonalCrops = crops.filter(crop => 
        crop.cropSeason?.some(s => 
            currentAliases.includes(s.toLowerCase())
        )
    );

    // 4. Group by cropType
    const groupedCrops = seasonalCrops.reduce((acc, crop) => {
        const type = crop.cropType?.[0] || "Other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(crop);
        return acc;
    }, {});

    // --- SORTING LOGIC FROM IMAGE ---
    const typeOrder = [
        "fruit", "plantation", "spice", "medicinal", "cereal", 
        "cash crop", "pulse", "oilseed", "vegetable", "tuber", 
        "flower", "ornamental"
    ];

    const sortedTypes = Object.keys(groupedCrops).sort((a, b) => {
        let indexA = typeOrder.indexOf(a.toLowerCase());
        let indexB = typeOrder.indexOf(b.toLowerCase());
        
        // If type is not in our list, move it to the end
        if (indexA === -1) indexA = 99;
        if (indexB === -1) indexB = 99;
        
        return indexA - indexB;
    });
    // --------------------------------

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 max-h-[80vh] overflow-y-auto">
            {/* Header with Select Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 border-b pb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Crop Suggestions
                </h2>
                <select
                    value={activeSeason}
                    onChange={(e) => setActiveSeason(e.target.value)}
                    className="bg-green-50 dark:bg-gray-700 text-green-800 dark:text-green-200 text-sm font-medium rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                    <option value="kharif">Kharif (Monsoon)</option>
                    <option value="rabi">Rabi (Winter)</option>
                    <option value="zaid">Zaid (Summer)</option>
                </select>
            </div>

            <div className="space-y-6">
                {sortedTypes.length > 0 ? (
                    sortedTypes.map((type) => (
                        <div key={type} className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1">
                                {type}s
                            </h3>

                            {groupedCrops[type].map((crop, index) => (
                                <div
                                    key={crop._id || index}
                                    onClick={() => selectCrop(crop)}
                                    className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                                >
                                    <div>
                                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                                            {crop.cropName}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {crop.cropSubName}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                                            {crop.score}
                                        </div>
                                        {crop.cropDuration && (
                                            <div className="text-[10px] text-gray-400 mt-1">
                                                {crop.cropDuration} Days
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400 italic">
                            No crops found for {activeSeason.toUpperCase()}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BestCrops;