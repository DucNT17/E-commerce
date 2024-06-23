import { apiCreateBrand } from 'apis';
import { ButtonV2, InputForm, Loading } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { showModal } from 'store/app/appSlice';
import { getBase64, validate } from 'utils/helper';
import path from 'utils/path';

const CreateBrand = ({ navigate, dispatch }) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();


    const [preview, setPreview] = useState({ thumb: null });
    const [invalidFields, setInvalidFields] = useState([]);

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
    };

    useEffect(() => {
        handlePreviewThumb(watch("thumb")[0]);
    }, [watch("thumb")]);

    const handleCreateBrand = async (data) => {
        const invalids = validate(data, setInvalidFields);
        if (invalids === 0) {
            const formData = new FormData();
            for (let i of Object.entries(data)) formData.append(i[0], i[1]);
            if (data.thumb) formData.append("thumb", data.thumb[0]);
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiCreateBrand(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success(response.mes);
                reset();
                navigate(`/${path.ADMIN}/${path.MANAGE_BRAND}`)
            } else toast.error(response.mes);
        }
    };

    return (
        <div className="w-full">
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
                <span>Add Brand Name</span>
            </h1>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateBrand)}>
                    <InputForm
                        label="Brand name"
                        register={register}
                        errors={errors}
                        id="name"
                        validate={{
                            required: "Need fill this field",
                        }}
                        fullWidth
                        placeholder="Enter brand name"
                    />
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="thumb">
                            Thumbnail
                        </label>
                        <input
                            type="file"
                            id="thumb"
                            {...register("thumb", { required: "Need fill" })}
                        />
                        {errors["thumb"] && (
                            <small className="text-xs text-red-500">
                                {errors["thumb"]?.message}
                            </small>
                        )}
                    </div>
                    {preview.thumb && (
                        <div className="my-4">
                            <img
                                src={preview.thumb}
                                alt="thumbnail"
                                className="w-[200px] object-contain"
                            />
                        </div>
                    )}
                    <div className="my-6">
                        <ButtonV2 type="submit">Create</ButtonV2>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default withBaseComponent(CreateBrand)