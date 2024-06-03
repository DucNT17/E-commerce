import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom';
import useDebounce from "hooks/useDebounce";
import { toast } from "react-toastify";
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from 'apis'
import clsx from "clsx";
import { roles, blockStatus } from 'utils/contants'
import moment from 'moment';
import { InputField, Pagination, InputForm, Select, Button } from 'components'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';

const ManageUser = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm({
        email: "",
        firstname: "",
        lastname: "",
        role: "",
        mobile: "",
        isBlocked: "",
    });
    const [users, setUsers] = useState(null);
    const [queries, setQueries] = useState({ q: "" });
    const [update, setUpdate] = useState(false);
    const [editElm, setEditElm] = useState(null);
    const [editValues, setEditValues] = useState(null);
    const [params] = useSearchParams();

    const fetchUsers = async (params) => {
        const response = await apiGetUsers({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
            sort: "-createdAt",
        });
        if (response.success) setUsers(response);
    };

    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    const queriesDebounce = useDebounce(queries.q, 800);
    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (queriesDebounce) queries.q = queriesDebounce;
        fetchUsers(queries);
    }, [queriesDebounce, params, update]);

    const handleUpdate = async (data) => {
        console.log(data);
        const response = await apiUpdateUser(data, editElm._id);
        if (response.success) {
            setEditElm(null);
            setEditValues(null);
            render();
            toast.success(response.mes);
        } else toast.error(response.mes);
    };

    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: "Remove User",
            text: "Are you sure to delete this user?",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUser(uid);
                if (response.success) {
                    render();
                    toast.success(response.mes);
                } else {
                    toast.error(response.mes);
                }
            }
        })

    }

    const handleEdit = (el) => {
        setEditElm(el);
        setEditValues({ ...el });
    };

    useEffect(() => {
        if (editElm) {
            reset({
                email: editElm.email,
                firstname: editElm.firstname,
                lastname: editElm.lastname,
                role: editElm.role,
                mobile: editElm.mobile,
                isBlocked: editElm.isBlocked
            });
        }
    }, [editElm])
    return (
        <div className={clsx("w-full", editElm && "pl-20")}>
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
                <span className="uppercase">Manage Users Account</span>
            </h1>
            <div className='w-full p-4'>
                <div className="flex justify-end py-2">
                    <InputField
                        nameKey={"q"}
                        value={queries.q}
                        setValue={setQueries}
                        // style={"w-500"}
                        placeholder="Search Name or Email..."
                        isHideLabel
                    />
                </div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    {editElm && <Button type="submit">Update</Button>}
                    <table className='table-auto mb-6 text-left w-full text-sm'>
                        <thead className='font-bold bg-gray-500 text-[13px] text-white'>
                            <tr className="border border-gray-500">
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Firstname</th>
                                <th className="px-4 py-2">Lastname</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.users?.map((el, idx) => (
                                <tr key={el._id} className="border border-gray-500">
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">
                                        {editElm?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                defaultValue={editValues?.email}
                                                id={"email"}
                                                validate={{
                                                    required: "Required this field",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "invalid email address"
                                                    }
                                                }}
                                            />
                                            : <span>{el.email}</span>
                                        }
                                    </td>
                                    <td className="px-4 py-2">
                                        {editElm?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                errors={errors}
                                                id={'firstname'}
                                                fullWidth
                                                defaultValue={editValues?.firstname}
                                                validate={{ required: "Required this field" }}
                                            />
                                            : <span>{`${el.firstname}`}</span>
                                        }
                                    </td>
                                    <td className="px-4 py-2">
                                        {editElm?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                errors={errors}
                                                id={'lastname'}
                                                fullWidth
                                                defaultValue={editValues?.lastname}
                                                validate={{ required: "Required this field" }}
                                            />
                                            : <span>{`${el.lastname}`}</span>
                                        }

                                    </td>
                                    <td className="px-4 py-2">
                                        {editElm?._id === el._id
                                            ? <Select
                                                register={register}
                                                errors={errors}
                                                id={'role'}
                                                fullWidth
                                                defaultValue={el.role}
                                                validate={{ required: "Required this field" }}
                                                options={roles}
                                            />
                                            : <span>{roles.find(role => +role.code === +el.role)?.value}</span>
                                        }

                                    </td>
                                    <td className="px-4 py-2">
                                        {editElm?._id === el._id
                                            ? <InputForm
                                                register={register}
                                                errors={errors}
                                                id={'mobile'}
                                                fullWidth
                                                defaultValue={editValues?.mobile}
                                                validate={{
                                                    required: "Required this field",
                                                    pattern: {
                                                        value: /^[62|0]+\d{9}/gi,
                                                        message: "invalid phone number"
                                                    }
                                                }}
                                            />
                                            : <span>{el.mobile}</span>
                                        }

                                    </td>
                                    <td className="px-4 py-2">
                                        {editElm?._id === el._id
                                            ? <Select
                                                register={register}
                                                errors={errors}
                                                id={'isBlocked'}
                                                fullWidth
                                                defaultValue={el.isBlocked}
                                                validate={{ required: "Required this field" }}
                                                options={blockStatus}
                                            />
                                            : <span>{el.isBlocked ? 'Blocked' : "Active"}</span>
                                        }

                                    </td>
                                    <td className="px-4 py-2">{moment(el.createdAt).format("DD/MM/YYYY")}</td>
                                    <td className="px-4 py-2">
                                        {editElm?._id === el._id ? (
                                            <span
                                                onClick={() => {
                                                    setEditElm(null);
                                                    setEditValues(null);
                                                }}
                                                className="px-2 text-orange-600 hover:underline cursor-pointer">
                                                Cancel
                                            </span>
                                        ) : (
                                            <span
                                                onClick={() => handleEdit(el)}
                                                className="px-2 text-orange-600 hover:underline cursor-pointer">
                                                Edit
                                            </span>
                                        )}
                                        <span
                                            onClick={() => handleDeleteUser(el._id)}
                                            className='px-2 text-orange-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>

                <div className='w-full text-right'>
                    <Pagination totalCount={users?.counts} />
                </div>
            </div>
        </div>
    )
}

export default ManageUser