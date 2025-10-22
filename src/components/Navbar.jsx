import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import './language/i18n';
import { useTranslation } from 'react-i18next';
import LanguageChange from './language/languageChange';
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light");
    const { t } = useTranslation();
    // const { t, i18n } = useTranslation();

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

    return (
        <nav className="flex items-center justify-between px-8 py-1 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="text-xl font-bold text-purple-900 dark:text-purple-300 transition-colors">
                <img className="w-15 float-left" src="mainLogo.png" alt="logo not found" />
                <div className="float-left py-4">
                    <span className="text-green-600">Agri</span> Sathi <span className="text-red-600">HUB</span>
                </div>
            </div>

            <div className="hidden md:flex space-x-8 text-gray-600 dark:text-gray-300 transition-colors">
                <Link to="/" className="hover:text-purple-600 dark:hover:text-white">{t('Navbar.home')}</Link>
                <Link to="/machine-rentals" className="hover:text-purple-600 dark:hover:text-white">{t('Navbar.machine Rentals')}</Link>
                <Link to="/labor-hire" className="hover:text-purple-600 dark:hover:text-white">{t('Navbar.labor Hire')}</Link>
                <Link to="/egov-services" className="hover:text-purple-600 dark:hover:text-white">{t('Navbar.eGov Services')}</Link>
                <Link to="/support" className="hover:text-purple-600 dark:hover:text-white">{t('Navbar.support')}</Link>
                <Link to="/about" className="hover:text-purple-600 dark:hover:text-white">{t('Navbar.about')}</Link>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun className="text-yellow-500" size={18} />}
                </button>
                <LanguageChange />
                {userId ? (
                    <>
                        {/* profile small icon */}

                        {/* Logged in state */}
                        <button onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userId');
                            navigate('/login');
                        }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            {t('logout')}
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate("/login")} className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors">
                            {t('login')}
                        </button>
                        <button onClick={() => navigate("/signup")} className="px-4 py-1 border border-gray-300 text-gray-600 dark:text-gray-300 dark:border-gray-500 rounded-full hover:bg-purple-600 hover:text-white transition-colors">
                            {t('register')}
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
