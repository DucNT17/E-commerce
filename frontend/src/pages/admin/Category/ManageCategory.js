import { apiDeleteCategory, apiGetCategories, apiGetCategory } from 'apis';
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
import { formatTimeV2 } from 'utils/helper';
import UpdateCategory from './UpdateCategory';

const ManageCategory = ({ navigate, location }) => {
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
    } = useForm();

    const [category, setCategory] = useState(null);
    const [counts, setCounts] = useState(0);
    const [editCategory, setEditCategory] = useState(null);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const fetchCategory = async (params) => {
        const response = await apiGetCategory({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.success) {
            setCounts(response.counts);
            setCategory(response.category);
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
        fetchCategory(searchParams);
    }, [params, update]);

    const handleDeleteCategory = (id) => {
        Swal.fire({
            icon: "question",
            title: "Delete Category",
            text: "Are you sure you want to delete this category?",
            cancelButtonText: "Cancel",
            confirmButtonText: "Delete",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteCategory(id);
                if (response.success) toast.success(response.mes);
                else toast.error(response.mes);
                render();
            }
        });
    };
    console.log(category);
    return (
        <div className="w-full flex flex-col gap-4 relative">
            {editCategory && (
                <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
                    <UpdateCategory
                        editCategory={editCategory}
                        render={render}
                        setEditCategory={setEditCategory}
                    />
                </div>
            )}
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">Manage Category</h1>
            </div>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%]">
                    <InputForm
                        id="q"
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder="Search Category"
                    />
                </form>
            </div>
            <div className="px-4 w-full">
                <table className="table-auto w-full px-4 text-sm">
                    <thead>
                        <tr className="border bg-gray-500 text-white border-white">
                            <th className="text-center py-2 px-1">#</th>
                            <th className="text-center py-2">Image</th>
                            <th className="text-center py-2">Category</th>
                            <th className="text-center py-2">Created At</th>
                            <th className="text-center py-2">Updated At</th>
                            <th className="text-center py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category?.map((el, idx) => (
                            <tr className="border border-gray-500" key={el._id}>
                                <td className="text-center py-2">
                                    {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                        process.env.REACT_APP_LIMIT +
                                        idx +
                                        1}
                                </td>
                                <td className="text-center py-2">
                                    <div className='flex items-center justify-center'>
                                        <img src={el?.image} alt='image' className='w-10 h-10 object-cover' />
                                    </div>
                                </td>
                                <td className="text-center py-2">
                                    {el.title}
                                </td>
                                <td className="text-center py-2">
                                    {formatTimeV2(el.updatedAt)}
                                </td>
                                <td className="text-center py-2">
                                    {formatTimeV2(el.updatedAt)}
                                </td>
                                <td className="text-center py-2">
                                    <span
                                        onClick={() => setEditCategory(el)}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                                        <BiEdit size={20} />
                                    </span>
                                    <span
                                        onClick={() => handleDeleteCategory(el._id)}
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

export default withBaseComponent(ManageCategory)