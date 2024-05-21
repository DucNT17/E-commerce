import React from 'react'
import banner from '../assets/logo1.jpg'

const Banner = () => {
  return (
    <div className='w-full'>
      <img src={banner} alt='banner' className='h-[420px] w-full object-cover'/>
    </div>
  )
}

export default Banner