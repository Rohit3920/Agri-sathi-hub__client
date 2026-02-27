import React, { useState } from 'react'
import ProviderDashboard from './dashboard/ProviderDashboard'
import WorkerDashboard from './dashboard/WorkerDashboard'
import FarmerDashboard from './dashboard/FarmerDashboard'

function Dashboard() {
    const [activeDashboard, setActiveDashboard] = useState('provider')

    const renderDashboard = () => {
        switch (activeDashboard) {
            case 'provider':
                return <ProviderDashboard />
            case 'worker':
                return <WorkerDashboard />
            case 'farmer':
                return <FarmerDashboard />
            default:
                return null
        }
    }

    const buttonBase =
        "px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md"

    const activeStyle =
        "bg-green-600 text-white scale-105 shadow-lg"

    const inactiveStyle =
        "bg-white text-gray-700 hover:bg-green-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"

    return (
        <div className="min-h-screen p-6 bg-gradient-to-r from-gray-100 to-green-50 
                        dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">

            <h2 className="text-3xl font-bold text-center mb-8 
                           text-gray-800 dark:text-gray-100">
                Dashboard Panel
            </h2>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveDashboard('provider')}
                    className={`${buttonBase} ${
                        activeDashboard === 'provider'
                            ? activeStyle
                            : inactiveStyle
                    }`}
                >
                    Provider Dashboard
                </button>

                <button
                    onClick={() => setActiveDashboard('worker')}
                    className={`${buttonBase} ${
                        activeDashboard === 'worker'
                            ? activeStyle
                            : inactiveStyle
                    }`}
                >
                    Worker Dashboard
                </button>

                <button
                    onClick={() => setActiveDashboard('farmer')}
                    className={`${buttonBase} ${
                        activeDashboard === 'farmer'
                            ? activeStyle
                            : inactiveStyle
                    }`}
                >
                    Farmer Dashboard
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 
                            rounded-2xl shadow-xl p-6 
                            transition-all duration-300">
                {renderDashboard()}
            </div>
        </div>
    )
}

export default Dashboard