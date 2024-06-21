import { apiCreateCategory } from 'apis';
import { ButtonV2, InputForm, Loading } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { showModal } from 'store/app/appSlice';
import { getBase64, validate } from 'utils/helper';
import path from 'utils/path';

const CreateCategory = ({ navigate, dispatch }) => {
  const [preview, setPreview] = useState({ image: null });
  const [invalidFields, setInvalidFields] = useState([]);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const handlePreviewImage = async (file) => {
    const base64Image = await getBase64(file);
    setPreview((prev) => ({ ...prev, image: base64Image }));
  };
  useEffect(() => {
    handlePreviewImage(watch('image')[0]);
  }, [watch('image')])

  const handleCreateCategory = async (data) => {
    const invalids = validate(data, setInvalidFields);
    if (invalids === 0) {
      const formData = new FormData();
      for (let i of Object.entries(data)) formData.append(i[0], i[1]);
      if (data.image) formData.append("image", data.image[0]);

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiCreateCategory(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      
      if (response.success) {
        toast.success(response.mes);
        navigate(`/${path.ADMIN}/${path.MANAGE_CATEGORY}`)
      } else toast.error(response.mes);
    }

  }

  return (
    <div className='w-full'>
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Create Category</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateCategory)}>
          <InputForm
            label="Category name"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
            }}
            fullWidth
            placeholder="Nhập tên sản phẩm"
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              id="image"
              {...register("image", { required: "Need fill" })}
            />
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
          <div className="my-6">
            <ButtonV2 type="submit">Create</ButtonV2>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withBaseComponent(CreateCategory)