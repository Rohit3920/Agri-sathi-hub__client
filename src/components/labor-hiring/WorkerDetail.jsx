import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Phone, User } from 'lucide-react';

const WorkerDetail = () => {
    const { workerId } = useParams();
    const loggedInUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [workerData, setWorkerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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


    /* ---------------- LOADING STATE ---------------- */
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    /* ---------------- ERROR STATE ---------------- */
    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
                    <p className="text-red-500 font-bold mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    /* ---------------- SAFETY CHECK ---------------- */
    if (!workerData) return null;

    /* ---------------- DATA ---------------- */
    const { userId, skills = [], experience, dailyWage, availability } = workerData;
    const address = userId?.address?.[0] || {};

    const handleMessageUser = () => {
        // Handles navigation to the messaging route after checking login status
        if (!loggedInUserId) {
            toast.info("Please log in to send messages.");
            navigate('/login');
            return;
        }
        // Placeholder for actual messaging route
        navigate(`/user/messages/${userId._id}`);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="md:flex">

                {/* LEFT PROFILE */}
                <div className="md:w-1/3 bg-indigo-600 p-8 text-white flex flex-col items-center">
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={userId?.profilePicture || "/avatar.png"}
                        alt="Worker"
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20 shadow-xl mb-4"
                    />

                    <h2 className="text-2xl font-bold text-center">
                        {userId?.username || "Worker"}
                    </h2>

                    <span
                        className={`px-3 py-1 rounded-full text-xs mt-2 font-bold
                        ${availability ? "bg-green-500" : "bg-red-500"}`}
                    >
                        {availability ? "Available" : "Unavailable"}
                    </span>

                    <div className="mt-8 w-full space-y-4">
                        <div className="bg-white/10 p-4 rounded-xl">
                            <p className="text-xs opacity-70">Experience</p>
                            <p className="text-lg font-bold">{experience} Years</p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl">
                            <p className="text-xs opacity-70">Daily Wage</p>
                            <p className="text-lg font-bold">₹{dailyWage}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="md:w-2/3 p-8">
                    <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-2">
                        About Worker
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Professional laborer skilled in {skills.join(", ")}.
                        Based in {address.city || "Unknown"}, {address.state || ""}.
                        With {experience} years of experience.
                    </p>

                    <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-4">
                        Skills
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {skills.map((skill, i) => (
                            <span
                                key={i}
                                className="bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-xl text-sm font-bold"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <a
                            href={`tel:${userId?.MobileNum}`}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl"
                        >
                            <Phone className="w-5 h-5" />
                            Call Me
                        </a>

                        <button
                            onClick={handleMessageUser}
                            className="flex items-center justify-center px-5 py-2 bg-white text-emerald-600 rounded-2xl font-semibold hover:bg-emerald-50 transition-colors shadow-lg w-full"
                        >
                            <Mail className="w-5 h-5 mr-2" /> Message Me
                        </button>

                        <button
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors"
                        >
                            <User className="w-5 h-5" />
                            Hire Me
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WorkerDetail;
