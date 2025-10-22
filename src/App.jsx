import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import './components/language/i18n'
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectRoute from './components/ProtectRoute';
import PageNotFound from './components/PageNotFound';
import Login from './components/users/Login';
import Signup from './components/users/Signup';
import Home from './components/Home';

function App() {
  const { t } = useTranslation();
  const navbarHeight = '70px';

  return (
    //all content center using tailwindcss
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors text-center">
      <Router>
        <Navbar t={t} className="fixed top-0 left-0 right-0 z-400" />

        {/* Desktop sidebar */}
        <div
          className="hidden md:block fixed left-0 z-200"
          style={{ top: navbarHeight, height: `calc(100vh - ${navbarHeight})` }}
        >
          <Sidebar t={t} />
        </div>
        {/* Mobile overlay sidebar */}
        <Sidebar t={t} mobile />

        <Routes>
          <Route element={<ProtectRoute />}>
            {/* Protected routes go here */}

          </Route>

          <Route path="/" element={<Home t={t} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;