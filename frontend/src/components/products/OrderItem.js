import { SelectQuantity } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState } from 'react';
import { updateCart } from 'store/user/userSlice';
import { formatPriceVN } from 'utils/helper';

const OrderItem = ({ dispatch, color, defaultQuantity, price, pid, thumbnail, title}) => {
    const [quantity, setQuantity] = useState(() => defaultQuantity);

    const handleQuantity = (number) => {
        if (+number > 1) {
            setQuantity(number);
        }
    }

    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return;
        if (flag === 'minus') setQuantity(prev => +prev - 1);
        if (flag === 'plus') setQuantity(prev => +prev + 1);
    }

    useEffect(() => {
        dispatch(updateCart({ pid, quantity, color }));
    }, [quantity])

    return (
        <div className='w-main border-b m-auto grid grid-cols-10 py-3'>
            <span className='col-span-6 w-full text-center'>
                <div className='flex gap-2 p-4'>
                    <img src={thumbnail} alt='thumb' className='w-28 h-28 object-cover' />
                    <div className='flex flex-col gap-1 items-start'>
                        <span className='font-semibold text-sm'>{title}</span>
                        <span className='text-xs'>{color}</span>
                    </div>
                </div>
            </span>
            <span className='col-span-1 w-full text-center'>
                <div className='flex items-center h-full'>
                    <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                    />
                </div>
            </span>
            <span className='col-span-3 w-full text-center h-full flex items-center justify-center'>
                <div className='text-base'>
                    {formatPriceVN(price * quantity)}
                </div>
            </span>
        </div>
    )
}

export default withBaseComponent(OrderItem)