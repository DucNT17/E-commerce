import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  Login,
  Home,
  Public,
  Blog,
  DetailProduct,
  FAQ,
  Services,
  FinalRegister,
  ResetPassword,
  DetailCart,
  ContactUs
} from './pages/public';
import {
  AdminLayout,
  ManageProduct,
  ManageUser,
  CreateProduct,
  ManageOrder,
  Dashboard,
  ManageCoupon,
  CreateCoupon,
  ManageCategory,
  CreateCategory,
  ManageBrand,
  CreateBrand

} from './pages/admin'

import {
  MemberLayout,
  Personal,
  MyCart,
  Wishlist,
  History,
  Checkout
} from './pages/member'

import path from './utils/path';
import { getCategories } from './store/app/asyncActions';
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Products from './pages/public/Products';
import { Cart, Modal } from './components';
import { showCart } from 'store/app/appSlice';


function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalChildren, isShowCart } = useSelector(state => state.appReducer);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch])
  return (
    <div className="font-main h-screen relative">

      {isShowCart && <div onClick={() => dispatch(showCart())} className='absolute inset-0 bg-black-rbga z-50 flex justify-end'>
        <Cart />
      </div>}

      {isShowModal && <Modal>{modalChildren}</Modal>}

      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.CHECKOUT} element={<Checkout />} />
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.CONTACT_US} element={<ContactUs />} />
          <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.DETAL_CART} element={<DetailCart />} />
          <Route path={path.ALL} element={<Home />} />
        </Route>

        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProduct />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProduct />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_COUPON} element={<ManageCoupon />} />
          <Route path={path.CREATE_COUPON} element={<CreateCoupon />} />
          <Route path={path.MANAGE_CATEGORY} element={<ManageCategory />} />
          <Route path={path.CREATE_CATEGORY} element={<CreateCategory />} />
          <Route path={path.MANAGE_BRAND} element={<ManageBrand />} />
          <Route path={path.CREATE_BRAND} element={<CreateBrand />} />

        </Route>

        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.MY_CART} element={<MyCart />} />
          <Route path={path.HISTORY} element={<History />} />
          <Route path={path.WISHLIST} element={<Wishlist />} />


        </Route>

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
