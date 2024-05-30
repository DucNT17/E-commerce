import React, { memo, useRef, useEffect } from 'react'
import logo from '../assets/logo.png'
import { voteOptions } from '../utils/contants';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Button } from './'


const VoteOption = ({ nameProduct }) => {
    const modalRef = useRef();
    useEffect(() => {
        modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }, [])
    return (
        <div
            ref={modalRef}
            className='bg-white w-[700px] flex items-center justify-center flex-col gap-4 p-4'
            onClick={e => e.stopPropagation()}
        >
            <img src={logo} alt='logo' className='w-[300px] object-contain my-8' />
            <h2 className='text-center text-md text-lg'>{`Voting product ${nameProduct}`}</h2>
            <textarea
                placeholder='Type something here'
                className='form-textarea w-full placeholder:italic placeholder:text-sm placeholder:text-gray-500'
            >
            </textarea>
            <div className='w-full flex flex-col gap-4'>
                <p>How do you feel this product</p>
                <div className='flex items-center justify-center gap-4'>
                    {voteOptions.map(el => (
                        <div className='w-[100px] h-[100px] rounded-md flex flex-col gap-2 justify-center items-center bg-gray-200 hover:bg-gray-300 cursor-pointer p-4' key={el.id}>
                            <AiFillStar color='gray' />
                            <span>{el.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button fw >Submit</Button>
        </div>
    )
}

export default memo(VoteOption)