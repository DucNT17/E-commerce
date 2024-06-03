const Product = require('../models/product.model');
const ProductCategory = require('../models/productCategory.model')
const Role = require('../models/role.model')
const asyncHandler = require('express-async-handler');
const data = require('../../data/data2.json')
const categoryData = require('../../data/cate_brand')
const slugify = require('slugify');
const {
    roles
} = require('../utils/constant')

const fn = async (product) => {
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name),
        description: product?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price?.match(/\d/g).join(''))/100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find(el => el.label === "Color")?.variants[0],
        thumb: product?.thumb,
        totalRatings: 0
    })
}

const insertProduct = asyncHandler(async (req, res) => {
    const promises = [];
    for(let product of data) promises.push(fn(product));
    await Promise.all(promises)
    return res.json('Done')
})

const fn2 = async(cate) => {
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand,
        image: cate?.image,
    })
}

const insertCategory = asyncHandler(async (req, res) => {
    const promises = [];
    for (let cate of categoryData) promises.push(fn2(cate));
    await Promise.all(promises)
    return res.json('Done')
})

const fn3 = async (role) => {
    await Role.create({
        code: role?.code,
        value: role?.value,
    })
}

const insertRole = asyncHandler(async (req, res) => {
    const promises = [];
    for (let role of roles) promises.push(fn3(role));
    await Promise.all(promises)
    return res.json('Done')
})

module.exports = {
    insertProduct,
    insertCategory,
    insertRole
}