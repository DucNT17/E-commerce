import React from "react";
import { formatPriceVN, formatTime } from "utils/helper";

const OrderDetail = ({ data }) => {
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            class="w-[60%] max-h-[675px] bg-white rounded-lg shadow-lg px-8 py-10 mx-auto">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center">
                    {/* <img class="h-3 w-full mr-2" src={Logo} alt="Logo" /> */}
                    <div class="text-gray-700 font-semibold uppercase text-xl">Digital Store</div>
                </div>
                <div class="text-gray-700">
                    <div class="font-bold text-xl mb-2">Order</div>
                    <div class="text-sm">Order at: {formatTime(data?.createdAt)}</div>
                    <div class="text-sm">Order code: {data?._id}</div>
                </div>
            </div>
            <div class="border-b-2 border-gray-300 pb-8 mb-8">
                <h2 class="text-2xl font-bold mb-4">Customer:</h2>
                <div class="text-gray-700 mb-2">{`Full Name: ${data?.orderBy?.lastname} ${data?.orderBy?.firstname}`}</div>
                <div class="text-gray-700 mb-2">Email: {data?.orderBy?.email}</div>
                <div class="text-gray-700 mb-2">
                    Phone number: {data?.orderBy?.mobile}
                </div>
                <div class="text-gray-700 mb-2">Address: {data?.orderBy?.address}</div>
            </div>
            <table class="w-full text-left mb-8 mr-2">
                <thead>
                    <tr>
                        <th class="text-gray-700 font-bold uppercase py-2">Product</th>
                        <th class="text-gray-700 text-right font-bold uppercase py-2">Quantity</th>
                        <th class="text-gray-700 text-right font-bold uppercase py-2">Price</th>
                        <th class="text-gray-700 text-right font-bold uppercase py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.products?.map((value) => (
                        <tr key={value?._id}>
                            <td class="py-4 text-gray-700">{value.title}</td>
                            <td class="py-4 text-right text-gray-700">{value.quantity}</td>
                            <td class="py-4 text-right text-gray-700">{formatPriceVN(value.price)}</td>
                            <td class="py-4 text-right text-gray-700">
                                {formatPriceVN(value.quantity * value.price)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {data?.coupon && (
                <div class="text-right mb-8">
                    <div class="text-gray-700 mr-2">Promotion:</div>
                    <div class="text-gray-700">
                        {data?.coupon?.name} (-{data?.coupon?.discount}%)
                    </div>
                </div>
            )}
            <div class="flex items-center justify-end mb-8">
                <div class="text-gray-700 mr-2">Total:</div>
                <div class="text-gray-700 font-bold text-xl">
                    {formatPriceVN(data?.total * 24640)}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
