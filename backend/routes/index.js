const userRoute = require('./user.route')
const productRoute = require('./product.route')
const productCategoryRoute = require('./productCategory.route')
const blogCategoryRoute = require('./blogCategory.route')
const { notFound, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRoute);
    app.use('/api/product', productRoute);
    app.use('/api/productCategory', productCategoryRoute);
    app.use('/api/blogCategory', blogCategoryRoute);
    app.use(notFound);
    app.use(errHandler);
}

module.exports = initRoutes;