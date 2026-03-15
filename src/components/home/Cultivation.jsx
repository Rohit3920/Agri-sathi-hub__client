import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { 
    Settings, 
    Shovel, 
    Tractor, 
    ShoppingBag, 
    Leaf, 
    ExternalLink, 
    Users 
} from "lucide-react";

const Cultivation = ({ data, cropType }) => {
    const navigate = useNavigate();
    const type = Array.isArray(cropType) ? cropType[0]?.toLowerCase() : cropType?.toLowerCase();

    // Mapping for default data (same as previous step)
    const typeDefaults = {
        fruit: {
            preSowing: { stage: "Pit Preparation", activity: "Digging pits of 1x1x1m, sun-drying, and filling with organic manure.", machinery: ["Excavator", "Auger"], type: "machine" },
            sowing: { stage: "Planting", activity: "Planting high-quality grafts or saplings during the monsoon.", machinery: ["Manual"], type: "labor" },
            maintenance: { stage: "Orchard Care", activity: "Training, pruning, and drip irrigation management.", machinery: ["Pruning Shears"], type: "labor" },
            harvesting: { stage: "Picking", activity: "Hand-picking or using fruit pluckers to avoid bruising.", machinery: ["Fruit Picker"], type: "labor" }
        },
        cereal: {
            preSowing: { stage: "Field Leveling", activity: "Tilling the soil 2-3 times to create a fine tilth.", machinery: ["Tractor", "Cultivator"], type: "machine" },
            sowing: { stage: "Sowing", activity: "Drilling seeds at uniform depth and spacing.", machinery: ["Seed Drill"], type: "machine" },
            maintenance: { stage: "Weed Control", activity: "Inter-culturing and secondary nitrogen application.", machinery: ["Power Weeder"], type: "labor" },
            harvesting: { stage: "Threshing", activity: "Cutting and separating grains from the straw.", machinery: ["Combine Harvester"], type: "machine" }
        },
        // Fallback for other types
        default: {
            preSowing: { stage: "Land Preparation", activity: "Standard plowing and soil leveling.", machinery: ["Tractor"], type: "machine" },
            sowing: { stage: "Sowing/Planting", activity: "Standard sowing based on seasonal requirements.", machinery: ["Seeder"], type: "machine" },
            maintenance: { stage: "Crop Care", activity: "Regular irrigation and monitoring for pests.", machinery: ["Sprayer"], type: "labor" },
            harvesting: { stage: "Harvesting", activity: "Cutting once the crop reaches maturity.", machinery: ["Harvester"], type: "machine" }
        }
    };

    const steps = data || typeDefaults[type] || typeDefaults.default;

    const timeline = [
        { key: "preSowing", icon: <Settings className="w-5 h-5" />, color: "bg-amber-500", route: "/machine-rentals" },
        { key: "sowing", icon: <Shovel className="w-5 h-5" />, color: "bg-emerald-500", route: "/machine-rentals" },
        { key: "maintenance", icon: <Users className="w-5 h-5" />, color: "bg-blue-500", route: "/labor-hire" },
        { key: "harvesting", icon: <ShoppingBag className="w-5 h-5" />, color: "bg-purple-500", route: "/labor-hire" }
    ];

    return (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <Tractor className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Cultivation Roadmap</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> Step-by-step Guide
                        </p>
                    </div>
                </div>
                <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-black uppercase tracking-widest">
                    Type: {type || "General"}
                </span>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                {timeline.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                    >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-800 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${step.color} text-white z-10`}>
                            {step.icon}
                        </div>

                        <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-widest">
                                    {steps[step.key].stage}
                                </h4>
                                
                                {/* Link to Hiring/Rental Pages */}
                                <button 
                                    onClick={() => navigate(step.route)}
                                    className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 rounded-lg transition-colors group/btn"
                                    title={step.route === "/machine-rentals" ? "Rent Machines" : "Hire Labor"}
                                >
                                    <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                {steps[step.key].activity}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                {steps[step.key].machinery?.map((m, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => navigate(`/machine-rentals?search=${m}`)}
                                        className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-600 transition-colors"
                                    >
                                        ⚙️ {m.toUpperCase()}
                                    </button>
                                ))}
                                
                                {/* Secondary Action Badge */}
                                <button 
                                    onClick={() => navigate(step.route)}
                                    className={`text-[9px] px-2 py-1 rounded-md font-black flex items-center gap-1 border ${
                                        step.route === "/machine-rentals" 
                                        ? "bg-amber-50 border-amber-200 text-amber-700" 
                                        : "bg-blue-50 border-blue-200 text-blue-700"
                                    }`}
                                >
                                    {step.route === "/machine-rentals" ? "RENT NOW" : "HIRE WORKERS"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Cultivation;