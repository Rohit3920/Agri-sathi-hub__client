import React from 'react'
import GoogleLangTran from './language/GoogleLangTran'

function Home({ t }) {
    return (
        <div className='text-center pt-5'>
            <img className='mx-auto' src="mainLogo.png" alt="" />
            <h1 className='text-3xl font-bold underline text-black dark:text-gray-300  mt-4'>{t('agri sathi hub')}</h1>

            <p><GoogleLangTran /></p>
        </div>
    )
}

export default Home
