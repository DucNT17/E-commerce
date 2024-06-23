import { apiGetOrders, apiUpdateStatus } from 'apis';
import { ButtonV2, InputForm, Pagination } from 'components'
import withBaseComponent from 'hocs/withBaseComponent';
import useDebounce from 'hooks/useDebounce';
import OrderDetail from 'pages/member/OrderDetail';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { BiEdit } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { showModal } from 'store/app/appSlice';
import { statusColor, statusTexts } from 'utils/contants';
import { formatPriceVN, formatTime } from 'utils/helper';

const ManageOrder = ({ navigate, location, dispatch }) => {
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useForm();

    const [orders, setOrders] = useState(null);
    const [counts, setCounts] = useState(0);
    const [update, setUpdate] = useState(false);
    const [editOrder, setEditOrder] = useState();

    const fetchOrders = async () => {
        const response = await apiGetOrders({ ...params, limit: process.env.REACT_APP_LIMIT });
        if (response.success) {
            setOrders(response.orderList);
            setCounts(response.counts);
        }
    }

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const handleUpdate = async () => {
        const response = await apiUpdateStatus(editOrder._id, {
            status: watch("status"),
        });
        if (response.success) {
            toast.success(response.mes);
            render();
            setEditOrder(null);
        } else toast.error(response.mes);
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
        fetchOrders(searchParams);
    }, [params, update])

    const quickViewOrder = (data) => {
        dispatch(
            showModal({
                isShowModal: true,
                modalChildren: <OrderDetail data={data} />,
            })
        );
    };

    return (
        <div className="w-full flex flex-col gap-4 bg-gray-50 relative">
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b w-full bg-gray-100 flex items-center fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">Manage Orders</h1>
                {editOrder && (
                    <div className="flex gap-3 ml-2">
                        <ButtonV2 bgColor={`bg-emerald-500`} handleOnClick={handleUpdate}>
                            Update
                        </ButtonV2>
                        <ButtonV2
                            bgColor={`bg-red-600`}
                            handleOnClick={() => setEditOrder(null)}>
                            Cancel
                        </ButtonV2>
                    </div>
                )}
            </div>
            <div className="flex justify-end bg-gray-50 items-center px-4">
                <form className='w-[45%]'>
                    <InputForm
                        id="q"
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder="Search orders..."
                    />
                </form>
            </div>
            <div className="px-4 w-full">
                <table className="table-auto w-full px-4 text-sm">
                    <thead>
                        <tr className="border bg-gray-500 text-white">
                            <th className="text-center py-2">#</th>
                            <th className="text-center py-2">Customer</th>
                            <th className="text-center py-2">Total Price</th>
                            <th className="text-center py-2">Status</th>
                            <th className="text-center py-2">Order At</th>
                            <th className="text-center py-2">Updated At</th>
                            <th className="text-center py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((el, idx) => (
                            <tr className="border" key={el._id}>
                                <td className="text-center py-2">
                                    {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                        process.env.REACT_APP_LIMIT +
                                        idx +
                                        1}
                                </td>
                                <td className="text-center py-2 flex items-center justify-center gap-4">
                                    <div className="w-10 h-10">
                                        <img
                                            src={el.orderBy?.avatar}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p>{`${el.orderBy?.lastname} ${el.orderBy?.firstname}`}</p>
                                </td>
                                <td className="text-center py-2">
                                    {formatPriceVN(el.total * 24640)}
                                </td>
                                <td className="text-center py-2">
                                    {editOrder?._id === el._id ? (
                                        <select
                                            {...register("status")}
                                            className="form-select"
                                            disabled={watch("status") === 3 || watch("status") === 0}>
                                            {statusTexts.map((text, index) => (
                                                <option key={index} value={index}>
                                                    {text}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p
                                            className={`py-1 text-white border rounded-md ${statusColor[el.status]
                                                }`}>
                                            {statusTexts[el.status]}
                                        </p>
                                    )}
                                </td>
                                <td className="text-center py-2">
                                    <p>{formatTime(el.createdAt)}</p>
                                </td>
                                <td className="text-center py-2">
                                    <p>{formatTime(el.updatedAt)}</p>
                                </td>
                                <td className="text-center py-2">
                                    <span
                                        onClick={() => {
                                            setEditOrder(el);
                                            setValue("status", el.status);
                                        }}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                                        <BiEdit size={20} />
                                    </span>
                                    <span
                                        onClick={() => quickViewOrder(el)}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                                        <FaEye size={20} />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex px-4 justify-end my-8">
                <Pagination totalCount={counts} />
            </div>
        </div>
    )
}

export default withBaseComponent(ManageOrder)