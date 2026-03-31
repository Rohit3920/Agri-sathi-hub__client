import React, { useEffect, useRef, useState } from 'react';
import SectionHeader from "../components/labor-hiring/SectionHeader";
import WorkerCard from "../components/labor-hiring/WorkerCard";
import LaborFilterNavbar from "../components/labor-hiring/LaborFilterNavbar";
import api from "../utils/api.jsx";
import { motion } from "framer-motion";
import { useTrail, animated } from "@react-spring/web";

export default function LaborHire() {
    const workerScrollRef = useRef(null);
    const groupScrollRef = useRef(null);

    const [workers, setWorkers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔥 FILTER STATES
    const [searchTerm, setSearchTerm] = useState("");
    const [availability, setAvailability] = useState("");
    const [skill, setSkill] = useState("");
    const [wageRange, setWageRange] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [workerRes, groupRes] = await Promise.all([
                    api.get('/api/labor/workers/available'),
                    api.get('/api/labor/worker-groups')
                ]);
                setWorkers(workerRes?.data.data || workerRes?.data || []);
                setGroups(groupRes?.data.data || groupRes?.data || []);
            } catch (err) {
                setError("Failed to load data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // ✅ FILTER FUNCTION (NO UI CHANGE)
    const applyFilters = (list, type) => {
        return list.filter((item) => {
            const text = searchTerm.toLowerCase();

            const safe = (val) => {
                if (!val) return "";
                if (Array.isArray(val)) return val.join(" ").toLowerCase();
                return String(val).toLowerCase();
            };

            const workerName = safe(item.userId?.username);
            const leaderName = safe(item.leaderId?.username);
            const groupName = safe(item.groupName);

            const skills = safe(item.skills);
            const experience = safe(item.experience);

            const workerWage = safe(item.dailyWage);
            const groupWage = safe(item.groupWagePerDay);

            const workerStatus = safe(item.machineStatus);
            const groupAvailability = item.availability ? "available" : "unavailable";

            const city1 = safe(item.userId?.address?.[0]?.city);
            const city2 = safe(item.leaderId?.address?.[0]?.city);

            const matchesSearch =
                workerName.includes(text) ||
                leaderName.includes(text) ||
                groupName.includes(text) ||
                skills.includes(text) ||
                experience.includes(text) ||
                workerWage.includes(text) ||
                groupWage.includes(text) ||
                workerStatus.includes(text) ||
                groupAvailability.includes(text) ||
                city1.includes(text) ||
                city2.includes(text);

            const matchesAvailability = availability
                ? (type === "single"
                    ? workerStatus.includes(availability)
                    : groupAvailability.includes(availability))
                : true;

            const matchesSkill = skill
                ? skills.includes(skill.toLowerCase())
                : true;

            const checkRange = (value) => {
                const w = Number(value);
                if (!wageRange) return true;
                if (wageRange === "5000+") return w > 5000;
                const [min, max] = wageRange.split("-").map(Number);
                return w >= min && w <= max;
            };

            const matchesWage =
                type === "single"
                    ? checkRange(item.dailyWage)
                    : checkRange(item.groupWagePerDay);

            return matchesSearch && matchesAvailability && matchesSkill && matchesWage;
        });
    };

    // ✅ APPLY FILTERS
    const filteredWorkers = applyFilters(workers, "single");
    const filteredGroups = applyFilters(groups, "group");

    // ✅ ANIMATION (USE FILTERED DATA)
    const workerTrail = useTrail(filteredWorkers.length, {
        from: { opacity: 0, transform: 'translateX(30px)' },
        to: {
            opacity: isLoading ? 0 : 1,
            transform: isLoading ? 'translateX(30px)' : 'translateX(0px)'
        },
        config: { mass: 1, tension: 280, friction: 20 },
    });

    const groupTrail = useTrail(filteredGroups.length, {
        from: { opacity: 0, scale: 0.9 },
        to: {
            opacity: isLoading ? 0 : 1,
            scale: isLoading ? 0.9 : 1
        },
        delay: 300,
    });

    // ✅ YOUR ORIGINAL SCROLL FUNCTION (UNCHANGED)
    const handleScroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const renderSkeletons = () => (
        <div className="flex space-x-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[350px] h-48 bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-100 dark:border-gray-700" />
            ))}
        </div>
    );

    if (error) {
        return (
            <motion.div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                    <p className="text-red-500 font-semibold">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Retry</button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8">
            <div className="container mx-auto">

                {/* 🔥 FILTER NAVBAR */}
                <LaborFilterNavbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    availability={availability}
                    setAvailability={setAvailability}
                    skill={skill}
                    setSkill={setSkill}
                    wageRange={wageRange}
                    setWageRange={setWageRange}
                />

                {/* SINGLE WORKERS */}
                <motion.div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Single Workers Near You</h2>
                        {!isLoading && filteredWorkers.length > 0 && (
                            <ScrollButtons onScroll={(dir) => handleScroll(workerScrollRef, dir)} />
                        )}
                    </div>

                    <div ref={workerScrollRef} className="flex items-center overflow-x-auto pb-4 space-x-4 no-scrollbar scroll-smooth p-2">
                        {isLoading ? renderSkeletons() : (
                            filteredWorkers.length > 0 ? workerTrail.map((style, index) => (
                                <animated.div key={filteredWorkers[index]._id} style={style}>
                                    <WorkerCard data={filteredWorkers[index]} type="single" />
                                </animated.div>
                            )) : <EmptyState message="No workers available" />
                        )}
                    </div>
                </motion.div>

                {/* GROUPS */}
                <motion.div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Worker Groups for Big Tasks</h2>
                        {!isLoading && filteredGroups.length > 0 && (
                            <ScrollButtons onScroll={(dir) => handleScroll(groupScrollRef, dir)} />
                        )}
                    </div>

                    <div ref={groupScrollRef} className="flex items-center overflow-x-auto pb-4 space-x-4 no-scrollbar scroll-smooth p-2">
                        {isLoading ? renderSkeletons() : (
                            filteredGroups.length > 0 ? groupTrail.map((style, index) => (
                                <animated.div key={filteredGroups[index]._id} style={style}>
                                    <WorkerCard data={filteredGroups[index]} type="group" />
                                </animated.div>
                            )) : <EmptyState message="No worker groups available" />
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

// ✅ ORIGINAL BUTTONS (UNCHANGED)
const ScrollButtons = ({ onScroll }) => (
    <div className="flex space-x-2">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onScroll('left')}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onScroll('right')}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
        </motion.button>
    </div>
);

const EmptyState = ({ message }) => (
    <motion.div className="w-full py-12 text-center bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">{message} 👷</p>
    </motion.div>
);