import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, MessageSquare, Clock } from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function MyProfile() {
    const navigate = useNavigate();
    // Assuming userId is the ID of the profile currently being viewed/owned
    const userId = localStorage.getItem('userId');
    const [userData, setUserData] = useState(null);
    // validId is used to check if the logged-in user is the profile owner
    const validId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            // Fetch user data from the API
            api.get(`/api/auth/get-user/${userId}`)
                .then(res => {
                    // console.log(res.data);
                    setUserData(res.data);
                })
                .catch(err => {
                    console.error("Error fetching user data:", err);
                });
        }
    }, [userId]);

    // --- Loading State ---
    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 dark:border-indigo-400"></div>
                <p className="ml-4 text-gray-600 dark:text-gray-300">Loading profile data...</p>
            </div>
        );
    }

    const changeProfilePicture = () => {
        // SweetAlert prompt for changing profile picture
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to change your profile picture?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5', // indigo-600
            cancelButtonColor: '#dc2626', // red-600
            confirmButtonText: 'Yes, change it!',
            background: 'var(--swal2-background)' // Ensures dark/light mode compatibility if SweetAlert is configured
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/upload-profile');
            }
        });
    };

    // Prepare data structure for display
    const user = {
        username: userData.username,
        email: userData.email,
        // Extract description, prioritizing DomainDetail if Servicer, otherwise empty
        description: userData.DomainDetail && userData.DomainDetail.length > 0 ? userData.DomainDetail[0].description : '',
        profilePicture: userData.profilePicture || 'https://via.placeholder.com/96/222222/FFFFFF?text=User', // Added fallback
        // Format location from the first address entry
        location: userData.address && userData.address.length > 0 ? `${userData.address[0].city || ''}, ${userData.address[0].state || ''}, ${userData.address[0].country || ''}`.replace(/,(\s*,){1,}/g, ',').trim().replace(/^,/, '').trim() : 'Not set',
        // Format join date
        createdAt: new Date(userData.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        // Extract language from basic details
        language: userData.basic && userData.basic.length > 0 && userData.basic[0].language ? userData.basic[0].language.join(', ') : 'Not set',
        // Placeholder for preferred working hours
        preferredWorkingHours: userData.preferredWorkingHours || 'Flexible'
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans antialiased transition-colors duration-300">
            <div className="container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
                
                {/* Left Column: Sidebar/Profile Summary */}
                <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 flex flex-col items-center md:items-start h-fit md:h-auto md:sticky md:top-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    
                    <div className="mb-4 relative flex flex-col items-center md:items-start">
                        {/* Profile Picture */}
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                        />
                        {/* Edit Profile Picture Button (Conditional) */}
                        {
                            validId === userId && (
                                <button 
                                    onClick={changeProfilePicture} 
                                    className='text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 mt-2'
                                >
                                    Edit profile picture
                                </button>
                            )
                        }
                    </div>
                    
                    {/* Username and Email */}
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1 text-center md:text-left">
                        {user.username}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center md:text-left">
                        {user.email}
                    </p>
                    
                    {/* Key Details */}
                    <div className="w-full space-y-3 text-gray-700 dark:text-gray-300">
                        {/* Location */}
                        <div className="flex items-start text-left text-sm">
                            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-1 flex-shrink-0" />
                            <span>Located in <strong className='font-semibold'>{user.location}</strong></span>
                        </div>
                        {/* Joined Date */}
                        <div className="flex items-start text-left text-sm">
                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-1 flex-shrink-0" />
                            <span>Joined in <strong className='font-semibold'>{user.createdAt}</strong></span>
                        </div>
                        {/* Language */}
                        <div className="flex items-start text-left text-sm">
                            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-1 flex-shrink-0" />
                            <span><strong className='font-semibold'>{user.language}</strong> <small className='text-gray-500 dark:text-gray-400'>(Conversational)</small></span>
                        </div>
                        {/* Working Hours */}
                        <div className="flex items-start text-left text-sm">
                            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-1 flex-shrink-0" />
                            <span>Preferred working hours: <strong className='font-semibold'>{user.preferredWorkingHours}</strong></span>
                        </div>
                    </div>
                    
                    {/* Edit Profile Button (Conditional) */}
                    {
                        validId === userId && (
                            <button 
                                onClick={() => { navigate('/details') }} 
                                className='bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white mt-8 font-bold py-2 px-6 rounded-full transition-colors duration-300 w-full shadow-lg'
                            >
                                Edit Profile
                            </button>
                        )
                    }
                </div>
                
                {/* Right Column: Main Content */}
                <div className="w-full md:w-3/4 overflow-y-auto">
                    
                    {/* Header/Bio Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        {
                            userData.UserMode === 'servicer' ?
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    Hi! I'm {user.username}, 👋 Let's help farmers get to know you
                                </h1>
                                :
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    Hi! I'm Mr/Miss {user.username}, 👋 Farmers are always help all of us.
                                </h1>
                        }
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {user.description ? user.description : 'Get the most out of Farmer by sharing a bit more about yourself and how you prefer to work with farmers. ✅'}
                        </p>
                    </div>
                    
                    {/* Profile Details Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Details</h3>
                        
                        {/* Address Information (Conditional) */}
                        {userData.address && userData.address.length > 0 && (
                            <div className="p-4 border border-yellow-300 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/40 shadow-sm transition-colors duration-300">
                                <h4 className="text-md font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Address Information</h4>
                                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    {/* Address Line 1: Street */}
                                    <div className="flex justify-between py-1 border-b border-yellow-100 dark:border-yellow-800">
                                        <strong className='font-medium'>Street:</strong>
                                        <span>{userData.address[0].street || 'Not set'}</span>
                                    </div>
                                    {/* Address Line 2: City */}
                                    <div className="flex justify-between py-1 border-b border-yellow-100 dark:border-yellow-800">
                                        <strong className='font-medium'>City:</strong>
                                        <span>{userData.address[0].city || 'Not set'}</span>
                                    </div>
                                    {/* Address Line 3: State */}
                                    <div className="flex justify-between py-1 border-b border-yellow-100 dark:border-yellow-800">
                                        <strong className='font-medium'>State:</strong>
                                        <span>{userData.address[0].state || 'Not set'}</span>
                                    </div>
                                    {/* Address Line 4: Zip Code */}
                                    <div className="flex justify-between py-1 border-b border-yellow-100 dark:border-yellow-800">
                                        <strong className='font-medium'>Zip/Postal/pin Code:</strong>
                                        <span>{userData.address[0].zipCode || 'Not set'}</span>
                                    </div>
                                    {/* Address Line 5: Country */}
                                    <div className="flex justify-between py-1">
                                        <strong className='font-medium'>Country:</strong>
                                        <span>{userData.address[0].country || 'Not set'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Add more profile sections (Education, Experience, etc.) here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;