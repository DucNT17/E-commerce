import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {

    return (
        <div className='flex items-center'>
            <span onClick={() => handleChangeQuantity('minus')} className='p-2 border-r border-black cursor-pointer'>-</span>
            <input
                type='text'
                className='py-2 outline-none w-[50px] text-center text-md text-gray-700'
                value={quantity}
                onChange={(e) => handleQuantity(e.target.value)}
                onkeypress="return /[0-9]/i.test(event.key)"
            />
            <span onClick={() => handleChangeQuantity('plus')} className='p-2 border-l border-black cursor-pointer'>+</span>
        </div>
    )
}

export default memo(SelectQuantity)