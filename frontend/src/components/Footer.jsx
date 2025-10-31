import React from 'react'

const Footer = () => {
  return (
    <div className='bg-black text-white text-center align-middle font-bold relative left-0 right-0 bottom-0 py-4' >
        Expenses Management App @{new Date().getFullYear()}
    </div>
  )
}

export default Footer