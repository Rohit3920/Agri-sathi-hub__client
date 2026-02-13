import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Phone, User, X } from 'lucide-react';
import HireWorker from './HireWorker';

const WorkerDetail = () => {
    const { workerId } = useParams();
    const loggedInUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [workerData, setWorkerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showHireModal, setShowHireModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await api.get(`/api/labor/worker/${workerId}`);
                setWorkerData(res.data?.data || res.data);
            } catch (err) {
                setError("Failed to load worker details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [workerId]);

    const handleMessageUser = () => {
        if (!loggedInUserId) {
            toast.info("Please log in to send messages.");
            navigate('/login');
            return;
        }
        navigate(`/user/messages/${workerData.userId._id}`);
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error || !workerData) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
                <p className="text-red-500 font-bold mb-4">{error || "Worker not found"}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Retry</button>
            </div>
        </div>
    );

    const { userId, skills = [], experience, dailyWage, availability } = workerData;
    const address = userId?.address?.[0] || {};

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="md:flex">

                    {/* LEFT PROFILE SIDEBAR */}
                    <div className="md:w-1/3 bg-indigo-600 p-8 text-white flex flex-col items-center">
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={userId?.profilePicture || "/avatar.png"}
                            alt="Worker"
                            className="w-32 h-32 rounded-3xl object-cover border-4 border-white/30 shadow-2xl mb-4"
                        />

                        <h2 className="text-2xl font-bold text-center leading-tight">
                            {userId?.username || "Worker"}
                        </h2>

                        <span className={`px-4 py-1 rounded-full text-xs mt-3 font-bold uppercase tracking-wider ${availability ? "bg-green-500" : "bg-red-500"}`}>
                            {availability ? "Available Now" : "Currently Busy"}
                        </span>

                        <div className="mt-8 w-full space-y-4">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <p className="text-xs opacity-80 font-bold uppercase">Experience</p>
                                <p className="text-xl font-black">{experience} Years</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <p className="text-xs opacity-80 font-bold uppercase">Daily Wage</p>
                                <p className="text-xl font-black">₹{dailyWage}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="md:w-2/3 p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-gray-400 dark:text-gray-500 uppercase text-xs font-black tracking-widest mb-2">
                                Professional Profile
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                                Professional laborer specialized in <span className="text-indigo-600 dark:text-indigo-400 font-bold">{skills.join(", ")}</span>.
                                Based in {address.city || "Unknown"}, {address.state || ""}.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {skills.map((skill, i) => (
                                    <span key={i} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-100 dark:border-indigo-800">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <a href={`tel:${userId?.MobileNum}`} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all">
                                    <Phone className="w-5 h-5 text-green-600" /> Call
                                </a>
                                <button onClick={handleMessageUser} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all">
                                    <Mail className="w-5 h-5 text-blue-500" /> Message
                                </button>
                            </div>

                            <button
                                onClick={() => setShowHireModal(true)}
                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]"
                            >
                                <User className="w-6 h-6" />
                                HIRE WORKER
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HIRE MODAL --- */}
            <AnimatePresence>
                {showHireModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg"
                        >
                            <button
                                onClick={() => setShowHireModal(false)}
                                className="absolute -top-12 right-0 text-white hover:text-indigo-400 transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <HireWorker
                                workerId={workerId}
                                farmerId={loggedInUserId}
                                skills={skills}
                                onSuccess={() => {
                                    setShowHireModal(false);
                                    toast.success("Hire request sent successfully! ✅");
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WorkerDetail;