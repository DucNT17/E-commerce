import React, { useCallback, useEffect, useState } from 'react'
import {
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation
} from 'react-router-dom';
import { useForm } from "react-hook-form";
import {
    InputForm,
    Pagination,
    CustomizeVarriant
} from 'components'
import useDebounce from "hooks/useDebounce";
import UpdateProduct from "./UpdateProduct";
import { BiEdit, BiCustomize } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { apiGetProducts, apiDeleteProduct } from 'apis';
import moment from 'moment'
import { formatPriceVN, formatPriceUSD } from 'utils/helper'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import withBaseComponent from 'hocs/withBaseComponent';

const ManageProduct = ({ navigate, location }) => {
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        reset
    } = useForm();
    const [products, setProducts] = useState(null);
    const [counts, setCounts] = useState(0);
    const [update, setUpdate] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [customizeVarriant, setCustomizeVarriant] = useState(null);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const queryDebounce = useDebounce(watch("q"), 800);

    const fetchProducts = async (params) => {
        const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT });
        if (response.success) {
            setCounts(response.counts);
            setProducts(response.products);
        }
    }

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
        fetchProducts(searchParams);
    }, [params, update])


    const handleDeleteProduct = (pid) => {
        Swal.fire({
            icon: "warning",
            title: "Delete product",
            text: "Are you sure to remove this product",
            cancelButtonText: "Cancel",
            confirmButtonText: "Confirm",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteProduct(pid);
                if (response.success) toast.success(response.mes);
                else toast.error(response.mes);
                render();
            }
        });
    };

    return (
        <div className='w-full flex flex-col gap-4 relative z-50'>
            {editProduct && (
                <div className="absolute inset-0 h-full bg-gray-100 z-50">
                    <UpdateProduct
                        editProduct={editProduct}
                        render={render}
                        setEditProduct={setEditProduct}
                    />
                </div>
            )}
            {customizeVarriant && (
                <div className="absolute inset-0 h-full bg-gray-100 z-50 ">
                    <CustomizeVarriant
                        customizeVarriant={customizeVarriant}
                        render={render}
                        setCustomizeVarriant={setCustomizeVarriant}
                    />
                </div>
            )}
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
            </div>
            <div className='flex justify-end items-center px-4'>
                <form className='w-[45%]'>
                    <InputForm
                        id="q"
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder="Search products..."
                    />
                </form>
            </div>
            <div className='px-4 w-full'>
                <table className='table-auto w-full px-4 text-sm'>
                    <thead>
                        <tr className="border bg-gray-500 text-white">
                            <th className="text-center py-2 px-1">#</th>
                            <th className="text-center py-2 px-1">Thumb</th>
                            <th className="text-center py-2">Title</th>
                            <th className="text-center py-2">Brand</th>
                            <th className="text-center py-2">Category</th>
                            <th className="text-center py-2">Price</th>
                            <th className="text-center py-2">Quantity</th>
                            <th className="text-center py-2">Sold</th>
                            <th className="text-center py-2">Color</th>
                            <th className="text-center py-2">Total Ratings</th>
                            <th className="text-center py-2">Varriants</th>
                            <th className="text-center py-2">Updated At</th>
                            <th className="text-center py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((el, idx) => (
                            <tr className='border' key={el._id}>
                                <td className='text-center py-2 px-1'>
                                    {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                        process.env.REACT_APP_LIMIT +
                                        idx + 1}
                                </td>
                                <td className="text-center py-2 px-1">
                                    <img src={el.thumb} alt='thumb' className='w-12 h-12 object-cover' />
                                </td>
                                <td className="text-center py-2">{el.title}</td>
                                <td className="text-center py-2">{el.brand}</td>
                                <td className="text-center py-2">{el.category}</td>
                                <td className="text-center py-2">{formatPriceVN(el.price)}</td>
                                <td className="text-center py-2">{el.quantity}</td>
                                <td className="text-center py-2">{el.sold}</td>
                                <td className="text-center py-2">{el.color}</td>
                                <td className="text-center py-2">{el.totalRatings}</td>
                                <td className="text-center py-2">{el?.varriants?.length || 0}</td>
                                <td className="text-center py-2">{moment(el.updatedAt).format("DD/MM/YYYY")}</td>
                                <td className='text-center py-2'>
                                    <span
                                        className='text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1'
                                        onClick={() => setEditProduct(el)}
                                    >
                                        <BiEdit size={20} />
                                    </span >
                                    <span
                                        onClick={() => handleDeleteProduct(el._id)}
                                        className='text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1'
                                    >
                                        <RiDeleteBin6Line size={20} />
                                    </span>
                                    <span
                                        onClick={() => setCustomizeVarriant(el)}
                                        className='text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1'
                                    >
                                        <BiCustomize size={20} />
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

export default withBaseComponent(ManageProduct)