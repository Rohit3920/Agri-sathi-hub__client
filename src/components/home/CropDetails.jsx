import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cultivation from "./Cultivation";
import {
    Sprout,
    Clock,
    Calendar,
    Leaf,
    Droplets,
    Info,
    ChevronRight,
    X,
    Tractor
} from "lucide-react";

const CropDetails = ({ crop }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // 1. PROVIDE YOUR IMAGES HERE
    // Replace these paths with your actual image URLs or imported assets
    const cropImages = [
        "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    ];

    if (!crop) return null;

    const cropData = crop.data ? crop.data[0] : crop;
    const score = crop.score || 100;

    // Slideshow timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveImageIndex((prev) => (prev + 1) % cropImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [cropImages.length]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 dark:border-gray-700"
            >
                {/* Hero Section with Provided Image Slideshow */}
                <div className="relative h-48 sm:h-64 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeImageIndex}
                            src={cropImages[activeImageIndex]}
                            alt={cropData.cropName}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="w-full h-full object-cover absolute inset-0"
                        />
                    </AnimatePresence>
                    
                    {/* Slide Indicators */}
                    <div className="absolute top-4 right-6 flex gap-1.5 z-20">
                        {cropImages.map((_, idx) => (
                            <div 
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    idx === activeImageIndex ? "w-4 bg-emerald-500" : "w-1.5 bg-white/50"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end p-6 z-10">
                        <div className="flex justify-between items-end w-full">
                            <div>
                                <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full mb-2 inline-block">
                                    Recommendation
                                </span>
                                <h2 className="text-3xl font-black text-white capitalize">
                                    {cropData.cropName}
                                </h2>
                                <p className="text-emerald-300 font-medium">
                                    {cropData.cropSubName || "Premium Variety"}
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/20">
                                <p className="text-white text-[10px] uppercase font-bold opacity-70">Match Score</p>
                                <p className="text-2xl font-black text-emerald-400">{score}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {/* Item 1: Type */}
                        <div className="flex flex-col items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-center">
                            <Sprout className="w-6 h-6 text-emerald-600 mb-2" />
                            <span className="text-[10px] uppercase text-gray-400 font-bold">Crop Type</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
                                {cropData.cropType?.[0] || "General"}
                            </span>
                        </div>

                        {/* Item 2: Season */}
                        <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center">
                            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="text-[10px] uppercase text-gray-400 font-bold">Season</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
                                {cropData.cropSeason?.[0] || "Kharif"}
                            </span>
                        </div>

                        {/* Item 3: Duration */}
                        <div className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-center">
                            <Clock className="w-6 h-6 text-orange-600 mb-2" />
                            <span className="text-[10px] uppercase text-gray-400 font-bold">Duration</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                {cropData.cropDuration} Days
                            </span>
                        </div>

                        {/* Item 4: Use */}
                        <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-center">
                            <Leaf className="w-6 h-6 text-purple-600 mb-2" />
                            <span className="text-[10px] uppercase text-gray-400 font-bold">Primary Use</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
                                {cropData.useOfPlant?.[0] || "Food"}
                            </span>
                        </div>
                    </div>

                    {/* Technical Details Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-800 dark:text-white font-bold">
                                <Info className="w-5 h-5 text-emerald-500" />
                                <h3>Technical Insights</h3>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
                            >
                                <Tractor className="w-4 h-4" />
                                View Cultivation Process
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {cropData.irrigation?.map((method, idx) => (
                                <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold">
                                    <Droplets className="w-3.5 h-3.5" />
                                    {method.toUpperCase()}
                                </span>
                            ))}
                            {cropData.fertilizer?.map((item, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-600">
                                    🧪 {item.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modal remains unchanged */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                        <Tractor className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                                            Cultivation Roadmap
                                        </h3>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                            {cropData.cropName} • Step-by-step Guide
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6">
                                <Cultivation data={cropData.cultivation} cropType={cropData.cropType}/>
                            </div>
                            <div className="p-6 pt-0 flex justify-end">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                                    Close Guide
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CropDetails;