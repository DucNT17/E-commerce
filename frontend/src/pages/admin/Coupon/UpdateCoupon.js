import { ButtonV2, InputForm, Loading } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";
import { validate } from 'utils/helper';
import { formatISO } from 'date-fns';
import { showModal } from 'store/app/appSlice';
import { apiUpdateCoupon } from 'apis';
import { toast } from 'react-toastify';

const UpdateCoupon = ({ editCoupon, render, setEditCoupon, dispatch }) => {
    const [start, setStart] = useState(editCoupon?.startDate);
    const [end, setEnd] = useState(editCoupon?.endDate);
    const [invalidFields, setInvalidFields] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        reset({
            name: editCoupon?.name,
            discount: editCoupon?.discount,
            quantity: editCoupon?.quantity,
            startDate: editCoupon?.startDate,
            endDate: editCoupon?.endDate,
        });
    }, [editCoupon]);
    const handleUpdateCoupons = async (data) => {
        const invalids = validate(data, setInvalidFields);
        if (invalids === 0) {
            data.startDate = start ? formatISO(start) : null;
            data.endDate = end ? formatISO(end) : null;

            // dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiUpdateCoupon(editCoupon._id, data);
            // dispatch(showModal({ isShowModal: false, modalChildren: null }));

            if (response.success) {
                toast.success(response.mes);
                render();
                setEditCoupon(null);
            } else toast.error(response.mes);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 relative">
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[280px] fixed top-0">
                <h1 className="text-3xl font-bold tracking-tight">Edit Coupon</h1>
                <span
                    className="bg-red-500 rounded-md p-2 font-medium text-white hover:underline cursor-pointer"
                    onClick={() => setEditCoupon(null)}>
                    Cancel
                </span>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateCoupons)}>
                    <InputForm
                        label="Name of coupon"
                        register={register}
                        errors={errors}
                        id="name"
                        validate={{
                            required: "Need fill this field",
                        }}
                        placeholder="Enter name of coupon"
                    />
                    <div className="w-full my-6 flex  gap-4">
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
                            selected={start || editCoupon.startDate}
                            onChange={(date) => setStart(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select start date"
                            className='border rounded-md'
                        />
                        <DatePicker
                            showIcon
                            selected={end || editCoupon.endDate}
                            onChange={(date) => setEnd(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select end date"
                            className='border rounded-md'
                        />
                    </div>
                    <div className="my-6">
                        <ButtonV2 type="submit">Xác nhận</ButtonV2>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default withBaseComponent(UpdateCoupon)