import { apiDeleteBrand, apiGetBrand } from 'apis';
import { InputForm } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import useDebounce from 'hooks/useDebounce';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { formatTimeV2 } from 'utils/helper';
import UpdateBrand from './UpdateBrand';

const ManageBrand = ({ location, navigate }) => {
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
    } = useForm();
    const [brand, setBrand] = useState(null);
    const [counts, setCounts] = useState(0);
    const [editBrand, setEditBrand] = useState(null);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const fetchBrand = async (params) => {
        const response = await apiGetBrand({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.success) {
            setCounts(response.counts);
            setBrand(response.brands);
        }
    };

    const queryDecounce = useDebounce(watch("q"), 800);
    useEffect(() => {
        if (queryDecounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDecounce }).toString(),
            });
        } else
            navigate({
                pathname: location.pathname,
            });
    }, [queryDecounce]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchBrand(searchParams);
    }, [params, update]);


    const handleDeleteBrand = (id) => {
        Swal.fire({
            icon: "question",
            title: "Delete Brand",
            text: "Are you sure you want to delete this brand?",
            cancelButtonText: "Cancel",
            confirmButtonText: "Delete",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteBrand(id);
                if (response.success) toast.success(response.mes);
                else toast.error(response.mes);
                render();
            }
        });
    };
    // console.log(brand);
    return (
        <div className="w-full flex flex-col gap-4 relative">
            {editBrand && (
                <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
                    <UpdateBrand
                        editBrand={editBrand}
                        render={render}
                        setEditBrand={setEditBrand}
                    />
                </div>
            )}
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">
                    Manage Brand
                </h1>
            </div>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%]">
                    <InputForm
                        id="q"
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder="Search..."
                    />
                </form>
            </div>
            <div className="px-4 w-full">
                <table className="table-auto w-full px-4">
                    <thead>
                        <tr className="border bg-gray-500 text-white">
                            <th className="text-center py-2 px-1">#</th>
                            <th className="text-center py-2">Brand Name</th>
                            <th className="text-center py-2">Logo</th>
                            <th className="text-center py-2">Created At</th>
                            <th className="text-center py-2">Updated At</th>
                            <th className="text-center py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brand?.map((el, idx) => (
                            <tr className="border" key={el._id}>
                                <td className="text-center py-2">
                                    {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                        process.env.REACT_APP_LIMIT +
                                        idx +
                                        1}
                                </td>
                                <td className="text-center py-2">{el.name}</td>
                                <td className="flex items-center justify-center py-2">
                                    <div className="w-10 flex items-center justify-center">
                                        <img
                                            src={el.thumb}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="text-center py-2">
                                    {formatTimeV2(el.updatedAt)}
                                </td>
                                <td className="text-center py-2">
                                    {formatTimeV2(el.updatedAt)}
                                </td>
                                <td className="text-center py-2">
                                    <span
                                        onClick={() => setEditBrand(el)}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                                        <BiEdit size={20} />
                                    </span>
                                    <span
                                        onClick={() => handleDeleteBrand(el._id)}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                                        <RiDeleteBin6Line size={20} />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default withBaseComponent(ManageBrand)