import Button from 'components/button/Button';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo } from 'react'
import { IoMdClose } from "react-icons/io";
import { useSelector } from 'react-redux';
import { showCart } from 'store/app/appSlice';
import { formatPriceVN } from 'utils/helper';
import { FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { getCurrent } from 'store/user/asyncActions';
import { apiRemoveCart } from 'apis';
import path from 'utils/path';


const Cart = ({ dispatch, navigate }) => {
    const { currentCart } = useSelector(state => state.user);
    const removeFromCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color);
        if (response.success) {
            // toast.success(response.mes);
            dispatch(getCurrent())
        } else {
            toast.error(response.mes)
        }
    }
    const checkOut = () => {
        navigate(`/${path.DETAL_CART}`);
        dispatch(showCart());
    }
    console.log(currentCart);
    return (
        <div onClick={e => e.stopPropagation()} className='w-[400px] h-screen bg-black grid grid-rows-10 text-white p-6'>
            <header className='border-b border-gray-500 flex justify-between items-center font-bold text-2xl row-span-1 h-full'>
                <span className='uppercase'>
                    Your cart
                </span>
                <span onClick={() => dispatch(showCart())} className='cursor-pointer p-2'>
                    <IoMdClose size={24} />
                </span>
            </header>
            <div className='row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3 no-scrollbar'>
                {!currentCart && <span className='text-xs italic'>Your cart is empty</span>}
                {currentCart && currentCart?.map(el => (
                    <div key={el._id} className='flex justify-between  items-center'>
                        <div className='flex gap-2'>
                            <img src={el?.thumbnail} alt='thumb' className='w-16 h-16 object-cover' />
                            <div className='flex flex-col gap-1'>
                                <span className='font-semibold text-sm'>{el?.title}</span>
                                <span className='text-xs'>{el.color}</span>
                                <span className='text-xs'>{`Quantity: ${el.quantity}`}</span>
                                <span className='text-sm'>{formatPriceVN(el?.price)}</span>
                            </div>
                        </div>
                        <span
                            onClick={() => removeFromCart(el.product?._id, el.color)}
                            title='Remove Product'
                            className='flex cursor-pointer hover:text-main w-8 h-8 justify-center items-center hover:bg-gray-500 rounded-full'
                        >
                            <FaTrash size={16} />
                        </span>
                    </div>
                ))}
            </div>
            <div className='row-span-2 h-full flex flex-col'>
                <div className='flex items-center mt-4 justify-between pt-2 border-t border-gray-500'>
                    <span>
                        Subtotal:
                    </span>
                    <span>{formatPriceVN(currentCart?.reduce((sum, el) => sum + Number(el.price) * el.quantity, 0))}</span>
                </div>
                <span className='text-center text-gray-300 italic text-sm flex justify-center my-2'>Shipping, taxes, and discounts calculated at checkout.</span>

                <Button
                    handleOnClick={() => checkOut()}
                    // eslint-disable-next-line
                    style="rounded-none w-full bg-main px-4 py-2 uppercase"
                >
                    Shopping Cart
                </Button>
            </div>
        </div>
    )
}

export default withBaseComponent(memo(Cart))