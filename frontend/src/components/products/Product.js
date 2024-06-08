import React, { memo, useState } from 'react'
import { formatPriceVN } from 'utils/helper'
import trendingLabel from 'assets/trending.png'
import newLabel from 'assets/new.png'
import { renderStarFromNumber } from 'utils/helper'
import { SelectOption } from '..'
import icons from 'utils/icons'
import withBaseComponent from 'hocs/withBaseComponent'


const { AiFillEye, AiOutlineMenu, FaHeart } = icons

const Product = ({ productData, isNew, normal, navigate }) => {

  const [isShowOption, setIsShowOption] = useState(false);
  const handleClickOptions = (e, flag) => {
    e.stopPropagation();
    if (flag === 'MENU') {
      navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`);
    }
    if (flag === 'WISHLIST') {
      console.log('WISHLIST');
    }
    if (flag === 'QUICK_VIEW') {
      console.log('QUICK_VIEW');
    }
  }
  return (
    <div className='w-full text-base px-[10px]'>
      <div className='w-full border p-[15px] flex flex-col items-center cursor-pointer'
        onClick={() => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
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
            <span onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}><SelectOption icon={<AiFillEye />} /></span>
            <span onClick={(e) => handleClickOptions(e, 'MENU')}>
              <SelectOption icon={<AiOutlineMenu />} />
            </span>
            <span onClick={(e) => handleClickOptions(e, 'WISHLIST')}><SelectOption icon={<FaHeart />} /></span>
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
            {`${formatPriceVN(productData?.price)}`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Product))