import React from 'react'

function Home({ t }) {
    return (
        <div className='text-center pt-5'>
            <img className='mx-auto' src="mainLogo.png" alt="" />
            <h1 className='text-3xl font-bold underline text-black dark:text-gray-300  mt-4'>{t('agri sathi hub')}</h1>
        </div>
    )
}

export default Home
