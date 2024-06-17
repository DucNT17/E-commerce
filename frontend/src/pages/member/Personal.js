import { ButtonV2, InputForm } from 'components';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from "react-redux";
import { formatTime } from 'utils/helper'
import avatar from 'assets/default_avatar.png'
import { apiUpdateCurrent } from 'apis';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrent } from 'store/user/asyncActions';

const Personal = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {
        register,
        formState: { errors, isDirty },
        handleSubmit,
        reset,
        watch,
    } = useForm();
    const { current } = useSelector(state => state.user);
    useEffect(() => {
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
            address: current?.address,
        });
    }, [current]);

    const handleUpdateInfor = async (data) => {
        const formData = new FormData();
        if (data.avatar.length > 0) {
            formData.append("avatar", data.avatar[0]);
        }
        delete data.avatar;
        for (let i of Object.entries(data)) formData.append(i[0], i[1]);
        const response = await apiUpdateCurrent(formData);
        if (response.success) {
            dispatch(getCurrent());
            toast.success(response.mes);
            if (searchParams.get("redirect")) navigate(searchParams.get("redirect"));
        } else toast.error(response.mes);
    }

    return (
        <div className="w-full relative px-4">
            <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
                Personal Information
            </header>
            <form
                onSubmit={handleSubmit(handleUpdateInfor)}
                className='w-3/5 mx-auto py-8 flex flex-col gap-4'
            >
                <InputForm
                    label="First Name"
                    register={register}
                    errors={errors}
                    id="firstname"
                    validate={{
                        required: "Need fill this field",
                    }}
                />
                <InputForm
                    label="Last Name"
                    register={register}
                    errors={errors}
                    id="lastname"
                    validate={{
                        required: "Need fill this field",
                    }}
                />
                <InputForm
                    label="Email"
                    disabled
                    register={register}
                    errors={errors}
                    id="email"
                    validate={{
                        required: "Need fill this field",
                        pattern: {
                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                            message: "Email invalid.",
                        },
                    }}
                />
                <InputForm
                    disabled
                    label="Phone Number"
                    register={register}
                    errors={errors}
                    id="mobile"
                    validate={{
                        required: "Need fill this field",
                        pattern: {
                            value:
                                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                            message: "Phone invalid.",
                        },
                    }}
                />
                <InputForm
                    label="Address"
                    register={register}
                    errors={errors}
                    id="address"
                // validate={{
                //     required: "Need fill this field",
                // }}
                />
                <div className="flex items-center gap-2">
                    <span className="font-medium">Role:</span>
                    <span>{+current?.role === 1 ? "Admin" : "User"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Account created at:</span>
                    <span>{formatTime(current?.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-medium">Avatar:</span>
                    <label htmlFor="file">
                        <img
                            src={current?.avatar || avatar}
                            alt="avatar"
                            className="w-20 h-20 ml-8 object-cover rounded-full"
                        />
                    </label>
                    <input type="file" id="file" {...register("avatar")} hidden />
                </div>
                {isDirty && <div className="w-full flex justify-end">
                    <ButtonV2 type="submit">Update Information</ButtonV2>
                </div>}
            </form>
        </div>
    )
}

export default Personal