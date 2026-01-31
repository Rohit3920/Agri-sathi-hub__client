import React, { useEffect } from 'react';

function GoogleLangTran() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages:
            'hi,mr,kn,sa,ur,ta,te,ml,gu,pa,bn,or,as,ne,kok,sd',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div
        className="
          rounded-lg border 
          bg-white dark:bg-gray-900
          border-gray-300 dark:border-gray-700
          px-3 py-2
          text-sm
          shadow-sm
        "
      >
        <div
          id="google_translate_element"
          className="
            text-gray-800 dark:text-gray-200
            [&_.goog-te-gadget]:text-sm
            [&_.goog-te-gadget-simple]:bg-transparent
            [&_.goog-te-gadget-simple]:border-none
            [&_.goog-te-gadget-simple]:p-0
          "
        ></div>
      </div>
    </div>
  );
}

export default GoogleLangTran;
