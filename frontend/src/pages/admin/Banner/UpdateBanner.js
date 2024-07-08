import { apiUpdateBanner } from 'apis';
import { ButtonV2, InputForm } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getBase64, validate } from 'utils/helper';

const UpdateBanner = ({ editBanner, render, setEditBanner, dispatch }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const [preview, setPreview] = useState({ thumb: null });
    const [invalidFields, setInvalidFields] = useState([]);

    useEffect(() => {
        reset({
            title: editBanner?.title || "",
        });
        setPreview({
            thumb: editBanner?.thumb || "",
        });
    }, [editBanner]);

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
    };

    useEffect(() => {
        if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
            handlePreviewThumb(watch("thumb")[0]);
    }, [watch("thumb")]);

    const handleUpdateBanner = async (data) => {
        const invalids = validate(data, setInvalidFields);
        if (invalids === 0) {
            const payload = { ...data };
            payload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0];

            const formData = new FormData();
            for (let i of Object.entries(payload)) formData.append(i[0], i[1]);
            const response = await apiUpdateBanner(editBanner._id, formData);
            if (response.success) {
                toast.success(response.mes);
                render();
                setEditBanner(null);
            } else toast.error(response.mes);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 relative">
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[280px] fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit Banner
                </h1>
                <span
                    className="bg-red-500 rounded-md p-2 font-medium text-white hover:underline cursor-pointer"
                    onClick={() => setEditBanner(null)}>
                    Cancel
                </span>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateBanner)}>
                    <InputForm
                        label="Title"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: "Need fill this field",
                        }}
                        fullWidth
                        placeholder="Enter title for banner"
                    />
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="thumb">
                            Image
                        </label>
                        <input type="file" id="thumb" {...register("thumb")} />
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
                        <ButtonV2 type="submit">
                            Update
                        </ButtonV2>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default withBaseComponent(UpdateBanner)