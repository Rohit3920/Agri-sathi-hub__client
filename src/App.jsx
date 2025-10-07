import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import './components/language/i18n'
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    //all content center using tailwindcss
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors text-center">
      <Navbar />
      <h1 className='text-3xl font-bold underline text-black dark:text-gray-300'>{t('agri sathi hub')}</h1>
    </div>
  )
}

export default App