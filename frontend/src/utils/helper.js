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


export function getDaysInMonth(customTime, number) {
    const endDay = new Date(customTime)?.getDate() || new Date().getDate();
    const days = number || 15;
    const endPreviousMonth = new Date(
        new Date(customTime)?.getFullYear(),
        new Date(customTime)?.getMonth(),
        0
    ).getDate();
    let day = 1;
    let prevDayStart = 1;
    const daysInMonths = [];
    while (prevDayStart <= +endPreviousMonth) {
        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        daysInMonths.push(
            `${year}-${month < 10 ? `0${month}` : month}-${prevDayStart < 10 ? "0" + prevDayStart : prevDayStart
            }`
        );
        prevDayStart += 1;
    }
    while (day <= +endDay) {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        daysInMonths.push(
            `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? "0" + day : day
            }`
        );
        day += 1;
    }
    return daysInMonths.filter(
        (el, index, self) => index > self.length - days - 2
    );
}
export function getMonthInYear(customTime, number) {
    const endMonth =
        new Date(customTime?.to).getMonth() + 1 || new Date().getMonth() + 1;
    let month = 1;
    const months = number || 8;
    let startLastYear = 1;
    const daysInMonths = [];
    while (startLastYear <= 12) {
        const year = new Date().getFullYear();
        daysInMonths.push(
            `${year - 1}-${startLastYear < 10 ? `0${startLastYear}` : startLastYear}`
        );
        startLastYear += 1;
    }
    while (month <= +endMonth) {
        const year = new Date().getFullYear();
        daysInMonths.push(`${year}-${month < 10 ? `0${month}` : month}`);
        month += 1;
    }
    return daysInMonths.filter(
        (el, index, self) => index > self.length - months - 2
    );
}
export const getDaysInRange = (start, end) => {
    const startDateTime = new Date(start).getTime();
    const endDateTime = new Date(end).getTime();
    return (endDateTime - startDateTime) / (24 * 60 * 60 * 1000);
};
export const getMonthsInRange = (start, end) => {
    let months;
    const d1 = new Date(start);
    const d2 = new Date(end);
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
};