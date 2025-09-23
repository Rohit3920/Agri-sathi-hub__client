import React from 'react'
import './App.css'
import Navbar from './components/Navbar'

function App() {

  return (
    //all content center using tailwindcss
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors text-center">
      <Navbar />
      <h1 className='text-3xl font-bold underline text-black dark:text-gray-300'>AGRI SATHI HUB</h1>
    </div>
  )
}

export default App