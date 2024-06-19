import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import payment from 'assets/payment.svg';
import { formatPriceVN } from 'utils/helper';
import withBaseComponent from 'hocs/withBaseComponent';
import { Congrat, PayPal } from "components";
// import { useForm } from 'react-hook-form';
import { getCurrent } from 'store/user/asyncActions';

const Checkout = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector(state => state.user)
    const [isSuccess, setIsSuccess] = useState(false);
    const [checkoutCompleted, setCheckoutCompleted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState("");

    // const {
    //     register,
    //     formState: { errors },
    //     watch,
    //     setValue
    // } = useForm();

    // const address = watch('address');

    // useEffect(() => {
    //     setValue('address', current?.address);
    // }, [current])

    const totalBeforeDiscount = currentCart.reduce((sum, el) => +el?.price * el.quantity + sum, 0);

    useEffect(() => {
        if (isSuccess) {
            dispatch(getCurrent());

        }
    }, [isSuccess, dispatch])
    console.log(+currentCart.reduce((sum, el) => +el?.price * el.quantity + sum, 0));
    return (
        <div className="p-8 w-full grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6">
            {isSuccess && <Congrat />}
            <div className="w-full flex justify-center items-center col-span-4">
                <img src={payment} alt="" className="h-[70%] object-contain" />
            </div>
            <div className="flex w-full flex-col items-center col-span-6 gap-6">
                <h2 className="text-3xl mb-6 font-bold">Checkout your order</h2>
                <div className='w-full flex flex-col gap-6'>
                    <div className='flex-1'>
                        <table className="table-auto w-full h-fit">
                            <thead>
                                <tr className="border bg-gray-200">
                                    <th className="p-2 text-left"></th>
                                    <th className="p-2 text-left">Product</th>
                                    <th className="text-center p-2">Quantity</th>
                                    <th className="text-right p-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCart?.map((el) => (
                                    <tr className="border" key={el?._id}>
                                        <td className="text-left p-2">
                                            <div className="w-20 h-20">
                                                <img
                                                    src={el?.thumbnail}
                                                    alt=""
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </td>
                                        <td className="text-left p-2">{el?.title}</td>
                                        <td className="text-center p-2">{el?.quantity}</td>
                                        <td className="text-right p-2">{formatPriceVN(el?.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex-1 flex flex-col justify-between gap-[45px]'>
                        <div className="flex flex-col gap-6">
                            <span className="flex items-center gap-8 text-sm">
                                <span className="font-medium">Total:</span>
                                <span className="text-main font-bold">
                                    {formatPriceVN(currentCart?.reduce((sum, el) => sum + +el?.price * el?.quantity, 0))}
                                </span>
                            </span>
                            <span className="flex items-center gap-8 text-sm">
                                <span className="font-medium">Address:</span>
                                <span className="text-main font-bold">{current?.address}</span>
                            </span>
                        </div>
                        {/* <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span>Mã khuyến mãi: </span>
                                <select
                                    onChange={(e) => setSelectedCoupon(e.target.value)}
                                    value={selectedCoupon}
                                    className="border rounded-md px-4 py-3 w-[30%]">
                                    <option value="">Chọn</option>
                                    {coupons?.map((value) => (
                                        <option key={value._id} value={value._id}>
                                            {value.name} (giảm {value.discount}%)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>Phương thức thanh toán: </span>
                                <select
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    value={paymentMethod}
                                    className="border rounded-md px-4 py-3 w-[30%]">
                                    <option value="">Chọn</option>
                                    <option value="OFFLINE">Thanh toán khi nhận hàng</option>
                                    <option value="ONLINE">Thanh toán Paypal</option>
                                </select>
                            </div>
                        </div> */}
                        <div className="w-full mx-auto">
                            <PayPal
                                payload={{
                                    products: currentCart,
                                    // coupons: selectedCoupon,
                                    address: current?.address,
                                    total: Math.round(+currentCart.reduce((sum, el) => +el?.price * el.quantity + sum, 0) / 23500)
                                }}
                                setIsSuccess={setIsSuccess}
                                amount={Math.round(+currentCart.reduce((sum, el) => +el?.price * el.quantity + sum, 0) / 23500)}
                            />
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default withBaseComponent(Checkout)
