import React, { useEffect } from 'react';

function GoogleLangTran() {
  const lang = localStorage.getItem("appLang") || "en";
  console.log("GoogleLangTran Rendered with lang:", lang);

  useEffect(() => {
    // 1. Function to set the Google Translate Cookie
    const setLanguageCookie = (languageCode) => {
      // The format is /auto/lang_code or /source_lang/target_lang
      document.cookie = `googtrans=/en/${languageCode}; path=/;`;
      document.cookie = `googtrans=/en/${languageCode}; domain=.${window.location.host}; path=/;`;
    };

    // 2. Initialize the Google Translate Script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'hi,mr,kn,sa,ur,ta,te,ml,gu,pa,bn,or,as,ne,kok,sd,en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      };
    };

    // Check if script already exists, if not, add it
    if (!window.googleTranslateElementInit) {
      addScript();
    }

    // 3. Apply the language change when the 'lang' prop changes
    if (lang) {
      setLanguageCookie(lang);
      // We often need to reload to force Google Translate to re-scan the DOM
      // window.location.reload(); 
    }
  }, [lang]); // Dependency array includes 'lang'

  return (
    <div className="flex items-center justify-center">
      {lang == 'en' && (
        <div className="rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 px-3 py-2 text-sm shadow-sm">
          <div
            id="google_translate_element"
            className="text-gray-800 dark:text-gray-200
                [&_.goog-te-gadget]:text-sm
                [&_.goog-te-gadget-simple]:bg-transparent
                [&_.goog-te-gadget-simple]:border-none
                [&_.goog-te-gadget-simple]:p-0"
          ></div>
        </div>
      )}
    </div>
  );
}

export default GoogleLangTran;