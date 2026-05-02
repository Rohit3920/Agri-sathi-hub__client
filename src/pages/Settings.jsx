import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
    Lock,
    Moon,
    Sun,
    Globe,
    Bell,
    ChevronRight,
    Save,
    ShieldCheck,
    User,
    CheckCircle2
} from 'lucide-react';
import LanguageChange from '../components/language/languageChange';
import api from '../utils/api';

const Settings = () => {
    const userId = localStorage.getItem("userId");
    const [activeTab, setActiveTab] = useState('swiftUser');
    const [userMode, setUserMode] = useState(localStorage.getItem("userMode") || "farmer");

    // --- THEME LOGIC ---
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    // --- USER MODE SWITCH WITH PASSWORD ---
    const requestModeChange = async (newMode) => {
        // 1. Prevent unnecessary calls if mode hasn't changed
        if (newMode === userMode) return;

        // 2. Password Verification Modal
        const { value: password } = await Swal.fire({
            title: `Switch to ${newMode.toUpperCase()} Mode`,
            text: 'Please enter your password to confirm this role change.',
            input: 'password',
            inputPlaceholder: 'Password',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6b7280',
            inputValidator: (value) => {
                if (!value) return 'Password is required!';
            }
        });

        if (password) {
            try {
                Swal.fire({
                    title: 'Updating Permissions...',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                // 3. API Call to Backend
                // Use the specific endpoint we corrected earlier
                const response = await api.post(`api/auth/change-user-type`, {
                    userId,
                    password,
                    newMode
                });

                if (response.data.success) {
                    // 4. Update Persistence (localStorage)
                    // Use the value from backend response for absolute accuracy
                    const updatedMode = response.data.userMode;
                    localStorage.setItem('userMode', updatedMode);

                    // 5. Update UI State
                    setUserMode(updatedMode);

                    Swal.fire({
                        icon: 'success',
                        title: 'Mode Switched!',
                        text: `Your interface is now configured for ${updatedMode}.`,
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                console.error("Mode Change Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Switch Failed',
                    text: error.response?.data?.message || 'Verification failed. Please try again.',
                    confirmButtonColor: '#ef4444',
                });
            }
        }
    };

    // --- PASSWORD LOGIC ---
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const updatePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwords;

        // 1. Basic Client-side Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill in all fields.',
                confirmButtonColor: '#4f46e5'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Match Error',
                text: 'New password and confirm password do not match!',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        try {
            // 2. Show loading state
            Swal.fire({
                title: 'Updating...',
                didOpen: () => { Swal.showLoading(); }
            });

            // 3. API Call
            const response = await api.put(`api/auth/change-password/${userId}`, {
                currentPassword,
                newPassword,
                confirmPassword
            });


            // 4. Success Handling
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.data.message || 'Your password has been changed successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
                // Reset the form
                setPasswords({ current: '', new: '', confirm: '' });
            }
        } catch (error) {
            // 5. Error Handling (Incorrect current password, server error, etc.)
            const errorMsg = error.response?.data?.message || 'Failed to update password. Please try again.';

            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: errorMsg,
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const tabVariant = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    const menuItems = [
        { id: 'swiftUser', label: 'Change user Mode', icon: <User size={20} /> },
        { id: 'profile', label: 'Security & Password', icon: <Lock size={20} /> },
        { id: 'appearance', label: 'Appearance & Theme', icon: <Sun size={20} /> },
        { id: 'language', label: 'Language & Region', icon: <Globe size={20} /> },
        // { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-10 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account preferences and security.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* --- SIDEBAR --- */}
                    <aside className="lg:col-span-1 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none scale-[1.02]'
                                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-sm">{item.label}</span>
                                </div>
                                <ChevronRight size={16} className={activeTab === item.id ? "opacity-100" : "opacity-30"} />
                            </button>
                        ))}
                    </aside>

                    {/* --- CONTENT --- */}
                    <main className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <AnimatePresence mode="wait">

                            {/* 0. CHANGE USER MODE */}
                            {activeTab === 'swiftUser' && (
                                <motion.div key="swiftUser" {...tabVariant} className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                            <User className="text-indigo-500" /> User Mode
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verify password to switch your interface role.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                        {['farmer', 'servicer', 'worker'].map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => requestModeChange(mode)}
                                                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${userMode === mode
                                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                                    : 'border-gray-100 dark:border-gray-700 hover:border-indigo-300'
                                                    }`}
                                            >
                                                <div className={`p-3 rounded-full ${userMode === mode ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <span className={`font-black uppercase tracking-wider text-sm ${userMode === mode ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>
                                                    {mode}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* 1. SECURITY */}
                            {activeTab === 'profile' && (
                                <motion.div key="profile" {...tabVariant} className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                            <ShieldCheck className="text-indigo-500" /> Security
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Change your password frequently for better security.</p>
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        {[{ label: 'Current Password', name: 'currentPassword' }, { label: 'New Password', name: 'newPassword' }, { label: 'Confirm Password', name: 'confirmPassword' }].map((field) => (
                                            <div key={field.name} className="grid gap-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">{field.label}</label>
                                                <input type="password" name={field.name} value={passwords[field.name]} onChange={handlePasswordChange} placeholder="••••••••" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-indigo-500 outline-none transition-all dark:text-white" />
                                            </div>
                                        ))}
                                        <button onClick={updatePassword} className="flex items-center justify-center gap-2 w-full md:w-fit px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
                                            <Save size={18} /> SAVE CHANGES
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* 2. APPEARANCE */}
                            {activeTab === 'appearance' && (
                                <motion.div key="appearance" {...tabVariant} className="space-y-6">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Appearance</h3>
                                    <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                                                {theme === "dark" ? <Moon size={28} className="text-indigo-400" /> : <Sun size={28} className="text-yellow-500" />}
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">Dark Mode</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Current theme: <span className="capitalize font-black text-indigo-500">{theme}</span></p>
                                            </div>
                                        </div>
                                        <button onClick={toggleTheme} className={`w-16 h-9 flex items-center rounded-full p-1 transition-colors duration-500 ${theme === "dark" ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                            <motion.div layout className="bg-white w-7 h-7 rounded-full shadow-lg" animate={{ x: theme === "dark" ? 28 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* 3. LANGUAGE TAB */}
                            {activeTab === 'language' && (
                                <motion.div key="language" {...tabVariant} className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                            <Globe className="text-indigo-500" /> Language & Region
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select your preferred regional language for the interface.</p>
                                    </div>

                                    <div className="grid gap-4 pt-4 text-left">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Choose Language</label>

                                        <LanguageChange />

                                        <p className="text-xs text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                            This selection will update the entire Agri Sathi HUB interface. Regional language support covers 23 official Indian languages.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* 4. NOTIFICATIONS */}
                            {activeTab === 'notifications' && (
                                <motion.div key="notifications" {...tabVariant} className="space-y-6">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Notifications</h3>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {['Email Alerts', 'SMS Notifications', 'Push Notifications', 'Newsletter'].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-5 first:pt-0">
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-200">{item}</p>
                                                    <p className="text-xs text-gray-500">Receive updates regarding your bookings</p>
                                                </div>
                                                <div className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Settings;