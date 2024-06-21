import axios from "../axios";

// category
export const apiGetCategories = () => axios({
    url: '/productCategory/',
    method: 'GET',
})

export const apiGetCategory = (params) => axios({
    url: '/productCategory/admin',
    method: 'GET',
    params
})

export const apiDeleteCategory = (id) => axios({
    url: `/productCategory/${id}`,
    method: "DELETE",
});

export const apiCreateCategory = (data) => axios({
    url: "/productCategory",
    method: "POST",
    data,
});

export const apiUpdateCategory = (id, data) => axios({
    url: `/productCategory/${id}`,
    method: "PUT",
    data,
});

// coupon
export const apiCreateCoupon = (data) => axios({
    url: "/coupon",
    method: "POST",
    data,
});
export const apiGetCoupons = (params) => axios({
    url: "/coupon",
    method: "GET",
    params,
});
export const apiUpdateCoupon = (cid, data) => axios({
    url: `/coupon/${cid}`,
    method: "PUT",
    data,
});
export const apiDeleteCoupon = (cid) => axios({
    url: `/coupon/${cid}`,
    method: "DELETE",
});
