import React from 'react';
import { Link } from 'react-router-dom';

const WorkerCard = ({ data, type }) => {
    // Determine the correct fields based on whether it's a single worker or a group
    const isSingle = type === "single";
    const displayName = isSingle ? data.userId?.username : data.groupName;
    const profileImg = data.userId?.profilePicture || data.image || "/default-worker.jpg";
    const wage = isSingle ? data.dailyWage : data.groupWagePerDay;

    // Address extraction logic
    const userAddress = data.userId?.address?.[0];
    const leaderAddress = data.leaderId?.address?.[0];
    const location = userAddress
        ? `${userAddress.city}`
        : leaderAddress
            ? `${leaderAddress.city}`
            : "Nearby";

    return (
        <div className="flex-shrink-0 w-[350px] h-48 m-2">
            <Link to={isSingle ? `/worker/${data._id}` : `/group/${data._id}`}>
                <div className="flex h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition duration-300 transform hover:shadow-xl hover:scale-[1.02]">

                    {/* Left Side: Image Section (Landscape width) */}
                    <div className="w-1/3 h-full bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <img
                            src={profileImg}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=Worker';
                            }}
                        />
                    </div>

                    {/* Right Side: Content Section */}
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 truncate mr-2" title={displayName}>
                                    {displayName || 'Worker'}
                                </h3>
                                {/* Type Badge */}
                                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200">
                                    {type}
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                {isSingle
                                    ? (data.skills?.slice(0, 25) + (data.skills?.length > 25 ? '...' : ''))
                                    : `${data.members?.length || 0} Professional Workers`
                                }
                            </p>

                            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 flex items-center">
                                <span className="mr-1">📍</span> {location}
                            </p>
                        </div>

                        {/* Footer: Price and Action */}
                        <div className="flex items-center justify-between mt-auto">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Daily Wage</p>
                                <p className="text-lg font-extrabold text-green-600 dark:text-green-400">
                                    ₹{Number(wage).toLocaleString()}
                                </p>
                            </div>
                            <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition duration-200">
                                Hire Now
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default WorkerCard;