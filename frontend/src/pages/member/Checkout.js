import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import payment from 'assets/payment.svg';
import { formatPriceVN } from 'utils/helper';
import withBaseComponent from 'hocs/withBaseComponent';
import { Congrat, PayPal } from "components";
import { getCurrent } from 'store/user/asyncActions';
import { apiCreateOrder, apiGetCoupons } from 'apis';
import Swal from 'sweetalert2';
import path from 'utils/path';
import { toast } from 'react-toastify';

const Checkout = ({ dispatch, navigate }) => {
    const { currentCart, current } = useSelector(state => state.user)
    const [isSuccess, setIsSuccess] = useState(false);
    const [checkoutCompleted, setCheckoutCompleted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState("");

    useEffect(() => {
        const fetchCoupons = async (params) => {
            const response = await apiGetCoupons({
                ...params,
                limit: process.env.REACT_APP_LIMIT,
                status: 1,
            });
            if (response.success) {
                setCoupons(response.coupons);
            }
        };
        fetchCoupons();
    }, []);

    useEffect(() => {
        if (currentCart.length <= 0 && !checkoutCompleted) {
            Swal.fire({
                icon: "warning",
                title: "Your cart is empty",
                text: "Please add product to your cart before checkout",
            }).then(() => {
                navigate("/");
            });
        }
    }, [currentCart, checkoutCompleted]);

    const totalBeforeDiscount = currentCart.reduce(
        (sum, el) => +el?.price * el.quantity + sum,
        0
    );

    const selectedCouponData = coupons.find(
        (coupon) => coupon._id === selectedCoupon
    );

    const discountPercentage = selectedCouponData
        ? selectedCouponData.discount
        : 0;

    const discountValue = totalBeforeDiscount * (discountPercentage / 100);
    const totalAfterDiscount = totalBeforeDiscount - discountValue;

    useEffect(() => {
        if (isSuccess) {
            dispatch(getCurrent());
            setCheckoutCompleted(true);
        }
    }, [isSuccess])

    useEffect(() => {
        if (paymentMethod === "OFFLINE") {
            const total = totalAfterDiscount;
            Swal.fire({
                icon: "info",
                title: "Order",
                text: `Please pay in cash the amount ${formatPriceVN(total)} upon receipt`,
                showConfirmButton: true,
                confirmButtonText: "Confirm",
                showCancelButton: true,
                cancelButtonText: "Go back",
            }).then((result) => {
                if (result.isConfirmed) {
                    handleSaveOrder();
                } else {
                    setPaymentMethod("");
                }
            });
        }
    }, [paymentMethod]);

    const handleSaveOrder = async () => {
        const payload = {
            products: currentCart,
            address: current?.address,
            coupon: selectedCoupon,
            total: totalAfterDiscount / 23500,
        };
        const response = await apiCreateOrder({ ...payload, status: 1 });
        if (response.success) {
            setIsSuccess(true);
            setTimeout(() => {
                Swal.fire("Congratulations", "Order successful.", "success").then(() => {
                    navigate(`/${path.MEMBER}/${path.HISTORY}`);
                });
            }, 1500);
        } else toast.error(response.mes);
    };

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
                                    {formatPriceVN(totalAfterDiscount)}
                                </span>
                            </span>
                            <span className="flex items-center gap-8 text-sm">
                                <span className="font-medium">Address:</span>
                                <span className="text-main font-bold">{current?.address}</span>
                            </span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span>Coupon: </span>
                                <select
                                    onChange={(e) => setSelectedCoupon(e.target.value)}
                                    value={selectedCoupon}
                                    className="border rounded-md px-4 py-3 w-[31%]">
                                    <option value="">Select Coupon</option>
                                    {coupons?.map((value) => (
                                        <option key={value._id} value={value._id}>
                                            {value.name} (discount {value.discount}%)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>Payment Method: </span>
                                <select
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    value={paymentMethod}
                                    className="border rounded-md px-4 py-3 w-[30%]">
                                    <option value="">Select payment</option>
                                    <option value="OFFLINE">Cash on Delivery</option>
                                    <option value="ONLINE">Paypal payment</option>
                                </select>
                            </div>
                        </div>
                        {paymentMethod === "ONLINE" && <div className="w-full mx-auto">
                            <PayPal
                                payload={{
                                    products: currentCart,
                                    coupon: selectedCoupon,
                                    address: current?.address,
                                    total: totalAfterDiscount / 23500
                                }}
                                setIsSuccess={setIsSuccess}
                                amount={Math.round(totalAfterDiscount / 23500)}
                            />
                        </div>}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default withBaseComponent(Checkout)
