import React, { memo, useState, useCallback } from 'react'
import { productInfoTabs } from '../utils/contants'
import { Votebar, Button, VoteOption, Comment } from './'
import { renderStarFromNumber } from '../utils/helper'
import { apiRatings } from '../apis'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../store/app/appSlice'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import path from '../utils/path'

const ProductInfo = ({ totalRatings, ratings, nameProduct, pid, rerender }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activedTab, setActivedTab] = useState(1);
    const { isLoggedIn } = useSelector(state => state.user);

    const handleSubmitVoteOption = async ({ comment, score }) => {
        if (!comment || !score || !pid) {
            toast.info('Please vote when click submit');
            return;
        }
        await apiRatings({ star: score, comment, pid });
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        toast.success('Rating successfully');
        rerender();
    }
    const handleVoteNow = () => {
        if (!isLoggedIn) {
            Swal.fire({
                text: "Login to vote",
                cancelButtonText: 'Cancel',
                confirmButtonText: "Go Login",
                title: 'Oops!',
                showCancelButton: true,
            }).then((rs) => {
                if (rs.isConfirmed) {
                    navigate(`/${path.LOGIN}`);
                }
            })
        } else {
            dispatch(showModal({
                isShowModal: true,
                modalChildren: <VoteOption nameProduct={nameProduct} handleSubmitVoteOption={handleSubmitVoteOption} />
            }))
        }

    }
    return (
        <div className='flex flex-col'>
            <div className='flex items-center gap-1 relative bottom-[-1px]'>
                {productInfoTabs?.map(el => (
                    <span
                        key={el.id} className={`p-2 px-4 cursor-pointer ${activedTab === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}
                    </span>
                ))}

            </div>

            <div className='w-full border p-4'>
                {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
            </div>

            <div className='flex flex-col p-4 border my-4'>
                <span className='flex items-center justify-center text-xl font-semibold pb-4'>
                    CUSTOMERS REVIEW
                </span>
                <div className='flex'>
                    <div className='flex-4 border flex items-center border-red-500 flex-col justify-center gap-2'>
                        <span className='font-semibold text-3xl'>{`${totalRatings}/5`}</span>
                        <div className='flex items-center'>
                            {renderStarFromNumber(totalRatings)?.map((el, index) => (
                                <span key={index}>
                                    {el}
                                </span>
                            ))}
                        </div>
                        <span className='text-sm'>{`${ratings?.length} reviews`}</span>
                    </div>
                    <div className='flex-6 border flex flex-col p-4 gap-2'>
                        {Array.from(Array(5).keys()).reverse().map(el => (
                            <Votebar
                                key={el}
                                number={el + 1}
                                ratingCount={ratings?.filter(item => item.star === el + 1)?.length}
                                ratingTotal={ratings?.length}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex items-center flex-col p-2 justify-center text-sm'>
                    <span>Rating this product?</span>
                    <Button handleOnClick={handleVoteNow}>
                        Vote Now!
                    </Button>
                </div>
                <div className='flex flex-col gap-4'>
                    {ratings?.map(el => (
                        <Comment
                            key={el._id}
                            star={el.star}
                            updatedAt={el.updatedAt}
                            comment={el.comment}
                        />
                    ))}
                </div>
            </div>
        </div>


    )
}

export default memo(ProductInfo)