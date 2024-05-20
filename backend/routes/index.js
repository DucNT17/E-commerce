const userRoute = require('./user.route')
const productRoute = require('./product.route')
const productCategoryRoute = require('./productCategory.route')
const blogRoute = require('./blog.route')
const blogCategoryRoute = require('./blogCategory.route')
const brandRoute = require('./brand.route')
const couponRoute = require('./coupon.route')
const orderRoute = require('./order.route')
const insert = require('./insert')
const { notFound, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRoute);
    app.use('/api/product', productRoute);
    app.use('/api/productCategory', productCategoryRoute);
    app.use('/api/blog', blogRoute);
    app.use('/api/blogCategory', blogCategoryRoute);
    app.use('/api/brand', brandRoute);
    app.use('/api/coupon', couponRoute)
    app.use('/api/order', orderRoute)
    app.use('/api/insert', insert)



    app.use(notFound);
    app.use(errHandler);
}

module.exports = initRoutes;