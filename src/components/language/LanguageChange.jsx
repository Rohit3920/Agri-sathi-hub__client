import React from 'react'
import { useTranslation } from 'react-i18next';

function LanguageChange() {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'eng', name: 'English (English)' },
        { code: 'hindi', name: 'Hindi (हिन्दी)' },
        { code: 'mar', name: 'Marathi (मराठी)' },
        { code: 'assam', name: 'Assamese (অসমীয়া)' },
        { code: 'beng', name: 'Bengali (বাংলা)' },
        { code: 'bodo', name: 'Bodo (बड़ो)' },
        { code: 'dogri', name: 'Dogri (डोगरी)' },
        { code: 'guj', name: 'Gujarati (ગુજરાતી)' },
        { code: 'kanna', name: 'Kannada (ಕನ್ನಡ)' },
        { code: 'kashmiri', name: 'Kashmiri (کٲشُر)' },
        { code: 'kokan', name: 'Konkani (कोंकણી)' },
        { code: 'maithi', name: 'Maithili (मैथिली)' },
        { code: 'malay', name: 'Malayalam (മലയാളം)' },
        { code: 'manipuri', name: 'Manipuri (মণিপুরী)' },
        { code: 'nepali', name: 'Nepali (नेपाली)' },
        { code: 'odia', name: 'Odia (ଓଡ଼ିଆ)' },
        { code: 'punjabi', name: 'Punjabi (ਪੰਜਾਬੀ)' },
        { code: 'sanskrit', name: 'Sanskrit (संस्कृतम्)' },
        { code: 'santali', name: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)' },
        { code: 'sindhi', name: 'Sindhi (सिन्धी)' },
        { code: 'tamil', name: 'Tamil (தமிழ்)' },
        { code: 'telugu', name: 'Telugu (తెలుగు)' },
        { code: 'urdu', name: 'Urdu (اردو)' }
    ];

    return (
        <>
            <select
                onChange={(e) => i18n.changeLanguage(e.target.value)}
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
        </>
    );
}

export default LanguageChange;