import clsx from 'clsx'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo } from 'react'
import DOMPurify from 'dompurify';
import moment from 'moment';
import { IoIosTimer } from "react-icons/io";
import { FaEye } from "react-icons/fa";

const BlogCard = ({ dispatch, navigate, bid, data, className }) => {
    return (
        <div className={clsx('w-full text-base px-[10px]', className)}>
            <div className='w-full border p-[15px] flex flex-col items-center'>
                <div className='w-full'>
                    <img src={data?.thumb} alt='thumb' className='w-[380px] h-[254px] object-cover' />
                </div>
                <div className='flex flex-col gap-4 mt-4'>
                    <div className='flex justify-center text-base font-semibold text-center uppercase hover:text-main cursor-pointer'>
                        {data?.title}
                    </div>
                    <div className='flex gap-8 justify-center items-center text-xs font-light'>
                        <span className='flex justify-center items-center gap-1'>
                            <IoIosTimer />
                            <span>
                                {moment(data?.updatedAt).format('ll')}
                            </span>
                        </span>
                        <span className='flex items-center justify-center gap-1'>
                            <FaEye />
                            <span>
                                {`${data?.numberViews} viewed`}
                            </span>
                        </span>
                    </div>
                    {data?.description?.length === 1 && <div className='text-xs line-clamp-3 mb-8' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.description[0]) }}></div>}
                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(memo(BlogCard))