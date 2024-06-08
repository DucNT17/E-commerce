import moment from "moment";
import "moment/locale/vi";
import icons from "./icons"
const { AiFillStar, AiOutlineStar } = icons

export const formatTime = (time) => {
    return moment(time).format("llll");
};

export const formatTimeV2 = (time) => {
    return moment(time).format("l");
};


export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-');
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString(); // (12345.67).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 

export const formatPriceVN = (value) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
};

export const formatPriceUSD = (value) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
};

export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return;
    // 4 => [1,1,1,1,0]
    number = Math.round(number);
    const stars = [];
    for (let i = 0; i < +number; i++) {
        stars.push(<AiFillStar color="orange" size={size || 16} />);
    }
    for (let i = 5; i > +number; i--) {
        stars.push(<AiOutlineStar color="orange" size={size || 16} />);
    }
    return stars

}

export function secondToHms(d) {
    d = Number(d) / 1000;
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 / 60);
    return ({ h, m, s })
}

export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);
    for (let arr of formatPayload) {
        if (arr[1] === '') {
            setInvalidFields((prev) => [...prev, { name: arr[0], mes: "Require this field" }])
            invalids++;
        }
    }
    formatPayload.forEach((item) => {
        if (item[1] === "") {
            setInvalidFields((prev) => [
                ...prev,
                {
                    name: item[0],
                    mes: "Require this field",
                },
            ]);
            invalids++;
        }
    });
    // for (let arr of formatPayload) {
    //     switch (arr[0]) {
    //         case 'email':
    //             const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //             if (!arr[1].toLowerCase().match(regex)) {
    //                 invalids++;
    //                 setInvalidFields((prev) => [...prev, { name: arr[0], mes: "Email invalid" }])
    //             }

    //             break;
    //         case 'password':
    //             if(arr[1].length < 8){
    //                 invalids++;
    //                 setInvalidFields((prev) => [...prev, { name: arr[0], mes: "Password must be 8 characters" }])
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }

    return invalids;
}

export const formatPrice = number => Math.round(number / 1000) * 1000

export const generateRange = (start, end) => {
    const length = end + 1 - start;
    return Array.from({ length }, (_, index) => start + index)
}

export function getBase64(file) {
    if (!file) return "";
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
