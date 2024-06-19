import { apiGetUserOrders } from 'apis';
import React, { useCallback, useEffect, useState } from 'react'
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { CustomSelect, InputForm, Pagination } from 'components';
import useDebounce from 'hooks/useDebounce';
import withBaseComponent from 'hocs/withBaseComponent';
import { formatPriceVN, formatTime, formatTimeV2 } from 'utils/helper';
import { statusTexts, statusColor, statusOrdersUser } from 'utils/contants'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiDetail } from "react-icons/bi";
import OrderDetail from './OrderDetail';
import { showModal } from 'store/app/appSlice';


const History = ({ navigate, location, dispatch }) => {
    const [orders, setOrders] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
    const [update, setUpdate] = useState(false);

    const {
        register,
        formState: { errors },
        watch,
    } = useForm();
    const status = watch("status");
    console.log(status);
    const fetchPOrders = async (params) => {
        const response = await apiGetUserOrders({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.success) {
            setOrders(response.orderList);
            setCounts(response.counts);
        }
    };

    const render = useCallback(() => {
        setUpdate(!update);
    });

    useEffect(() => {
        const pr = Object.fromEntries([...params]);
        fetchPOrders(pr);
    }, [params, update]);

    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString(),
        });
    };

    const quickViewOrder = (data) => {
        dispatch(
            showModal({
                isShowModal: true,
                modalChildren: <OrderDetail data={data} />,
            })
        );
    };

    // useEffect(() => {
    //     if (queryDebounce) {
    //         navigate({
    //             pathname: location.pathname,
    //             search: createSearchParams({ q: queryDebounce }).toString(),
    //         });
    //     } else
    //         navigate({
    //             pathname: location.pathname,
    //         });
    // }, [queryDebounce]);

    return (
        <div className="w-full relative px-4">
            <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
                Order History
            </header>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%] grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <InputForm
                            id="q"
                            register={register}
                            errors={errors}
                            fullWidth
                            placeholder="Tìm kiếm"
                        />
                    </div>
                    <div className="col-span-1 flex items-center">
                        <CustomSelect
                            options={statusOrdersUser}
                            value={status}
                            onChange={(val) => handleSearchStatus(val)}
                            wrapClassname="w-full"
                        />
                    </div>
                </form>
            </div>
            <table className="table-auto w-full">
                <thead>
                    <tr className="border bg-sky-800 text-white border-white">
                        <th className="text-center py-2">#</th>
                        <th className="text-center py-2">Product</th>
                        <th className="text-center py-2">Total Price</th>
                        <th className="text-center py-2">Status</th>
                        <th className="text-center py-2">Created At</th>
                        <th className="text-center py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((el, idx) => (
                        <tr className="border-b" key={el._id}>
                            <td className="text-center py-2">
                                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                    process.env.REACT_APP_LIMIT +
                                    idx +
                                    1}
                            </td>
                            <td className="text-center py-2">
                                {/* <div className="flex items-center justify-center gap-2">
                                    {el.products?.map((item) => (
                                        <div key={item._id} className="w-15 h-16">
                                            <img
                                                src={item.thumbnail}
                                                alt=""
                                                className="w-full h-full object-contain rounded-md bg-none"
                                            />
                                        </div>
                                    ))}
                                </div> */}
                                <div className='flex flex-col'>
                                    {el.products?.map((item) => (
                                        <span className="flex items-center gap-2" key={item._id}>
                                            <img
                                                src={item.thumbnail}
                                                alt=""
                                                className="w-8 h-8 object-cover rounded-md bg-none"
                                            />
                                            <span className='flex flex-col'>
                                                <span className='text-sm font-semibold'>{item.title}</span>
                                                <span className='flex items-center text-xs gap-2'>
                                                    <span >Quantity:</span>
                                                    <span className=''>{item.quantity}</span>
                                                </span>
                                            </span>
                                        </span>
                                    ))}
                                </div>

                            </td>
                            <td className="text-center py-2">
                                <p className="font-semibold ">
                                    {formatPriceVN(el.total * 24640)}
                                </p>
                            </td>
                            <td className="text-center py-2">
                                <p className={`py-1 text-white border rounded-md ${statusColor[el.status]}`}>
                                    {statusTexts[el.status]}
                                </p>
                            </td>
                            <td className="text-center py-2">{formatTimeV2(el.createdAt)}</td>
                            <td className="text-center py-2">
                                <span title='cancel order' className="text-blue-500 hover:text-main inline-block hover:underline cursor-pointer px-1">
                                    <RiDeleteBin6Line size={22} />
                                </span>
                                <span onClick={() => quickViewOrder(el)}
                                    title='detail order' className='text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1'>
                                    <BiDetail size={22} />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w-full flex justify-end my-8">
                <Pagination totalCount={counts} />
            </div>
        </div>

    )
}

export default withBaseComponent(History)