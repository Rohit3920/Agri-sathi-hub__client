import React from 'react'
import ListOfMachines from '../components/machine-rentals/ListOfMachines';
import RentedMachines from '../components/machine-rentals/RentedMachines';
import AvailableMachines from '../components/machine-rentals/AvailableMachines';
// import ServiceCard from './ServiceCard';


function MainMachineRentalPage() {

    return (
        <div className='text-black dark:text-white'>
            {/* <h1 className="text-2xl font-bold">Machine Rental page</h1>
            <p>Welcome to the Machine Rental page!</p> */}

            <ListOfMachines />
            <RentedMachines />
            <AvailableMachines />

        </div>
    )
}

export default MainMachineRentalPage
