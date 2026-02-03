import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Phone, Users } from 'lucide-react';

const GroupDetail = () => {
    const { groupId } = useParams();
    const loggedInUserId = localStorage.getItem('userId');
    const navigate = useNavigate();


    const [groupData, setGroupData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    /* ---------------- LOADING ---------------- */
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    /* ---------------- ERROR ---------------- */
    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
                    <p className="text-red-500 font-bold mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    /* ---------------- SAFETY ---------------- */
    if (!groupData || !groupData.leaderId) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
                Group not found 👷‍♂️👷‍♂️
            </div>
        );
    }

    /* ---------------- DATA ---------------- */
    const {
        groupName,
        leaderId,
        members = [],
        skills = [],
        groupWagePerDay,
        availability
    } = groupData;

    const address = leaderId?.address?.[0] || {};


    const handleMessageUser = () => {
        // Handles navigation to the messaging route after checking login status
        if (!loggedInUserId) {
            toast.info("Please log in to send messages.");
            navigate('/login');
            return;
        }
        // Placeholder for actual messaging route
        navigate(`/user/messages/${leaderId._id}`);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="md:flex">

                {/* LEFT PROFILE */}
                <div className="md:w-1/3 bg-orange-600 p-8 text-white flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-black mb-4"
                    >
                        {groupName?.charAt(0).toUpperCase()}
                    </motion.div>

                    <h2 className="text-2xl font-bold text-center">
                        {groupName}
                    </h2>

                    <span
                        className={`px-3 py-1 rounded-full text-xs mt-2 font-bold
                        ${availability ? "bg-green-500" : "bg-red-500"}`}
                    >
                        {availability ? "Available" : "Unavailable"}
                    </span>

                    <div className="mt-8 w-full space-y-4">
                        <div className="bg-white/10 p-4 rounded-xl">
                            <p className="text-xs opacity-70">Total Members</p>
                            <p className="text-lg font-bold">{members.length}</p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl">
                            <p className="text-xs opacity-70">Group Daily Wage</p>
                            <p className="text-lg font-bold">₹{groupWagePerDay}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="md:w-2/3 p-8">
                    <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-2">
                        About Group
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {groupName} is a professional labor group skilled in {skills.join(", ")}.
                        Led by <b>{leaderId?.username}</b>, operating from {address.city || "Unknown"}, {address.state || ""}.
                    </p>

                    <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-4">
                        Skills
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {skills.map((skill, i) => (
                            <span
                                key={i}
                                className="bg-orange-50 dark:bg-gray-700 text-orange-600 dark:text-orange-300 px-4 py-2 rounded-xl text-sm font-bold"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-4">
                        Group owner
                    </h3>

                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl mb-6">
                        <p className="font-bold text-gray-800 dark:text-white">
                            {leaderId?.username}
                        </p>
                        <p className="text-sm text-gray-500">
                            📍 {address.city}, {address.state}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <a
                            href={`tel:${leaderId?.MobileNum}`}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl"
                        >
                            <Phone className="w-5 h-5" />
                            Call owner
                        </a>

                        <button
                            onClick={handleMessageUser}
                            className="flex items-center justify-center px-5 py-2 bg-white text-emerald-600 rounded-2xl font-semibold hover:bg-emerald-50 transition-colors shadow-lg w-full"
                        >
                            <Mail className="w-5 h-5 mr-2" /> Message by owner
                        </button>

                        <button
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors"
                        >
                            <Users className="w-5 h-5" />
                            Hire Group
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GroupDetail;
