import React, { memo, useState } from 'react'
import { formatMoney } from 'utils/helper'
import trendingLabel from 'assets/trending.png'
import newLabel from 'assets/new.png'
import { renderStarFromNumber } from 'utils/helper'
import { SelectOption } from '..'
import icons from 'utils/icons'
import { Link } from 'react-router-dom'


const { AiFillEye, AiOutlineMenu, FaHeart } = icons

const Product = ({ productData, isNew, normal }) => {

  const [isShowOption, setIsShowOption] = useState(false);

  return (
    <div className='w-full text-base px-[10px]'>
      <Link className='w-full border p-[15px] flex flex-col items-center'
        to={`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`}
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
            alt='' className='w-[274px] h-[274px] object-cover'
          />
          {!normal && <img src={isNew ? newLabel : trendingLabel} alt='' className='absolute top-0 right-[15px] w-[70px] h-[25px] object-cover' />}
        </div>
        <div className='flex flex-col gap-1 mt-[15px] items-start w-full'>
          <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}</span>
          <span className='line-clamp-1'>
            {productData?.title}
          </span>
          <span>
            {`${formatMoney(productData?.price)} VND`}
          </span>
        </div>
      </Link>
    </div>
  )
}

export default memo(Product)