import React from 'react';
import { useTranslation } from 'react-i18next';
import GoogleLangTran from './GoogleLangTran'; // Import the component

function LanguageChange() {
    const { i18n } = useTranslation();

    const handleChanges = () => (e) => {
        const langCode = e.target.value;
        i18n.changeLanguage(langCode);
        localStorage.setItem("appLang", i18n.language);
    };

    const languages = [
        { code: 'en', name: 'English (English)' },
        { code: 'hi', name: 'Hindi (हिन्दी)' },
        { code: 'mr', name: 'Marathi (मराठी)' },
        { code: 'as', name: 'Assamese (অসমীয়া)' },
        { code: 'bn', name: 'Bengali (বাংলা)' },
        { code: 'brx', name: 'Bodo (बड़ो)' },
        { code: 'doi', name: 'Dogri (डोगरी)' },
        { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
        { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
        { code: 'ks', name: 'Kashmiri (کٲشُر)' },
        { code: 'gom', name: 'Konkani (कोंकणी)' },
        { code: 'mai', name: 'Maithili (मैथिली)' },
        { code: 'ml', name: 'Malayalam (മലയാളം)' },
        { code: 'mni', name: 'Manipuri (মণিপুরী)' },
        { code: 'ne', name: 'Nepali (नेपाली)' },
        { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
        { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
        { code: 'sa', name: 'Sanskrit (संस्कृतम्)' },
        { code: 'santali', name: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)' },
        { code: 'sindhi', name: 'Sindhi (सिन्धी)' },
        { code: 'ta', name: 'Tamil (தமிழ்)' },
        { code: 'te', name: 'Telugu (తెలుగు)' },
        { code: 'ur', name: 'Urdu (اردو)' }
    ];

    return (
        <>
            <select
                onChange={handleChanges()}
                value={i18n.language}
                className="
                    bg-gray-100 text-gray-900 border-1 border-gray-400 rounded-lg shadow-md hover:border-purple-400 dark:bg-gray-800 dark:text-white dark:border-purple-600 dark:hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium py-2 px-4 appearance-none cursor-pointer
                "
                style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
            >
                {languages.map((lang) => (
                    <option
                        key={lang.code}
                        value={lang.code}
                        className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                    >
                        {lang.name}
                    </option>
                ))}
            </select>

            {/* This component will receive the 'lang' prop. 
               When i18n.language changes, this component re-renders.
            */}
            {/* <GoogleLangTran lang={i18n.language} /> */}
        </>
    );
}

export default LanguageChange;