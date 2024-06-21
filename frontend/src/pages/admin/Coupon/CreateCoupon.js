import { ButtonV2, InputForm, Loading } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import { formatISO } from 'date-fns';
import { validate } from 'utils/helper';
import { showModal } from 'store/app/appSlice';
import { apiCreateCoupon } from 'apis';
import { toast } from 'react-toastify';
import path from 'utils/path';

const CreateCoupon = ({ dispatch, navigate }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    const [invalidFields, setInvalidFields] = useState([]);

    const handleCreateCoupons = async (data) => {
        data.startDate = formatISO(start);
        data.endDate = formatISO(end);
        const invalids = validate(data, setInvalidFields);
        if (invalids === 0) {
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiCreateCoupon(data);
            if (response.success) {
                toast.success(response.mes);
                navigate(`/${path.ADMIN}/${path.MANAGE_COUPON}`)
            } else toast.error(response.mes);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
        }
    };
    return (
        <div className='w-full'>
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
                <span>Create New Coupon</span>
            </h1>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleCreateCoupons)}>
                    <InputForm
                        label="Name of the new coupon"
                        register={register}
                        errors={errors}
                        id="name"
                        validate
                        placeholder="Enter name of new coupon"
                    />
                    <div className='w-full my-6 flex gap-4'>
                        <InputForm
                            label="Discount percentage:"
                            register={register}
                            errors={errors}
                            id="discount"
                            validate={{
                                required: "Need fill this field",
                                min: { value: 1, message: "The minimum discount percentage is 100" },
                                max: {
                                    value: 99,
                                    message: "The maximum discount percentage is 100",
                                },
                                pattern: {
                                    value: /^(?:[1-9]|[1-9][0-9]|100)$/,
                                    message: "Invalid discount percentage",
                                },
                            }}
                            // eslint-disable-next-line
                            style="flex-auto"
                        />
                        <InputForm
                            label="Quantity"
                            register={register}
                            errors={errors}
                            id="quantity"
                            validate={{
                                required: "Need fill this field",
                                min: { value: 1, message: "The minimum quantity is 1" },
                                max: {
                                    value: 1000,
                                    message: "The maximum discount percentage is 100",
                                },
                            }}
                            // eslint-disable-next-line
                            style="flex-auto"
                        />
                    </div>
                    <div className="w-full my-6 flex gap-4">
                        <DatePicker
                            showIcon
                            selected={start}
                            onChange={(date) => setStart(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select start date"
                            className='border rounded-md'
                        />
                        <DatePicker
                            showIcon
                            selected={end}
                            onChange={(date) => setEnd(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select end date"
                            className='border rounded-md'
                        />
                    </div>
                    <div className="my-6">
                        <ButtonV2 type="submit">Create Coupon</ButtonV2>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default withBaseComponent(CreateCoupon)