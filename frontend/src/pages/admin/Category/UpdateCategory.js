import { apiUpdateCategory } from 'apis';
import { ButtonV2, InputForm } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getBase64, validate } from 'utils/helper';

const UpdateCategory = ({ editCategory, render, setEditCategory, dispatch }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const [preview, setPreview] = useState({ image: null });
    const [invalidFields, setInvalidFields] = useState([]);


    useEffect(() => {
        reset({
            title: editCategory?.title || "",
        });
        setPreview({
            image: editCategory?.image || "",
        });
    }, [editCategory]);

    const handlePreviewImage = async (file) => {
        const base64Image = await getBase64(file);
        setPreview((prev) => ({ ...prev, image: base64Image }));
    };
    useEffect(() => {
        if (watch("image") instanceof FileList && watch("image").length > 0)
            handlePreviewImage(watch("image")[0]);
    }, [watch("image")])

    const handleUpdateCategory = async (data) => {
        const invalids = validate(data, setInvalidFields);
        if (invalids === 0) {
            const payload = { ...data };
            payload.image = data?.image?.length === 0 ? preview.image : data.image[0];
            const formData = new FormData();
            for (let i of Object.entries(payload)) formData.append(i[0], i[1]);
            // dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiUpdateCategory(editCategory._id, formData);
            // dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success(response.mes);
                render();
                setEditCategory(null);
            } else toast.error(response.mes);
        }
    }

    return (
        <div className="w-full flex flex-col gap-4 relative">
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[280px] fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit Category
                </h1>
                <span
                    className="bg-red-500 rounded-md p-2 font-medium text-white hover:underline cursor-pointer"
                    onClick={() => setEditCategory(null)}>
                    Cancel
                </span>
            </div>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateCategory)}>
                    <InputForm
                        label="Category Name"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: "Need fill this field",
                        }}
                        fullWidth
                        placeholder="Enter category name"
                    />
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="image">
                            Image
                        </label>
                        <input type="file" id="image" {...register("image")} />
                        {errors["image"] && (
                            <small className="text-xs text-red-500">
                                {errors["image"]?.message}
                            </small>
                        )}
                    </div>
                    {preview.image && (
                        <div className="my-4">
                            <img
                                src={preview.image}
                                alt="img"
                                className="w-[200px] object-contain"
                            />
                        </div>
                    )}
                    <div className='my-6'>
                        <ButtonV2 type='submit'>
                            Update
                        </ButtonV2>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default withBaseComponent(UpdateCategory)