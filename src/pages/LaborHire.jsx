import React, { useEffect, useRef, useState } from 'react';
import SectionHeader from "../components/labor-hiring/SectionHeader";
import WorkerCard from "../components/labor-hiring/WorkerCard";
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

    // --- Animation Configs ---

    // React Spring Trail for Workers
    const workerTrail = useTrail(workers.length, {
        from: { opacity: 0, transform: 'translateX(30px)' },
        to: {
            opacity: isLoading ? 0 : 1,
            transform: isLoading ? 'translateX(30px)' : 'translateX(0px)'
        },
        config: { mass: 1, tension: 280, friction: 20 },
    });

    // React Spring Trail for Groups
    const groupTrail = useTrail(groups.length, {
        from: { opacity: 0, scale: 0.9 },
        to: {
            opacity: isLoading ? 0 : 1,
            scale: isLoading ? 0.9 : 1
        },
        delay: 300, // Slight delay after single workers
    });

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
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
            >
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

                {/* SINGLE WORKERS SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Single Workers Near You</h2>
                        {!isLoading && workers.length > 0 && (
                            <ScrollButtons onScroll={(dir) => handleScroll(workerScrollRef, dir)} />
                        )}
                    </div>

                    <div
                        ref={workerScrollRef}
                        className="flex items-center overflow-x-auto pb-4 space-x-4 no-scrollbar scroll-smooth p-2"
                    >
                        {isLoading ? renderSkeletons() : (
                            workers.length > 0 ? workerTrail.map((style, index) => (
                                <animated.div key={workers[index]._id} style={style}>
                                    <WorkerCard data={workers[index]} type="single" />
                                </animated.div>
                            )) : <EmptyState message="No workers available" />
                        )}
                    </div>
                </motion.div>

                {/* GROUP WORKERS SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Worker Groups for Big Tasks</h2>
                        {!isLoading && groups.length > 0 && (
                            <ScrollButtons onScroll={(dir) => handleScroll(groupScrollRef, dir)} />
                        )}
                    </div>

                    <div
                        ref={groupScrollRef}
                        className="flex items-center overflow-x-auto pb-4 space-x-4 no-scrollbar scroll-smooth p-2"
                    >
                        {isLoading ? renderSkeletons() : (
                            groups.length > 0 ? groupTrail.map((style, index) => (
                                <animated.div key={groups[index]._id} style={style}>
                                    <WorkerCard data={groups[index]} type="group" />
                                </animated.div>
                            )) : <EmptyState message="No worker groups available" />
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

// --- Helper Components ---

const ScrollButtons = ({ onScroll }) => (
    <div className="flex space-x-2">
        <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onScroll('left')}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </motion.button>
        <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onScroll('right')}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </motion.button>
    </div>
);

const EmptyState = ({ message }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full py-12 text-center bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700"
    >
        <p className="text-gray-500">{message} 👷</p>
    </motion.div>
);