import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import assam from '../../locales/Assam/translation.json'
import beng from '../../locales/Beng/translation.json'
import bodo from '../../locales/Bodo/translation.json'
import dogri from '../../locales/Dogri/translation.json'
import eng from '../../locales/eng/translation.json'
import guj from '../../locales/Guj/translation.json'
import hindi from '../../locales/hindi/translation.json'
import kanna from '../../locales/Kanna/translation.json'
import kashmiri from '../../locales/Kashmiri/translation.json'
import kokan from '../../locales/kokan/translation.json'
import maithi from '../../locales/Maithi/translation.json'
import malay from '../../locales/Malay/translation.json'
import manipuri from '../../locales/Manipuri/translation.json'
import mar from '../../locales/mar/translation.json'
import nepali from '../../locales/Nepali/translation.json'
import odia from '../../locales/Odia/translation.json'
import punjabi from '../../locales/Punjabi/translation.json'
import sanskrit from '../../locales/Sanskrit/translation.json'
import santali from '../../locales/Santali/translation.json'
import sindhi from '../../locales/Sindhi/translation.json'
import tamil from '../../locales/Tamil/translation.json'
import telugu from '../../locales/Telugu/translation.json'
import urdu from '../../locales/Urdu/translation.json'


i18n.use(initReactI18next).init({
    resources: {
        eng: { translation: eng },
        hindi: { translation: hindi },
        mar: { translation: mar },
        assam: { translation: assam },
        beng: { translation: beng },
        bodo: { translation: bodo },
        dogri: { translation: dogri },
        guj: { translation: guj },
        kanna: { translation: kanna },
        kashmiri: { translation: kashmiri },
        kokan: { translation: kokan },
        maithi: { translation: maithi },
        malay: { translation: malay },
        manipuri: { translation: manipuri },
        nepali: { translation: nepali },
        odia: { translation: odia },
        punjabi: { translation: punjabi },
        sanskrit: { translation: sanskrit },
        santali: { translation: santali },
        sindhi: { translation: sindhi },
        tamil: { translation: tamil },
        telugu: { translation: telugu },
        urdu: { translation: urdu }
    },

    fallbackLng: 'eng',

    interpolation: {
        escapeValue: false
    }
})

export default i18n;