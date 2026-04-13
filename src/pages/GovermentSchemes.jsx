import React from 'react'
import SchemeDetails from '../components/govScheme/SchemeDetails'
import SchemeBannerSlider from '../components/govScheme/SchemeBannerSlider'
import Footer from '../components/Footer'

function GovermentSchemes() {
    return (
        <div>
            <SchemeBannerSlider />
            <SchemeDetails />
            <Footer/>
        </div>
    )
}

export default GovermentSchemes
