import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import './language/i18n';
import { useTranslation } from 'react-i18next';
import LanguageChange from './language/languageChange';
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ user }) {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const location = useLocation(); // Added to track current URL
    const [theme, setTheme] = useState("light");
    const { t } = useTranslation();

    // Profile dropdown
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef();

    const defaultAvatar = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    const frontNavLinks = [
        { name: "Home", href: "#home" },
        { name: "Services", href: "#services" },
        { name: "About", href: "#about" },
        { name: "Contact", href: "#contact" },
    ];

    // Function to handle clicking on hash links from other pages
    const handleNavClick = (e, href) => {
        if (location.pathname !== "/") {
            e.preventDefault();
            navigate("/" + href); // Redirects to e.g., /#services
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        }
    }, []);

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

    const GoToProfile = () => {
        navigate("/profile");
        setProfileOpen(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="flex items-center justify-between px-8 py-1 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">

            {/* Logo */}
            <div className="text-xl font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                <img className="w-15" src="mainLogo.png" alt="logo not found" />
                <div>
                    <span className="text-green-600">Agri</span> Sathi <span className="text-red-600">HUB</span>
                </div>
            </div>

            {/* Navbar Links */}
            <div className="hidden md:flex space-x-6 text-gray-600 dark:text-gray-300">

                {/* Always visible */}
                {userId && <Link to="/" className="hover:text-purple-600 dark:hover:text-white">
                    {t('Navbar.home')}
                </Link> }

                {!userId && <div className="max-w-7xl mx-auto px-6 py-5 flex justify-center">
                    <ul className="flex items-center space-x-8 md:space-x-16">
                        {frontNavLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)} // Functionality added here
                                    className="hover:text-purple-600 dark:hover:text-white"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>}

                {/* Logged In */}
                {userId && (
                    <>
                        <Link to="/machine-rentals" className="hover:text-purple-600 dark:hover:text-white">
                            {t('Navbar.machine Rentals')}
                        </Link>
                        <Link to="/labor-hire" className="hover:text-purple-600 dark:hover:text-white">
                            {t('Navbar.labor Hire')}
                        </Link>
                        <Link to="/egov-services" className="hover:text-purple-600 dark:hover:text-white">
                            {t('Navbar.eGov Services')}
                        </Link>
                    </>
                )}

                {/* Logged In  */}
                {userId && <Link to="/about" className="hover:text-purple-600 dark:hover:text-white">
                    {t('Navbar.about')}
                </Link>}

                {userId && <Link to="/agri-sathi-hub/our-team" className="hover:text-purple-600 dark:hover:text-white">
                    {t('Navbar.contact')}
                </Link>}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    {theme === "light" ? <Moon size={16} /> : <Sun className="text-yellow-500" size={16} />}
                </button>

                <LanguageChange />

                {userId ? (
                    <div className="relative" ref={profileRef}>

                        {/* Profile Image */}
                        <img
                            src={user?.profilePicture || defaultAvatar}
                            alt="profile"
                            className="w-8 h-8 rounded-full object-cover border border-purple-500 cursor-pointer"
                            onClick={() => setProfileOpen(!profileOpen)}
                        />

                        {/* Dropdown */}
                        {profileOpen && (
                            <div className="absolute right-0 top-10 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-50 p-3">

                                {/* Header */}
                                <div className="flex items-center gap-2 border-b pb-2 mb-2">
                                    <img
                                        src={user?.profilePicture || defaultAvatar}
                                        alt="profile"
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                        {user?.username}
                                    </h4>
                                </div>

                                {/* Info */}
                                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                                    <p><strong>Email:</strong> {user?.email}</p>

                                    <p><strong>Mobile:</strong> {user?.MobileNum}</p>

                                    <p><strong>Role:</strong> {user?.userMode}</p>

                                    {/* Address */}
                                    {user?.address?.length > 0 && (
                                        <p>
                                            <strong>City:</strong> {user.address[0]?.city}, {user.address[0]?.state}
                                        </p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <button
                                    className="mt-3 w-full py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                                    onClick={GoToProfile}
                                >
                                    Profile
                                </button>

                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('userId');
                                        navigate('/login');
                                    }}
                                    className="mt-2 w-full py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                                >
                                    {t('logout')}
                                </button>

                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white text-sm"
                        >
                            {t('login')}
                        </button>

                        <button
                            onClick={() => navigate("/signup")}
                            className="px-3 py-1 border border-gray-300 text-gray-600 dark:text-gray-300 dark:border-gray-500 rounded-full hover:bg-purple-600 hover:text-white text-sm"
                        >
                            {t('register')}
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}