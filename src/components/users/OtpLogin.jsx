import React, { useState } from "react";
import { toast } from "react-toastify";

export default function OtpLogin({ t }) {
    const [step, setStep] = useState("login"); // login | verify
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [sentOtp, setSentOtp] = useState(""); // mock OTP for demo

    // Mock send OTP
    const handleSendOtp = () => {
        if (mobile.length !== 10) {
            toast.error(t('loginComponent.otp.please-enter-a-valid-10-digit-mobile-number'));
            return;
        }
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setSentOtp(generatedOtp);
        setStep("verify");
        console.log("Mock OTP:", generatedOtp);
        toast.success(t('loginComponent.otp.OTP-sent-successfully'));
    };

    // Mock verify OTP
    const handleVerifyOtp = () => {
        if (otp === sentOtp) {
            toast.success(t('loginComponent.otp.OTP-verified-successfully'));
            setStep("login");
            setMobile("");
            setOtp("");
        } else {
            toast.error(t('loginComponent.otp.Invalid-OTP-Try-again'));
        }
    };

    return (
        // <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md transition-all duration-300">

            {step === "login" ? (
                <>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {t('loginComponent.otp.mobile-number')}
                    </label>
                    <input
                        type="tel"
                        placeholder={t('loginComponent.otp.enter-mobile-number')}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                    <button
                        onClick={handleSendOtp}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        {t('loginComponent.otp.send-otp')}
                    </button>
                </>
            ) : (
                <>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {t('loginComponent.otp.enter-otp')}
                    </label>
                    <input
                        type="number"
                        placeholder={t('loginComponent.otp.otp-placeholder')}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 outline-none dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                    <button
                        onClick={handleVerifyOtp}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        {t('loginComponent.otp.verify-otp')}
                    </button>
                    <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
                        {t('loginComponent.otp.didnt-receive-OTP?')}{" "}
                        <button
                            onClick={handleSendOtp}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {t('loginComponent.otp.resend')}
                        </button>
                    </p>
                </>
            )}
        </div>
        // </div>
    );
}
