import { apiDeleteCoupon, apiGetCoupons } from 'apis';
import { InputForm, Pagination } from 'components'
import withBaseComponent from 'hocs/withBaseComponent';
import useDebounce from 'hooks/useDebounce';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getStatusClass } from 'utils/contants';
import { formatTimeV2 } from 'utils/helper';
import UpdateCoupon from './UpdateCoupon';


const ManageCoupon = ({ navigate, location }) => {
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
    } = useForm();
    const [coupons, setCoupons] = useState(null);
    const [editCoupon, setEditCoupon] = useState(null);
    const [counts, setCounts] = useState(0);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const fetchCoupons = async (params) => {
        const response = await apiGetCoupons({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.success) {
            setCounts(response.counts);
            setCoupons(response.coupons);
        }
    };
    const queryDebounce = useDebounce(watch("q"), 800);

    useEffect(() => {
        if (queryDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDebounce }).toString(),
            });
        } else
            navigate({
                pathname: location.pathname,
            });
    }, [queryDebounce]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchCoupons(searchParams);
    }, [params, update])    

    const handleDeleteCoupons = (id) => {
        Swal.fire({
            icon: "question",
            title: "Delete Coupon",
            text: "Are you sure you want to delete this promotion?",
            cancelButtonText: "Cancel",
            confirmButtonText: "Delete",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteCoupon(id);
                if (response.success) toast.success(response.coupons);
                else toast.error(response.coupons);
                render();
            }
        });
    };

    return (
        <div className="w-full flex flex-col gap-4 relative">
            {editCoupon && (
                <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
                    <UpdateCoupon
                        editCoupon={editCoupon}
                        render={render}
                        setEditCoupon={setEditCoupon}
                    />
                </div>
            )}
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">
                    Manage Coupon
                </h1>
            </div>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%]">
                    <InputForm
                        id='q'
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder="Search for Coupon"
                    />
                </form>
            </div>
            <div className="px-4 w-full">
                <table className="table-auto w-full px-4">
                    <thead>
                        <tr className="border bg-gray-500 text-white border-white">
                            <th className="text-center py-2 px-1">#</th>
                            <th className="text-center py-2">Coupon</th>
                            <th className="text-center py-2">Discount</th>
                            <th className="text-center py-2">Quantity</th>
                            <th className="text-center py-2">Usage</th>
                            <th className="text-center py-2">Start Date</th>
                            <th className="text-center py-2">End Date</th>
                            <th className="text-center py-2">Status</th>
                            <th className="text-center py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons?.map((el, idx) => (
                            <tr className="border border-gray-500" key={el._id}>
                                <td className="text-center py-2">
                                    {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                        process.env.REACT_APP_LIMIT +
                                        idx +
                                        1}
                                </td>
                                <td className="text-center py-2">{el.name}</td>
                                <td className="text-center py-2">{`${el.discount}%`}</td>
                                <td className="text-center py-2">{el.quantity}</td>
                                <td className="text-center py-2">{el.usageCount}</td>
                                <td className="text-center py-2">
                                    {formatTimeV2(el.startDate)}
                                </td>
                                <td className="text-center py-2">
                                    {formatTimeV2(el.endDate)}
                                </td>
                                <td
                                    className={`text-center ${getStatusClass(el.status)}`}>
                                    {`${el.status === 0
                                        ? "Hiddens"
                                        : el.status === 1
                                            ? "Active"
                                            : "Expired"
                                        }`}
                                </td>
                                <td className="text-center py-2">
                                    <span
                                        onClick={() => setEditCoupon(el)}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                                        <BiEdit size={20} />
                                    </span>
                                    <span
                                        onClick={() => handleDeleteCoupons(el._id)}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                                        <RiDeleteBin6Line size={20} />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex justify-end my-8 px-4">
                <Pagination totalCount={counts} />
            </div>
        </div>
    )
}

export default withBaseComponent(ManageCoupon)