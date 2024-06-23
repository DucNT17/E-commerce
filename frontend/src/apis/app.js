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

// dashboard

export const apiGetDashboard = (params) => axios({
    url: "/order/admin/dashboard",
    method: "GET",
    params,
});

// brand
export const apiCreateBrand = (data) => axios({
    url: "/brand",
    method: "POST",
    data,
});
export const apiGetBrand = (params) => axios({
    url: "/brand",
    method: "GET",
    params,
});
export const apiUpdateBrand = (bid, data) => axios({
    url: `/brand/${bid}`,
    method: "PUT",
    data,
});
export const apiDeleteBrand = (bid) => axios({
    url: `/brand/${bid}`,
    method: "DELETE",
});

// Blog

export const apiCreateBlog = (data) => axios({
    url: "/blog",
    method: "POST",
    data,
});

export const apiGetBlogs = (params) => axios({
    url: "/blog",
    method: "GET",
    params,
});

export const apiUpdateBlog = (id, data) => axios({
    url: `/blog/${id}`,
    method: "PUT",
    data,
});

export const apiDeleteBlog = (id) => axios({
    url: `/blog/${id}`,
    method: "DELETE",
});