import React from 'react'
import { useTranslation } from 'react-i18next';

function LanguageChange() {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'eng', name: 'English' },
        { code: 'hindi', name: 'हिन्दी' },
        { code: 'mar', name: 'मराठी' },
        { code: 'assam', name: 'অসমীয়া' },
        { code: 'beng', name: 'বাংলা' },
        { code: 'bodo', name: 'बड़ो' },
        { code: 'dogri', name: 'डोगरी' },
        { code: 'guj', name: 'ગુજરાતી' },
        { code: 'kanna', name: 'ಕನ್ನಡ' },
        { code: 'kashmiri', name: 'کٲشُر' },
        { code: 'kokan', name: 'कोंकणी' },
        { code: 'maithi', name: 'मैथिली' },
        { code: 'malay', name: 'മലയാളം' },
        { code: 'manipuri', name: 'মণিপুরী' },
        { code: 'nepali', name: 'नेपाली' },
        { code: 'odia', name: 'ଓଡ଼ିଆ' },
        { code: 'punjabi', name: 'ਪੰਜਾਬੀ' },
        { code: 'sanskrit', name: 'संस्कृतम्' },
        { code: 'santali', name: 'ᱥᱟᱱᱛᱟᱲᱤ' },
        { code: 'sindhi', name: 'सिन्धी' },
        { code: 'tamil', name: 'தமிழ்' },
        { code: 'telugu', name: 'తెలుగు' },
        { code: 'urdu', name: 'اردو' }
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