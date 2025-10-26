// FarmerProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail, Phone, MapPin, User, Settings, Sprout, Tractor, Calendar } from 'lucide-react';
import api from "../../utils/api";

// Utility to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        return `Invalid Date ${e}`;
    }
};

// Component for displaying key-value pairs with dark mode support
const DetailItem = ({ label, value }) => (
    <div className="flex flex-col p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 break-words mt-1">{value || 'N/A'}</p>
    </div>
);

function FarmerProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Retrieves logged-in user ID for conditional rendering (e.g., Edit button)
    const loggedInUserId = localStorage.getItem('userId');

    useEffect(() => {
        // Fetch farmer data using userId from URL params
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/auth/get-user/${userId}`);
                // Ensure data is set to state
                setUserProfile(response.data);
            } catch (err) {
                setError("Failed to load farmer profile. Please try again later.", err);
                toast.error("Failed to load farmer profile.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const handleMessageUser = () => {
        // Handles navigation to the messaging route after checking login status
        if (!loggedInUserId) {
            toast.info("Please log in to send messages.");
            navigate('/login');
            return;
        }
        // Placeholder for actual messaging route
        navigate(`/user/messages/${userId}`);
    };

    const handleViewMachines = () => {
        // Handles navigation to view machines owned by this farmer (for rental)
        toast.info(`Navigating to view machines by ${userProfile?.username || 'this user'}...`);
        navigate(`/machine-view-by-userId/${userProfile?._id}`);
    };

    const handleEditProfile = () => {
        // Handles navigation to the profile editing page
        navigate(`/user/edit-profile/${userId}`);
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 dark:border-indigo-400"></div>
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading user profile...</p>
            </div>
        );
    }

    // --- Error State ---
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="p-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg shadow-md text-center">
                    <p className="text-xl font-semibold mb-2">Profile Load Error</p>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // --- Not Found State ---
    if (!userProfile) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-lg">
                <p>Farmer profile not found.</p>
                <Link to="/" className="mt-4 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
                    Go Home
                </Link>
            </div>
        );
    }

    const isOwnProfile = loggedInUserId === userId;

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-start transition-colors duration-300">
            <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden md:flex border border-gray-200 dark:border-gray-700">

                {/* Left Column: Profile Picture and Actions */}
                <div className="md:w-1/3 p-8 bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-800 dark:to-emerald-900 text-white flex flex-col items-center relative text-center">

                    {/* Profile Image */}
                    <div className="relative mb-6">
                        <img
                            className="h-40 w-40 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                            src={userProfile.profilePicture || 'https://via.placeholder.com/160/222222/FFFFFF?text=Farmer'}
                            alt={`${userProfile.username}'s profile`}
                            // Fallback image handling
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/160/222222/FFFFFF?text=Farmer'; }}
                        />
                        {/* Role Badge */}
                        <span className="absolute bottom-0 right-0 px-3 py-1 bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 text-xs font-bold rounded-full shadow-md capitalize border border-gray-300 dark:border-gray-600">
                            {userProfile.UserMode}
                        </span>
                    </div>

                    {/* Name and Role */}
                    <h1 className="text-3xl font-extrabold mb-1">{userProfile.username}</h1>
                    <p className="text-green-200 dark:text-green-300 text-lg mb-4 capitalize">
                        Farmer Profile
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 mt-4 w-full max-w-xs">
                        {isOwnProfile ? (
                            // Edit Profile button for the owner
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center justify-center px-5 py-2 bg-white text-green-700 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg w-full"
                            >
                                <Settings className="w-5 h-5 mr-2" /> Edit Profile
                            </button>
                        ) : (
                            // Action buttons for other users
                            <>
                                <button
                                    onClick={handleMessageUser}
                                    className="flex items-center justify-center px-5 py-2 bg-white text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-colors shadow-lg w-full"
                                >
                                    <Mail className="w-5 h-5 mr-2" /> Message User
                                </button>
                                <button
                                    onClick={handleViewMachines}
                                    className="flex items-center justify-center px-5 py-2 bg-emerald-700 dark:bg-emerald-600 text-white rounded-full font-semibold border-2 border-white/50 hover:bg-emerald-800 transition-colors shadow-lg w-full"
                                >
                                    <Tractor className="w-5 h-5 mr-2" /> View Machines
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:w-2/3 p-6 sm:p-8 space-y-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 border-b-2 border-green-500 pb-2">
                        Farming Information
                    </h2>

                    {/* General Contact Details */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-green-500" /> Basic Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem label="Email" value={userProfile.email} />
                            <DetailItem label="Mobile" value={userProfile.MobileNum} />
                        </div>
                    </section>

                    {/* Farmer-Specific Content (Land Area and Crops) */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                            <Sprout className="w-5 h-5 mr-2 text-yellow-600" /> Land & Crops
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-lime-50 dark:bg-lime-900/50 rounded-lg shadow-sm border border-lime-200 dark:border-lime-700">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Land Area</p>
                                {/* Accessing hypothetical landArea field */}
                                <p className="text-lg font-semibold text-lime-800 dark:text-lime-300">{userProfile.landArea || 'Not set'}</p>
                            </div>
                            <div className="p-4 bg-lime-50 dark:bg-lime-900/50 rounded-lg shadow-sm border border-lime-200 dark:border-lime-700">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Main Crops</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {/* Accessing hypothetical mainCrops array */}
                                    {userProfile.mainCrops && userProfile.mainCrops.length > 0 ? (
                                        userProfile.mainCrops.map(crop => (
                                            <span key={crop} className="px-3 py-1 bg-lime-200 text-lime-800 dark:bg-lime-700 dark:text-lime-100 rounded-full text-xs font-medium">
                                                {crop}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">No crops listed.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Addresses */}
                    {userProfile.address && userProfile.address.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-red-500" /> Addresses
                            </h3>
                            <div className="space-y-4">
                                {userProfile.address.map((addr, index) => (
                                    // Address Card for each address type
                                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                        <p className="font-bold text-green-600 dark:text-green-400 capitalize mb-1">
                                            {addr.addressType || 'General'} Address
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {/* Concatenates address parts and removes empty/duplicate commas */}
                                            {`${addr.street || ''}, ${addr.subDistrict || ''}, ${addr.district || ''}`.replace(/,(\s*,){1,}/g, ',').trim().replace(/^,/, '').trim()}<br />
                                            {`${addr.city || ''}, ${addr.state || ''} - ${addr.zipCode || ''}`.replace(/,(\s*,){1,}/g, ',').trim().replace(/^,/, '').trim()}<br />
                                            {addr.country || ''}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Timestamps */}
                    <div className="text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" /> Timeline
                        </h3>
                        <p>
                            <strong className="font-medium">Member Since:</strong> {formatDate(userProfile.createdAt)}
                        </p>
                        <p>
                            <strong className="font-medium">Last Updated:</strong> {formatDate(userProfile.updatedAt)}
                        </p>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            User ID: {userProfile._id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmerProfile;