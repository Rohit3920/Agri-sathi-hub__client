import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Phone, Users, X } from 'lucide-react'; // Added X icon
import HireGroup from './HireGroup';

const GroupDetail = () => {
    const { groupId } = useParams();
    const loggedInUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [groupData, setGroupData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showHireModal, setShowHireModal] = useState(false); // Added missing state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await api.get(`/api/labor/worker-group/${groupId}`);
                setGroupData(res.data?.data || res.data);
            } catch (err) {
                setError("Failed to load group details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

    const handleMessageUser = () => {
        if (!loggedInUserId) {
            toast.info("Please log in to send messages.");
            navigate('/login');
            return;
        }
        navigate(`/user/messages/${groupData.leaderId._id}`);
    };

    const handleHireClick = () => {
        if (!loggedInUserId) {
            toast.info("Please log in to hire this group.");
            navigate('/login');
            return;
        }
        setShowHireModal(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !groupData || !groupData.leaderId) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
                <p className="text-xl mb-4">{error || "Group not found 👷‍♂️"}</p>
                <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold underline">Go Back</button>
            </div>
        );
    }

    const { groupName, leaderId, members = [], skills = [], groupWagePerDay, availability } = groupData;
    const address = leaderId?.address?.[0] || {};

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 my-10">
            <div className="md:flex">
                {/* LEFT PROFILE PANEL */}
                <div className="md:w-1/3 bg-indigo-600 p-8 text-white flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 rounded-3xl bg-white/20 flex items-center justify-center text-5xl font-black border-4 border-white/30 shadow-2xl mb-4"
                    >
                        {
                            groupData.groupImage ? <img src={groupData.groupImage} />
                                :  groupName?.charAt(0).toUpperCase()
                        }
                    </motion.div>

                    <h2 className="text-2xl font-bold text-center leading-tight">{groupName}</h2>

                    <span className={`px-4 py-1 rounded-full text-xs mt-3 font-bold uppercase tracking-wider ${availability ? "bg-green-500" : "bg-red-500"}`}>
                        {availability ? "Available" : "Busy"}
                    </span>

                    <div className="mt-8 w-full space-y-4">
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                            <p className="text-xs opacity-70 font-bold uppercase">Total Members</p>
                            <p className="text-2xl font-black">{members.length}</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                            <p className="text-xs opacity-70 font-bold uppercase">Daily Wage</p>
                            <p className="text-2xl font-black">₹{groupWagePerDay}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT PANEL */}
                <div className="md:w-2/3 p-8 flex flex-col">
                    <section className="mb-6">
                        <h3 className="text-gray-400 dark:text-gray-500 uppercase text-xs font-black tracking-widest mb-2">About Group</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            <span className="font-semibold text-indigo-600">{groupName}</span> is a skilled team specializing in {skills.join(", ")}.
                            Managed by <span className="font-bold">{leaderId?.username}</span>, operating out of {address.city || "Primary Location"}.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-3">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-indigo-100 dark:border-indigo-800">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-3">Group Leader</h3>
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {leaderId?.username?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">{leaderId?.username}</p>
                                <p className="text-xs text-gray-500 italic">📍 {address.city}, {address.state}</p>
                            </div>
                        </div>
                    </section>

                    {/* ACTION BUTTONS */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <a href={`tel:${leaderId?.MobileNum}`} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition-all border border-transparent hover:border-green-200">
                                <Phone className="w-4 h-4" /> Call
                            </a>
                            <button onClick={handleMessageUser} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition-all border border-transparent hover:border-blue-200">
                                <Mail className="w-4 h-4" /> Message
                            </button>
                        </div>

                        <button
                            onClick={handleHireClick}
                            disabled={!availability}
                            className={`w-full flex items-center justify-center gap-3 font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] ${availability
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none"
                                    : "bg-gray-400 cursor-not-allowed text-white"
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            {availability ? "HIRE GROUP NOW" : "CURRENTLY BUSY"}
                        </button>
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
                                className="absolute -top-12 right-0 text-white hover:text-indigo-400 transition-colors bg-white/10 p-2 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <HireGroup
                                groupId={groupId}
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

export default GroupDetail;