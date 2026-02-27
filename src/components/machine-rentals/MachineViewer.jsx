import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api"; 
import { toast } from "react-toastify";
import { Mail, User, Calendar, Clock, Wrench, IndianRupee, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- UTILITY COMPONENTS & FUNCTIONS ---

const getStatusBadge = (status) => {
    let colorClass = "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    switch (status) {
        case "available":
            colorClass = "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
            break;
        case "rented":
        case "reserved":
            colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
            break;
        case "under_maintenance":
        case "out_of_service":
            colorClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
            break;
        case "working":
            colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
            break;
        default:
            break;
    }
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${colorClass}`}>
            {status?.replace(/_/g, " ")}
        </span>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const DetailCard = ({ label, value, icon }) => (
    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
        <p className="text-xl mb-1">{icon}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
);

// --- HIRE MACHINE MODULE ---

const HireMachine = ({
    machineId,
    farmerId,
    providerId,
    machineName,
    machineParts = [],
    rentalPricePerHour = 0,
    onSuccess,
    onClose
}) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        selectedParts: [],
        startDate: "",
        endDate: "",
        dailyHours: 1,
    });

    const getTotalDays = () => {
        if (!form.startDate || !form.endDate) return 0;
        const start = new Date(form.startDate);
        const end = new Date(form.endDate);
        const diff = (end - start) / (1000 * 60 * 60 * 24);
        return diff >= 0 ? diff + 1 : 0;
    };

    const totalDays = getTotalDays();
    const totalCost = totalDays * form.dailyHours * rentalPricePerHour;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Logic fixed: Using props passed from parent MachineViewer
            const responce = await api.post("/api/machine-rental/request", {
                machineId,
                farmerId,
                providerId,
                ...form,
                totalDays,
                totalCost
            });
            console.log("Rental request response:", responce.data);
            toast.success("Rental request sent successfully!");
            onSuccess && onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || "Rental request failed");
        } finally {
            setLoading(false);
        }
    };

    const togglePart = (part) => {
        if (form.selectedParts.includes(part)) {
            setForm({ ...form, selectedParts: form.selectedParts.filter(p => p !== part) });
        } else {
            setForm({ ...form, selectedParts: [...form.selectedParts, part] });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border border-white/20 relative max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="text-gray-500" />
            </button>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Wrench className="text-indigo-600" /> Hire Machine
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Machine Name</label>
                    <input type="text" value={machineName} disabled className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 outline-none" />
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-3 block">Select Required Parts</label>
                    <div className="flex flex-wrap gap-2">
                        {machineParts.map((part) => (
                            <button
                                key={part}
                                type="button"
                                onClick={() => togglePart(part)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${form.selectedParts.includes(part) ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"}`}
                            >
                                {part}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-4 text-indigo-500" size={18} />
                            <input type="date" required className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">End Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-4 text-indigo-500" size={18} />
                            <input type="date" required className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Daily Working Time (Hours)</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-4 text-indigo-500" size={18} />
                        <input type="number" min="1" required value={form.dailyHours} className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setForm({ ...form, dailyHours: e.target.value })} />
                    </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-center">
                    <p className="font-bold text-indigo-800 dark:text-indigo-300 flex justify-center items-center gap-2">
                        <IndianRupee size={16} /> ₹{rentalPricePerHour} / hour
                    </p>
                    {totalDays > 0 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-lg font-extrabold text-indigo-900 dark:text-indigo-200">
                            Total Cost: ₹{totalCost.toLocaleString()}
                        </motion.p>
                    )}
                </div>

                <button disabled={loading || totalDays <= 0} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[1.5rem] font-black tracking-widest hover:shadow-2xl transition-all disabled:opacity-50">
                    {loading ? "PROCESSING..." : "SEND RENTAL REQUEST"}
                </button>
            </form>
        </div>
    );
};

// --- MAIN MACHINE VIEWER COMPONENT ---

