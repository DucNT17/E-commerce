import axios from "../axios";

// category
export const apiGetCategories = () => axios({
    url: '/productCategory/',
    method: 'GET',
})


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
