import React from 'react'
import banner from '../assets/logo1.png'

const Banner = () => {
  return (
    <div className='w-full'>
      <img src={banner} alt='banner' className='h-[420px] w-full object-cover'/>
    </div>
  )
}

export default Banner