function MachineViewer() {
    const { machineId } = useParams();
    const [machine, setMachine] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMachine = async () => {
            if (!machineId) return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/machine-rental/get-machine-by-id/${machineId}`);
                setMachine(response.data.data || response.data);
                setIsLoading(false);
            } catch (err) {
                setError("Failed to load machine details. It might not exist.");
                toast.error("Failed to load machine details.");
                setIsLoading(false);
            }
        };
        fetchMachine();
    }, [machineId]);

    if (isLoading) {
        return (
            <div className="min-h-screen p-4 md:p-10 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-xl font-medium text-gray-700 dark:text-gray-300 animate-pulse">Loading machine details... ⚙️</p>
            </div>
        );
    }

    if (error || !machine) {
        return (
            <div className="min-h-screen p-4 md:p-10 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="p-6 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg shadow-md">
                    <p className="text-xl font-semibold">{error || "Machine not found"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <header className="p-6 md:p-8 bg-indigo-600 dark:bg-indigo-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-1">{machine.machineName}</h1>
                        <p className="text-lg font-medium opacity-90">{machine.machineType} - {machine.machineModel}</p>
                    </div>
                    <div className="mt-4 md:mt-0">{getStatusBadge(machine.machineStatus)}</div>
                </header>

                {/* Content Grid */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                            <img src={machine.machineImage || 'https://via.placeholder.com/600x400?text=No+Image'} alt={machine.machineName} className="w-full h-auto object-cover" />
                        </div>
                        
                        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 shadow-inner border border-gray-300 dark:border-gray-600">
                            <h3 className="text-lg font-semibold border-b pb-2 mb-2 border-gray-300 dark:border-gray-600">
                                Machine Owner (<small>{"mUserId_" + (machine.machineOwner?._id || machine.machineOwner)}</small>)
                            </h3>
                            <img className="border rounded-full w-40 h-40 mt-2 mb-4 mx-auto object-cover" src={machine.machineOwner?.profilePicture} alt="Owner" />
                            <p className="text-center font-bold">{machine.machineOwner?.username || 'Unknown'}</p>
                            <p className="text-center">Contact: <strong>+91 <a href={"tel:" + machine.machineOwner?.MobileNum}>{machine.machineOwner?.MobileNum}</a></strong></p>
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
                                <button className="flex items-center justify-center px-5 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-md w-full" onClick={() => navigate(`/servicer-profile/${machine.machineOwner?._id || machine.machineOwner}`)}><User className="w-5 h-5 mr-2" />Profile</button>
                                <button className="flex items-center justify-center px-5 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-md w-full" onClick={() => navigate(`/user/messages/${machine.machineOwner?._id || machine.machineOwner}`)}><Mail className="w-5 h-5 mr-2" />Message</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">Machine Details</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{machine.description || "No detailed description provided."}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">Key Specifications</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <DetailCard label="Registration No." value={machine.machineRegistationNumber} icon="📜" />
                                <DetailCard label="Working Hours" value={`${machine.machineWorkingHours} hrs`} icon="⏱️" />
                                <DetailCard label="Working Area" value={machine.machineWorkingArea} icon="🚧" />
                                <DetailCard label="Rental Price" value={`₹${machine.rentalPricePerHour?.toLocaleString() || 'N/A'} / hr`} icon="💰" />
                                <DetailCard label="Available From" value={formatDate(machine.availabilityStartDate)} icon="📅" />
                                <DetailCard label="Available Until" value={formatDate(machine.availabilityEndDate)} icon="🗓️" />
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">Location</h2>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">City:</span> {machine.location?.city || 'N/A'}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">State:</span> {machine.location?.state || 'N/A'}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Country:</span> {machine.location?.country || 'N/A'}</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">Key Parts Included</h2>
                                <div className="flex flex-wrap gap-2">
                                    {machine.machineParts?.length > 0 ? machine.machineParts.map((part, i) => (
                                        <span key={i} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100 px-3 py-1 text-sm rounded-full font-medium">{part}</span>
                                    )) : <p className="text-gray-500 text-sm">No parts listed.</p>}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Action */}
                <footer className="p-6 md:p-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button 
                        onClick={() => setIsHireModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
                        disabled={machine.machineStatus === "rented" || machine.machineStatus === "out_of_service"}
                    >
                        {machine.machineStatus === "available" ? "Request Rental" : "Currently Unavailable"}
                    </button>
                </footer>
            </div>

            {/* FLOATING HIRE WINDOW (MODAL) */}
            <AnimatePresence>
                {isHireModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-2xl"
                        >
                            <HireMachine 
                                machineId={machine._id}
                                farmerId={localStorage.getItem("userId")}
                                providerId={machine.machineOwner?._id || machine.machineOwner}
                                machineName={machine.machineName}
                                machineParts={machine.machineParts}
                                rentalPricePerHour={machine.rentalPricePerHour}
                                onClose={() => setIsHireModalOpen(false)}
                                onSuccess={() => setIsHireModalOpen(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default MachineViewer;