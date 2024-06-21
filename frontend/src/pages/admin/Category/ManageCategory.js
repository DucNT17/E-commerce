import { apiGetCategories } from 'apis';
import { InputForm } from 'components'
import withBaseComponent from 'hocs/withBaseComponent';
import useDebounce from 'hooks/useDebounce';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

const ManageCategory = () => {
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
        const response = await apiGetCategories({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        console.log(response);
        // if (response.success) {
        //     setCounts(response.counts);
        //     setCategory(response.category);
        // }
    };
    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchCategory(searchParams);
    }, [params])

    const queryDebounce = useDebounce(watch("q"), 800);

    return (
        <div className="w-full flex flex-col gap-4 relative">
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
                        placeholder="Tìm kiếm"
                    />
                </form>
            </div>
            <div className="px-4 w-full">
                <table className="table-auto w-full px-4 text-sm">
                    <thead>
                        <tr className="border bg-gray-500 text-white border-white">
                            <th className="text-center py-2 px-1">#</th>
                            <th className="text-center py-2">Category</th>
                            <th className="text-center py-2">Created At</th>
                            <th className="text-center py-2">Updated At</th>
                            <th className="text-center py-2">Thao tác</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default withBaseComponent(ManageCategory)