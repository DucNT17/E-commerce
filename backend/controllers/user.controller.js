const User = require('../models/user.model')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')
const { usersTest } = require('../utils/constant')

// const register = asyncHandler(async (req, res) => {
//     const { email, password, firstname, lastname } = req.body;
//     if (!email || !password || !lastname || !firstname)
//         return res.status(400).json({
//             success: false,
//             mes: 'Missing inputs'
//         })
//     const user = await User.findOne({ email })
//     if (user) {
//         throw new Error('User has existed');
//     } else {
//         const newUser = await User.create(req.body);
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? 'Register successfully. Please go login' : 'Something went wrong'
//         })
//     }
// })

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body;
    if (!email || !password || !lastname || !firstname || !mobile) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    }
    const user = await User.findOne({ email });
    if (user) {
        throw new Error('User has existed');
    } else {
        const token = makeToken();
        const emailedited = btoa(email) + '@' + token;
        const newUser = await User.create({
            email: emailedited, password, firstname, lastname, mobile
        })
        if (newUser) {
            const html = `<h2>Register code:</h2><br /><blockquote>${token}</blockquote>`;
            await sendMail({
                email,
                html,
                subject: 'Confirm register account Digital Store'
            });
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailedited })
        }, [15 * 60 * 1000])
        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email address to active account' : "Somthing went wrong, please try again"
        })
    }
})

const finalRegister = asyncHandler(async (req, res) => {
    // const cookie = req.cookies;
    const { token } = req.params;
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) });
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0]);
        notActivedEmail.save();
    }
    return res.json({
        success: notActivedEmail ? true : false,
        mes: notActivedEmail ? 'Register is successfully, please go login' : "Somthing went wrong, please try again"
    })
    // if (!cookie || cookie?.dataregister?.token !== token) {
    //     res.clearCookie('dataregister');
    //     return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
    // }
    // const newUser = await User.create({
    //     email: cookie?.dataregister?.email,
    //     password: cookie?.dataregister?.password,
    //     mobile: cookie?.dataregister?.mobile,
    //     firstname: cookie?.dataregister?.firstname,
    //     lastname: cookie?.dataregister?.lastname
    // });
    // res.clearCookie('dataregister')
    // if (newUser) {
    //     return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
    // } else {
    //     return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    // }
})
// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, phân quyền người dùng
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    // plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role);
        // Tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id);
        // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true });
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            success: response ? true : false,
            accessToken,
            userData,
            // mes: response ? 'Login successful' : 'Something went wrong'
        })
    } else {
        throw new Error('Invalid credentials!');
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select('-refreshToken -password').populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price'
        }
    }).populate('wishlist', 'title thumb price color');

    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})
// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Forgot Password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Check your email address' : 'Something went wrong, please try again'
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { firstname, lastname, mobile, address } = req.body;
    const data = { firstname, lastname, mobile, address }
    if (req.file) {
        data.avatar = req.file.path
    }
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Updated successful" : 'Some thing went wrong'
    });
})

// Chức năng của admin

// Xem danh sách người dùng
const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchEl) => `$${matchEl}`);
    const formatedQueries = JSON.parse(queryString);

    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' };

    if (req.query.q) {
        delete formatedQueries.q;
        formatedQueries["$or"] = [
            { firstname: { $regex: req.query.q, $options: "i" } },
            { lastname: { $regex: req.query.q, $options: "i" } },
            { email: { $regex: req.query.q, $options: "i" } },
            // { mobile: { $regex: req.query.q, $options: "i" } },
        ];
    }
    let queryCommand = User.find(formatedQueries);

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    } else {
        queryCommand = queryCommand.sort('-createdAt');
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    } else {
        queryCommand = queryCommand.select('-__v')
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);


    // Execute query
    // Số lượng sản phẩm thỏa mãn điều kiện != số lượng sản phẩm trả về 1 lần gọi API
    // queryCommand.exec(async (err, response) => {
    //     if (err) throw new Error(err.message);
    //     const counts = await Product.find(formattedQueries).countDocuments();
    //     return res.status(200).json({
    //         success: response ? true : false,
    //         products: response ? response : 'Cannot get products',
    //         counts
    //     });  
    // })
    queryCommand.then(async (response) => {
        const counts = await User.find(formatedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Cannot get users'
        });
    }).catch((err) => {
        throw new Error(err.message);
    })
});

// Xóa user
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const response = await User.findByIdAndDelete(uid);
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} deleted` : 'No user delete'
    })
})


// Cập nhật thông tin user
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Updated user successfully" : 'Some thing went wrong'
    });
});

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, { address: req?.body?.address }, { new: true }).select('-password -role -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Cannot update address'
    });

})

const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(usersTest);
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : "Some thing went wrong",
    });
});

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity = 1, color, price, thumbnail, title } = req.body;
    if (!pid || !color) throw new Error('Missing inputs');
    const user = await User.findById(_id).select('cart');
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color);
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, {
            $set: {
                "cart.$.quantity": quantity,
                "cart.$.price": price,
                "cart.$.thumbnail": thumbnail,
                "cart.$.title": title,
            }
        }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated your cart' : 'Some thing went wrong'
        })

    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price, thumbnail, title } } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated your cart' : 'Some thing went wrong'
        })
    }
});

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, color } = req.params;
    const user = await User.findById(_id).select("cart");
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color);
    if (!alreadyProduct) {
        return res.status(200).json({
            success: true,
            mes: "Updated your cart",
        });
    }
    const response = await User.findByIdAndUpdate(
        _id,
        { $pull: { cart: { product: pid, color } } },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Removed product from cart" : "Some thing went wrong",
    });
});

const updateWishlist = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { _id } = req.user;
    const user = await User.findById(_id);
    const alreadyInWishlist = user.wishlist?.find((el) => el.toString() === pid);
    if (alreadyInWishlist) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishlist: pid } },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            mes: response ? "Removed from wishlist" : "Something went wrong",
        });
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishlist: pid } },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            mes: response ? "Added to wishlist" : "Something went wrong",
        });
    }
});

module.exports = {
    register,
    finalRegister,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    createUsers,
    removeProductInCart,
    updateWishlist
}