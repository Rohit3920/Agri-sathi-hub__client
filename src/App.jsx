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
import MyProfile from './components/users/MyProfile'
import MainMachineRantalPage from './pages/MainMachineRantalPage';
import UpdateMachine from './components/machine-rentals/UpdateMachine'
import MachineViewer from './components/machine-rentals/MachineViewer'
import FarmerProfile from './components/users/FarmerProfile'
import ServicerProfile from './components/users/ServicerProfile'
import AddMachine from './components/machine-rentals/AddMachine'

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

        <div className="ml-0 md:ml-21"> {/* only for desktop ml-20 and mobile ml-0 */}
          <Routes>
            <Route element={<ProtectRoute />}>
              {/* Protected routes go here */}

              <Route path="/" element={<Home t={t} />} />

              {/* machine rental routes */}
              <Route path="/add-new-machine" element={<AddMachine />} />
              <Route path="/machine-rentals" element={<MainMachineRantalPage />} />
              <Route path="/machine-update/:machineId" element={<UpdateMachine />} />
              <Route path="/machine-view/:machineId" element={<MachineViewer />} />

              {/* user routes */}
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/farmer-profile/:userId" element={<FarmerProfile />} />
              <Route path="/servicer-profile/:userId" element={<ServicerProfile />} />

              {/* messaging route */}
              <Route path="/user/messages/:userId" element={"message me "} />

            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>

    </div >
  )
}

export default App;