import axios from "../axios";

export const apiRegister = (data) => axios({
    url: '/user/register',
    method: 'POST',
    data,
})

export const apiFinalRegister = (token) => axios({
    url: '/user/finalregister/' + token,
    method: 'PUT',
})

export const apiLogin = (data) => axios({
    url: '/user/login',
    method: 'POST',
    data
})

export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'POST',
    data
})

export const apiResetPassword = (data) => axios({
    url: '/user/resetpassword',
    method: 'PUT',
    data
})

export const apiGetCurrent = () => axios({
    url: '/user/current',
    method: 'GET',
})

export const apiGetUsers = (params) => axios({
    url: '/user',
    method: 'GET',
    params
})

export const apiUpdateUser = (data, uid) => axios({
    url: `/user/` + uid,
    method: "PUT",
    data,
})

export const apiDeleteUser = (uid) => axios({
    url: `/user/` + uid,
    method: "DELETE",
})

export const apiUpdateCurrent = (data) => axios({
    url: `/user/current`,
    method: "PUT",
    data,
})

export const apiUpdateCart = (data) => axios({
    url: `/user/cart`,
    method: "PUT",
    data,
})

export const apiRemoveCart = (pid) => axios({
    url: `/user/remove-cart/` + pid,
    method: "DELETE",
})