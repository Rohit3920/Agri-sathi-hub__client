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
        en: { translation: eng },
        hi: { translation: hindi },
        mr: { translation: mar },
        as: { translation: assam },
        bn: { translation: beng },
        brx: { translation: bodo },
        doi: { translation: dogri },
        gu: { translation: guj },
        kn: { translation: kanna },
        ks: { translation: kashmiri },
        gom: { translation: kokan },
        mai: { translation: maithi },
        ml: { translation: malay },
        mni: { translation: manipuri },
        ne: { translation: nepali },
        or: { translation: odia },
        pa: { translation: punjabi },
        sa: { translation: sanskrit },
        santali: { translation: santali },
        sindhi: { translation: sindhi },
        tamil: { translation: tamil },
        telugu: { translation: telugu },
        urdu: { translation: urdu }
    },

    fallbackLng: 'en',

    interpolation: {
        escapeValue: false
    }
})

export default i18n;