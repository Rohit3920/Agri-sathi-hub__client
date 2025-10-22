import React, { useState } from 'react';
import {
    Home,
    User,
    LayoutDashboard,
    Settings,
    LogOut,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function Sidebar({ mobile, t }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: t('Sidebar.Are-you-sure'),
            text: t('Sidebar.Do-you-want-to-log-out'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('Sidebar.Yes-log-me-out'),
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                toast.success(t('Sidebar.Logged-out-successfully'));
                navigate('/');
            }
        });
    };

    // 🔹 Simple static navigation list
    const navLinks = [
        { name: t('Sidebar.Home'), path: '/', icon: <Home /> },
        { name: t('Sidebar.Profile'), path: '/profile', icon: <User /> },
        { name: t('Sidebar.dashboard'), path: '/dashboard', icon: <LayoutDashboard /> },
        { name: t('Sidebar.settings'), path: '/settings', icon: <Settings /> },
    ];

    return (
        <>
            {/* SIDEBAR */}
            <aside
                className={`${mobile
                        ? `fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                z-40 shadow-xl transform transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`
                        : `hidden md:flex md:flex-col md:items-center md:w-20 md:h-full
                bg-white dark:bg-gray-900 shadow-lg text-gray-900 dark:text-gray-100`
                    }`}
            >
                {/* Navigation Items */}
                <div className="flex flex-col items-start space-y-6 flex-grow mt-16 px-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => mobile && setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 font-medium transition-colors md:relative md:w-full md:justify-center group
                ${isActive
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                                }`
                            }
                        >
                            {React.cloneElement(link.icon, { className: 'w-6 h-6' })}
                            {mobile && <span>{link.name}</span>}
                            {!mobile && (
                                <div className="absolute left-full ml-4 whitespace-nowrap bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {link.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Logout */}
                <div
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-4 px-6 py-4 cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium md:relative md:w-full md:justify-center group"
                >
                    <LogOut className="w-6 h-6" />
                    {mobile && <span>{t('Sidebar.logout')}</span>}
                    {!mobile && (
                        <div className="absolute left-full ml-4 whitespace-nowrap bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {t('Sidebar.logout')}
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Toggle Button */}
            {mobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed bottom-6 left-6 md:hidden bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded-full shadow-lg z-50"
                >
                    {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
            )}

            {/* Overlay */}
            {mobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
}

export default Sidebar;
