import React, { memo } from 'react'
import { CustomSlider } from 'components'
import { useSelector } from 'react-redux';


const NewArrival = () => {
    const { newProducts } = useSelector(state => state.products)
    return (
        <div className='w-full'>
            <h3 className='text-[20px] font-semibold py-[15px] uppercase border-main border-b-2'>NEW ARRIVALS</h3>
            <div className='mt-4 mx-[-10px]'>
                <CustomSlider products={newProducts} />
            </div>
        </div>
    )
}

export default memo(NewArrival)