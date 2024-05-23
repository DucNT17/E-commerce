import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import productSlide from './products/productSlice'

export const store = configureStore({
  reducer: {
    appReducer: appSlice,
    products: productSlide
  },
});
