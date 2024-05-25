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
  Product,
  FinalRegister,
  ResetPassword
} from './pages/public';
import path from './utils/path';
import { getCategories } from './store/app/asyncActions';
import { useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch])
  return (
    <div className="min-h-screen font-main">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route path={path.PRODUCTS} element={<Product />} />
          <Route path={path.DETAIL_PRODUCT__PID__TITLE} element={<DetailProduct />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
