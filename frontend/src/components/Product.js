import React, { useState } from 'react'
import { formatMoney } from '../utils/helper'
import trendingLabel from '../assets/trending.png'
import newLabel from '../assets/new.png'
import { renderStarFromNumber } from '../utils/helper'
import { SelectOption } from './'
import icons from '../utils/icons'

const { AiFillEye, AiOutlineMenu, FaHeart } = icons

const Product = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  return (
    <div className='w-full text-base px-[10px]'>
      <div className='w-full border p-[15px] flex flex-col items-center'
        onMouseEnter={e => {
          e.stopPropagation();
          setIsShowOption(true);
        }} 
        onMouseLeave={e => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className='w-full relative'>
          {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-3 animate-slide-top'>
            <SelectOption icon={<AiFillEye />} />
            <SelectOption icon={<AiOutlineMenu />} />
            <SelectOption icon={<FaHeart />} />
          </div>}
          <img src={productData?.thumb || 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'}
            alt='' className='w-[247px] h-[247px] object-cover'
          />
          <img src={isNew ? newLabel : trendingLabel} alt='' className='absolute top-0 right-[15px] w-[70px] h-[25px] object-cover' />
        </div>
        <div className='flex flex-col gap-1 mt-[15px] items-start w-full'>
          <span className='flex'>{renderStarFromNumber(productData?.totalRatings)}</span>
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