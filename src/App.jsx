import React, { useState } from 'react'
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
import MyProfile from './components/users/MyProfile'
import MainMachineRentalPage from './pages/MainMachineRentalPage';
import UpdateMachine from './components/machine-rentals/UpdateMachine'
import MachineViewer from './components/machine-rentals/MachineViewer'
import FarmerProfile from './components/users/FarmerProfile'
import ServicerProfile from './components/users/ServicerProfile'
import AddMachine from './components/machine-rentals/AddMachine'
import Verify from './components/users/Verify'
import UploadProfile from './components/users/UploadProfile'
import ChatUI from './components/message/ChatUl';
import LaborHire from './pages/LaborHire'
import WorkerDetail from "./components/labor-hiring/WorkerDetail"
import GroupDetail from "./components/labor-hiring/GroupDetail"
import About from './pages/About'
import WorkerDashboard from './pages/dashboard/WorkerDashboard'
import AgriSathiBot from './components/chatBot/AgriSathiBot'
import GovermentSchemes from './pages/GovermentSchemes'

function App() {
  const { t } = useTranslation();
  const navbarHeight = '70px';

  // ✅ Chat toggle state
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors text-center">
      <Router>
        <Navbar t={t} className="fixed top-0 left-0 right-0 z-400" />

        {/* Desktop sidebar */}
        <div
          className="hidden md:block fixed left-0 z-20 rounded-r-md"
          style={{ top: `calc(${navbarHeight} + 40px)`, height: `calc(100vh - ${navbarHeight} - 100px)` }}
        >
          <Sidebar t={t} />
        </div>

        {/* Mobile overlay sidebar */}
        <Sidebar t={t} mobile />

        <div className="ml-0 md:ml-21">
          <Routes>
            <Route element={<ProtectRoute />}>
              <Route path="/" element={<Home t={t} />} />

              {/* machine rental routes */}
              <Route path="/add-new-machine" element={<AddMachine />} />
              <Route path="/machine-rentals" element={<MainMachineRentalPage />} />
              <Route path="/machine-update/:machineId" element={<UpdateMachine />} />
              <Route path="/machine-view/:machineId" element={<MachineViewer />} />

              {/* labor hiring route  */}
              <Route path='/dashboard' element={<WorkerDashboard />} />
              <Route path="/labor-hire" element={<LaborHire />} />
              <Route path="/worker/:workerId" element={<WorkerDetail />} />
              <Route path="/group/:groupId" element={<GroupDetail />} />

              {/* user routes */}
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/farmer-profile/:userId" element={<FarmerProfile />} />
              <Route path="/servicer-profile/:userId" element={<ServicerProfile />} />
              <Route path="/upload-profile" element={<UploadProfile />} />

              {/* Gov scheme routes */}
              <Route path='/egov-services' element={<GovermentSchemes />} />

              {/* messaging route */}
              <Route path="/user/messages" element={<ChatUI />} />
              <Route path="/user/messages/:messageUserId" element={<ChatUI />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path='/about' element={<About />} />
          </Routes>
        </div>


        {/* ✅ FLOATING CHATBOT SECTION */}
        <div className="fixed bottom-2 right-6 z-[9999]">
          {chatOpen && (
            <div className="mb-2 animate-fadeIn relative">
              <button
                onClick={() => setChatOpen(false)}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600"
              >
                ✖
              </button>

              <AgriSathiBot />
            </div>
          )}

          {/* Floating Button */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-green-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-green-800 transition"
          >
            🌾
          </button>
        </div>

      </Router>
    </div>
  )
}

export default App;