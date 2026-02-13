import React from 'react'
import CreateWorkerProfile from '../../components/labor-hiring/CreateWorkerProfile'
import CreateWorkerGroup from '../../components/labor-hiring/CreateWorkerGroup'
import StatusUpdate from '../../components/labor-hiring/StatusUpdate'

function WorkerDashboard() {
    const userId = localStorage.getItem('userId')
    const hireId = "6983583f264328a6632ce056"
    return (
        <div>
            <h2>This is Worker dashboard </h2>

            <StatusUpdate hireId={hireId}/>

            <CreateWorkerProfile userId={userId}/>

            <CreateWorkerGroup leaderId={userId} />
        </div>
    )
}

export default WorkerDashboard
