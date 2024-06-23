import { apiUpdateBlog } from 'apis';
import { ButtonV2, InputForm, MarkdownEditor } from 'components';
import React, { useCallback, useEffect, useState } from 'react'
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getBase64, validate } from 'utils/helper';

const UpdateBlog = ({ editBlog, render, setEditBlog }) => {
    const [invalidFields, setInvalidFields] = useState([]);

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();

    const [payload, setPayload] = useState({
        description: '',
    });

    const [preview, setPreview] = useState({ thumb: null, });

    useEffect(() => {
        reset({
            title: editBlog?.title || "",
        });
        setPayload({
            description: typeof editBlog?.description === 'object' ? editBlog?.description?.join(', ') : editBlog?.description
        });
        setPreview({
            thumb: editBlog?.thumb || "",
        });
    }, [editBlog]);

    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload]
    );

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
    };

    useEffect(() => {
        if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
            handlePreviewThumb(watch("thumb")[0]);
    }, [watch("thumb")]);

    const handleUpdateBlog = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            const finalPayload = { ...data, ...payload };
            finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0];
            
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);

            const response = await apiUpdateBlog(editBlog._id, formData);
            if (response.success) {
                toast.success(response.mes);
                render();
                setEditBlog(null);
            } else toast.error(response.mes);
        }
    }

    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b bg-gray-100 flex justify-between right-0 left-[280px] items-center fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit Blog
                </h1>
                <span
                    className="bg-red-500 rounded-md p-2 font-medium text-white hover:underline cursor-pointer"
                    onClick={() => setEditBlog(null)}>
                    Cancel
                </span>
            </div>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateBlog)}>
                    <InputForm
                        label="Blog title"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: "Need fill this field",
                        }}
                        fullWidth
                        placeholder="Enter blog title"
                    />
                    <div className="w-full my-6">
                        <MarkdownEditor
                            label="Description"
                            name="description"
                            changeValue={changeValue}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            value={payload.description}
                        />
                    </div>
                    <div className='flex flex-col gap-2 mt-8'>
                        <label className="font-semibold" htmlFor="thumb">
                            Upload Thumbnail
                        </label>
                        <input
                            type="file"
                            id="thumb"
                            {...register("thumb")}
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
                        <ButtonV2 type="submit">Save</ButtonV2>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default memo(UpdateBlog)