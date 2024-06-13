import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo } from 'react'
import { formatPriceVN, renderStarFromNumber } from 'utils/helper'


const ProductCard = ({ price, totalRatings, title, image }) => {
    return (
        <div className='w-1/3 flex-auto px-[10px] mb-[20px]'>
            <div className='border flex w-full'>
                <img src={image} alt='product' className='w-[90px] object-contain p-4 cursor-pointer' />
                <div className='flex flex-col gap-1 mt-[15px] items-start w-full text-xs'>
                    <span className='line-clamp-1 capitalize text-sm cursor-pointer hover:text-main'>{title?.toLowerCase()}</span>
                    <span>
                        {`${formatPriceVN(price)}`}
                    </span>
                    <span className='flex h-4'>{renderStarFromNumber(totalRatings, 14)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>

                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(memo(ProductCard))