import React from 'react';
import { Link } from 'react-router-dom';

function MachineCardI({ machine }) {

    const price = machine.rentalPricePerHour || machine.rentalPrice || 0;
    const priceUnit = machine.rentalPricePerHour ? '/hr' : '/day';

    return (
        // Added flex-shrink-0 for use in horizontal scrolling lists
        // Added hover effects for better user interaction
        <div className="flex-shrink-0 w-64 m-2">
            {/* Link wrapper for navigation */}
            {/* If you use React Router, wrap the card content with a Link */}
            <Link to={`/machine-view/${machine._id}`}>
                <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 transition duration-300 transform hover:shadow-xl hover:scale-[1.02]">

                    {/* Image Section */}
                    <div className="w-full h-40 overflow-hidden rounded-lg mb-4 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {/* Use machineImage from the previous component structure */}
                        {machine.machineImage ? (
                            <img
                                src={machine.machineImage}
                                alt={machine.machineName || 'Machine'}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                            />
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">No Image</span>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col h-[calc(100%-11rem)]">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1 truncate" title={machine.machineName || machine.name}>
                            {machine.machineName || machine.name || 'Untitled Machine'}
                        </h3>

                        {/* Type/Model */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                            {machine.machineType} - {machine.machineModel}
                        </p>

                        {/* Price Tag */}
                        <div className="mt-auto">
                            <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                                ₹{price.toLocaleString()} {priceUnit}
                            </p>
                        </div>

                        <p>Owner : {machine?.machineOwner?.username || 'Unknown'}</p>
                        <p>Contact :
                            <strong>
                                +91 <a href={"tel:" + machine?.machineOwner?.MobileNum}>{machine?.machineOwner?.MobileNum}</a>
                            </strong></p>

                    </div>
                </div>

            </Link>
        </div>
    );
}

export default MachineCardI;