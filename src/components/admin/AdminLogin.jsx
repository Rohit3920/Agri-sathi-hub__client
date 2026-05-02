import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    // 🌙 Load theme from localStorage
    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "light") {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        } else {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // 🔁 Toggle Theme
    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setDarkMode(!darkMode);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/api/admin/login", {
                email,
                password,
            });

            if (res.status === 200) {
                sessionStorage.setItem("adminToken", res.data.token);
                sessionStorage.setItem("isAdmin", "true");
                navigate("/admin/dashboard");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4
            bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400
            dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all duration-500">

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-5 right-5 px-4 py-2 rounded-xl text-sm
                bg-black text-white dark:bg-white dark:text-black shadow-md"
            >
                {darkMode ? "Light" : "Dark"}
            </button>

            {/* Floating Card */}
            <div className="w-full max-w-md sm:max-w-lg md:max-w-md
                backdrop-blur-xl bg-white/70 dark:bg-white/10
                border border-gray-300 dark:border-white/20
                shadow-2xl rounded-3xl p-6 sm:p-8 transition-all duration-300">

                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6
                    text-gray-800 dark:text-white">
                    Admin Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Enter admin email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl
                        bg-white dark:bg-white/10
                        text-gray-800 dark:text-white
                        placeholder-gray-500 dark:placeholder-gray-300
                        border border-gray-300 dark:border-white/20
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl
                        bg-white dark:bg-white/10
                        text-gray-800 dark:text-white
                        placeholder-gray-500 dark:placeholder-gray-300
                        border border-gray-300 dark:border-white/20
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold
                        bg-blue-600 hover:bg-blue-700
                        text-white transition duration-300 shadow-lg"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;