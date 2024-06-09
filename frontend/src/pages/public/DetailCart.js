import { Breadcrumb, Button, OrderItem } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React from 'react'
import { useSelector } from 'react-redux'
import { formatPriceVN } from 'utils/helper';

const DetailCart = ({ location, dispatch }) => {
    const { currentCart } = useSelector(state => state.user);
    return (
        <div className='w-full'>
            <div className='h-[81px] bg-gray-100 flex justify-center     items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>Detail Cart</h3>
                    <Breadcrumb category={``} />
                </div>
            </div>
            <div className='flex flex-col w-main mx-auto border my-8'>
                <div className='w-main m-auto grid grid-cols-10 font-semibold py-3 bg-gray-300'>
                    <span className='col-span-6 w-full text-center'>Products</span>
                    <span className='col-span-1 w-full text-center'>Quantity</span>
                    <span className='col-span-3 w-full text-center'>Price</span>
                </div>
                {currentCart?.map(el => (
                    <OrderItem
                        key={el._id}
                        color={el.color}
                        title={el.title}
                        thumbnail={el.thumbnail}
                        pid={el.product?._id}
                        price={el.price}
                        defaultQuantity={el.quantity}
                    />
                ))}
            </div>
            <div className='w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3'>
                <span className='flex items-center gap-8'>
                    <span className='text-sm'>Subtotal:</span>
                    <span className='text-xl font-semibold text-main'>
                        {formatPriceVN(currentCart?.reduce((sum, el) => sum + +el?.price * el?.quantity, 0))}
                    </span>
                </span>
                <span className='text-sm italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                <Button>Checkout</Button>
            </div>

        </div>

    )
}

export default withBaseComponent(DetailCart)