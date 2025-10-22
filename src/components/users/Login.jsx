import React, { useState } from "react";
// import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import OtpLogin from "./OtpLogin";
import PasswordLogin from "./PasswordLogin";
import { Link } from "react-router-dom";

function Login() {
    const { t } = useTranslation();
    const [loginMethod, setLoginMethod] = useState("otp"); // "otp" | "password"


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md transition-all duration-300">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
                    {t('loginComponent.user-login')}
                </h2>
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setLoginMethod("otp")}
                        className={`px-4 py-2 rounded-lg ${loginMethod === "otp" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                    >
                        {t('loginComponent.otp-login')}
                    </button>
                    <button
                        onClick={() => setLoginMethod("password")}
                        className={`px-4 py-2 rounded-lg ${loginMethod === "password" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                    >
                        {t('loginComponent.password-login')}
                    </button>
                </div>

                {loginMethod === "otp" ? <OtpLogin t={t} /> : <PasswordLogin t={t} />}

                <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
                    {t('loginComponent.dont-have-an-account')}{" "}
                    <Link
                        to="/signup"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {t('loginComponent.sign-up')}
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;