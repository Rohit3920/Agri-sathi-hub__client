import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api"; // Assuming your API utility is here
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";

// Utility to convert status string to a colored badge
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
            colorClass = "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
            break;
        case "working":
            colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
            break;
        default:
            break;
    }
    return (
        <span
            className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${colorClass}`}
        >
            {status.replace(/_/g, " ")}
        </span>
    );
};

// Utility to format dates
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

function MachineViewer() {
    const { machineId } = useParams();
    const [machine, setMachine] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch machine data from the API
    useEffect(() => {
        const fetchMachine = async () => {
            if (!machineId) return;

            setIsLoading(true);
            setError(null);
            try {
                // Adjust endpoint as necessary based on your actual API route
                const response = await api.get(`/api/machine-rental/get-machine-by-id/${machineId}`);
                console.log("Fetched machine data:", response.data);
                setMachine(response.data.data || response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching machine details:", err);
                setError("Failed to load machine details. It might not exist.");
                toast.error("Failed to load machine details.");
                setIsLoading(false);
            }
        };

        fetchMachine();
    }, [machineId]);

    // Handle loading state
    if (isLoading) {
        return (
            <div className="min-h-screen p-4 md:p-10 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-xl font-medium text-gray-700 dark:text-gray-300 animate-pulse">
                    Loading machine details... ⚙️
                </p>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="min-h-screen p-4 md:p-10 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="p-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg shadow-md">
                    <p className="text-xl font-semibold">Error</p>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        );
    }

    // Handle case where machine is null after loading (shouldn't happen if error handles API fail)
    if (!machine) {
        return (
            <div className="min-h-screen p-4 md:p-10 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Machine details not found.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header Section */}
                <header className="p-6 md:p-8 bg-indigo-600 dark:bg-indigo-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-1">
                            {machine.machineName}
                        </h1>
                        <p className="text-lg font-medium opacity-90">
                            {machine.machineType} - {machine.machineModel}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        {getStatusBadge(machine.machineStatus)}
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Image Column (1/3 width on large screens) */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                            <img
                                src={machine.machineImage || 'https://via.placeholder.com/600x400?text=No+Image'}
                                alt={machine.machineName}
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Owner Info (Optional: assuming machineOwner is populated/available) */}
                        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 shadow-inner border border-gray-300 dark:border-gray-600">
                            <h3 className="text-lg font-semibold border-b pb-2 mb-2 border-gray-300 dark:border-gray-600">
                                Machine Owner
                                (
                                <small>
                                    {"mUserId_" + machine.machineOwner?._id || machine.machineOwner}
                                </small>
                                )
                            </h3>

                            <img
                                className="border rounded-full w-40 h-40 mt-2 mb-4 mx-auto"
                                src={machine.machineOwner?.profilePicture
                                } alt={machine.machineOwner?.username || 'Machine Owner'} />
                            <p>{machine.machineOwner.username || 'Unknown'}</p>
                            <p>Contact :
                                <strong>
                                    +91 <a href={"tel:" + machine.machineOwner.MobileNum}>{machine.machineOwner.MobileNum}</a>
                                </strong></p>
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
                                <button
                                    className="flex items-center justify-center px-5 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-md w-full sm:w-auto"
                                    onClick={() => navigate(`/servicer-profile/${machine.machineOwner?._id}`)}><User className="w-5 h-5 mr-2" />Profile
                                </button>

                                <button
                                    className="flex items-center justify-center px-5 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-md w-full sm:w-auto"
                                    onClick={() => navigate(`/user/messages/${machine.machineOwner?._id}`)}><Mail className="w-5 h-5 mr-2" />Message
                                </button>


                            </div>
                        </div>
                    </div>

                    {/* Details Column (2/3 width on large screens) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                                Machine Details
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {machine.description || "No detailed description provided for this machine."}
                            </p>
                        </section>

                        {/* Core Specifications Grid */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                                Key Specifications
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                {/* Registration Number */}
                                <DetailCard
                                    label="Registration No."
                                    value={machine.machineRegistationNumber}
                                    icon="📜"
                                />

                                {/* Working Hours */}
                                <DetailCard
                                    label="Working Hours"
                                    value={`${machine.machineWorkingHours} hrs`}
                                    icon="⏱️"
                                />

                                {/* Working Area */}
                                <DetailCard
                                    label="Working Area"
                                    value={machine.machineWorkingArea}
                                    icon="🚧"
                                />

                                {/* Price */}
                                <DetailCard
                                    label="Rental Price"
                                    value={`₹${machine.rentalPricePerHour?.toLocaleString() || 'N/A'} / hr`}
                                    icon="💰"
                                />

                                {/* Start Date */}
                                <DetailCard
                                    label="Available From"
                                    value={formatDate(machine.availabilityStartDate)}
                                    icon="📅"
                                />

                                {/* End Date */}
                                <DetailCard
                                    label="Available Until"
                                    value={formatDate(machine.availabilityEndDate)}
                                    icon="🗓️"
                                />
                            </div>
                        </section>

                        {/* Location and Parts Section */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Location */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                                    Location
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">City:</span> {machine.location?.city || 'N/A'}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">State:</span> {machine.location?.state || 'N/A'}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Country:</span> {machine.location?.country || 'N/A'}
                                </p>
                            </div>

                            {/* Machine Parts */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                                    Key Parts Included
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {machine.machineParts && machine.machineParts.length > 0 ? (
                                        machine.machineParts.map((part, index) => (
                                            <span
                                                key={index}
                                                className="bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100 px-3 py-1 text-sm rounded-full font-medium"
                                            >
                                                {part}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No parts listed.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer/Action Section */}
                <footer className="p-6 md:p-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        // Example button for renting/reserving
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                    >
                        Request Rental
                    </button>
                </footer>
            </div>
        </div>
    );
}

// Reusable component for displaying key-value pairs
const DetailCard = ({ label, value, icon }) => (
    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
        <p className="text-xl mb-1">{icon}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {value}
        </p>
    </div>
);

export default MachineViewer;