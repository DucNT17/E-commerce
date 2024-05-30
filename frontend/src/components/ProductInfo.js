import React, { memo, useState, useCallback } from 'react'
import { productInfoTabs } from '../utils/contants'
import { Votebar, Button, VoteOption } from './'
import { renderStarFromNumber } from '../utils/helper'
import { apiRatings } from '../apis'
import { useDispatch } from 'react-redux'
import { showModal } from '../store/app/appSlice'

const ProductInfo = ({ totalRatings, totalCount, nameProduct }) => {
    const dispatch = useDispatch();
    const [activedTab, setActivedTab] = useState(1);
    const toggleVote = () => {

    }
    return (
        <div>
            <div className='flex items-center gap-1 relative bottom-[-1px]'>
                {productInfoTabs?.map(el => (
                    <span
                        key={el.id} className={`p-2 px-4 cursor-pointer ${activedTab === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}
                    </span>
                ))}
                <div
                    className={`p-2 px-4 cursor-pointer ${activedTab === 5 ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                    onClick={() => setActivedTab(5)}
                >
                    CUSTOMERS REViEW
                </div>
            </div>
            <div className='w-full border p-4'>
                {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
                {activedTab === 5 && <div className='flex flex-col'>
                    <div className='flex p-4'>
                        <div className='flex-4 border flex items-center border-red-500 flex-col justify-center gap-2'>
                            <span className='font-semibold text-3xl'>{`${totalRatings}/5`}</span>
                            <div className='flex items-center'>
                                {renderStarFromNumber(totalRatings)?.map((el, index) => (
                                    <span key={index}>
                                        {el}
                                    </span>
                                ))}
                            </div>
                            <span className='text-sm'>{`${totalCount} reviews`}</span>
                        </div>
                        <div className='flex-6 border flex flex-col p-4 gap-2'>
                            {Array.from(Array(5).keys()).reverse().map(el => (
                                <Votebar
                                    key={el}
                                    number={el + 1}
                                    ratingCount={2}
                                    ratingTotal={5}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='flex items-center flex-col p-2 justify-center text-sm'>
                        <span>Rating this product?</span>
                        <Button handleOnClick={() => dispatch(showModal({ isShowModal: true, modalChildren: <VoteOption nameProduct={nameProduct}/>}))}>
                            Vote Now!
                        </Button>
                    </div>
                </div>}
            </div>
        </div>


    )
}

export default memo(ProductInfo)