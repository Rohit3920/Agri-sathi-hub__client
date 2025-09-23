import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
    const [theme, setTheme] = useState("light");

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
                <a href="#" className="hover:text-purple-600 dark:hover:text-white">Home</a>
                <a href="#" className="hover:text-purple-600 dark:hover:text-white">Machine Rental</a>
                <a href="#" className="hover:text-purple-600 dark:hover:text-white">Labor Hiring</a>
                <a href="#" className="hover:text-purple-600 dark:hover:text-white">eGov Service</a>
                <a href="#" className="hover:text-purple-600 dark:hover:text-white">Support</a>
                <a href="#" className="hover:text-purple-600 dark:hover:text-white">About</a>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun className="text-yellow-500" size={18} />}
                </button>
                <button className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors">
                    Login
                </button>
                <button className="px-4 py-1 border border-gray-300 text-gray-600 dark:text-gray-300 dark:border-gray-500 rounded-full hover:bg-purple-600 hover:text-white transition-colors">
                    Register
                </button>
            </div>
        </nav>
    );
}
