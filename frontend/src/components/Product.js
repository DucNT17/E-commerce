import React from 'react'
import { formatMoney } from '../utils/helper'
import trendingLabel from '../assets/trending.png'
import newLabel from '../assets/new.png'
import { renderStarFromNumber } from '../utils/helper'


const Product = ({ productData, isNew }) => {
  return (
    <div className='w-full text-base px-[10px]'>
      <div className='w-full border p-[15px] flex flex-col items-center'>
        <div className='w-full relative'>
          <img src={productData?.thumb || 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'}
            alt='' className='w-[243px] h-[243px] object-cover'
          />
          <img src={isNew ? newLabel : trendingLabel} alt='' className='absolute top-0 right-[15px] w-[70px] h-[25px] object-cover' />
        </div>
        <div className='flex flex-col gap-1 mt-[15px] items-start w-full'>
          <span className='flex'>
            {renderStarFromNumber(productData?.totalRatings)}
          </span>
          <span className='line-clamp-1'>
            {productData?.title}
          </span>
          <span>
            {`${formatMoney(productData?.price)} VND`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Product