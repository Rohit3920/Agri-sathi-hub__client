import React from "react";

const EnvironmentalSettings = ({ isOpen, onClose, onSave, setManualModeForm, manualModeForm }) => {
    // const [manualModeForm, setManualModeForm] = useState(manualModeForm);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(manualModeForm);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-green-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <h3 className="font-bold text-lg">Soil & Environment</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-green-700 rounded-full p-1 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Soil Type Select */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Soil Texture</label>
                        <select 
                            value={manualModeForm.soilType} 
                            onChange={(e) => setManualModeForm({...manualModeForm, soilType: e.target.value})}
                            className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        >
                            <option value="loamy">Loamy (Balanced)</option>
                            <option value="sandy">Sandy (Well-drained)</option>
                            <option value="clay">Clay (Water-retentive)</option>
                            <option value="silt">Silt (Fertile)</option>
                            <option value="peaty">Peaty (Organic)</option>
                        </select>
                    </div>

                    {/* pH Level Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">pH Level</label>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">{manualModeForm.phLevel} pH</span>
                        </div>
                        <input 
                            type="range" min="3" max="10" step="0.1" 
                            value={manualModeForm.phLevel} 
                            onChange={(e) => setManualModeForm({...manualModeForm, phLevel: parseFloat(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                            <span>Acidic</span>
                            <span>Neutral</span>
                            <span>Alkaline</span>
                        </div>
                    </div>

                    {/* N, P, K Inputs */}
                    <div className="grid grid-cols-3 gap-4">
                        {["n", "p", "k"].map((nutrient) => (
                            <div key={nutrient}>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {nutrient.toUpperCase()} (ppm)
                                </label>
                                <input
                                    type="number"
                                    value={manualModeForm[nutrient]}
                                    onChange={(e) => setManualModeForm({...manualModeForm, [nutrient]: parseInt(e.target.value)})}
                                    className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder={`e.g. 80`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Rainfall Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annual Rainfall (mm)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={manualModeForm.rainfall} 
                                onChange={(e) => setManualModeForm({...manualModeForm, rainfall: parseInt(e.target.value)})}
                                className="w-full p-3 pl-10 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="e.g. 1200"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-95"
                    >
                        Update Parameters
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnvironmentalSettings;