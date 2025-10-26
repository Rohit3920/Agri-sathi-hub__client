import React, { useEffect, useRef, useState } from 'react';
import api from '../../utils/api';
import MachineCardI from './MachineCardI';

function AvailableMachines() {
    const scrollContainerRef = useRef(null);
    const [machinesList, setMachinesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const [error, setError] = useState(null); // New error state

    // --- Data Fetching Effect with Error/Loading Handling ---
    useEffect(() => {
        const fetchMachines = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get('/api/machine-rental/available-machines');
                const data = response.data.data || response.data;
                setMachinesList(data);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to fetch machines:", err);
                setError("Failed to load machine data. Please try again later.");
                setIsLoading(false);
            }
        };

        fetchMachines();
    }, []);

    console.log("Machines List:", machinesList);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex-shrink-0 w-64 h-80 bg-white rounded-xl shadow-lg border border-gray-100 mx-3 animate-pulse overflow-hidden">
                            <div className="h-3/5 bg-gray-200"></div>
                            <div className="p-3 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/5"></div>
                            </div>
                        </div>
                    ))}
                </>
            );
        }

        if (error) {
            return (
                <div className="w-full text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg mx-3">
                    <p className="font-semibold">Error Loading Data</p>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }

        if (machinesList.length === 0) {
            return (
                <div className="w-full text-center p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg mx-3">
                    <p className="font-semibold">No Machines Found 🚜</p>
                    <p className="text-sm">It looks like there are no machine available right now.</p>
                </div>
            );
        }

        // Render actual machine cards
        return (
            <>
                <div className='flex-shrink-0 bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center h-80 w-48 border border-gray-300 hover:shadow-lg transition duration-200 mr-3'>
                    <button className="flex flex-col items-center justify-center h-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-indigo-600 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="text-indigo-600 font-semibold">View All</span>
                    </button>
                </div>
                {machinesList.map((machine) => (
                    <MachineCardI key={machine._id} machine={machine} />
                ))}
            </>
        );
    };


    return (
        <div className="container mx-auto pt-5">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Available Machines for Rent in Your Area
                    </h2>

                    {machinesList.length > 0 && !isLoading && !error && (
                        <div className="flex space-x-2">
                            <button
                                onClick={scrollLeft}
                                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200"
                                aria-label="Scroll Left"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={scrollRight}
                                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200"
                                aria-label="Scroll Right"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex items-center overflow-x-scroll pb-4 space-x-4 custom-scrollbar-hide"
                >
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default AvailableMachines;