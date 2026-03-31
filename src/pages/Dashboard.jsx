import React from 'react'
import ProviderDashboard from './dashboard/ProviderDashboard'
import WorkerDashboard from './dashboard/WorkerDashboard'
import FarmerDashboard from './dashboard/FarmerDashboard'

function Dashboard() {
    const activeDashboard = localStorage.getItem('userMode')
    const renderDashboard = () => {
        switch (activeDashboard) {
            case 'servicer':
                return <ProviderDashboard />
            case 'worker':
                return <WorkerDashboard />
            case 'farmer':
                return <FarmerDashboard />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-r from-gray-100 to-green-50 
                        dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">

            <div className="bg-white dark:bg-gray-900 
                            rounded-2xl shadow-xl p-6 
                            transition-all duration-300">
                {renderDashboard()}
            </div>
        </div>
    )
}

export default Dashboard