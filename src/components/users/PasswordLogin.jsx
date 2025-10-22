import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function PasswordLogin({ t }) {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Basic validation
            if (!userInput || !password) {
                toast.error(t('loginComponent.passwordLogin.Please-fill-in-all-fields'));
                return;
            }

            const res = await api.post('/api/auth/login', { email: userInput, password });
            console.log('Login response:', res.data);
            const token = res.data.session.access_token;
            const userId = res.data.user.id;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            toast.success(t('loginComponent.passwordLogin.Login-successful'));
            setUserInput("");
            setPassword("");
            navigate('/');
        } catch (err) {
            toast.error(t('loginComponent.passwordLogin.Invalid-credentials'));
            console.error('Login error:', err.response?.data || err.message);
        }
    };

    return (
        // <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md transition-all duration-300">

            <form onSubmit={handleLogin}>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                    {t('loginComponent.passwordLogin.email-or-phone')}
                </label>
                <input
                    type="text"
                    placeholder={t('loginComponent.passwordLogin.enter-email-or-phone')}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:text-gray-100 transition-all"
                />

                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                    {t('loginComponent.passwordLogin.password')}
                </label>
                <input
                    type="password"
                    placeholder={t('loginComponent.passwordLogin.enter-password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 outline-none dark:bg-gray-700 dark:text-gray-100 transition-all"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    {t('loginComponent.passwordLogin.login-button')}
                </button>
            </form>
        </div>
        // </div>
    );
}
