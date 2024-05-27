import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import productSlide from './products/productSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userSlice from './user/userSlice';

const commonConfig = {
  key: 'shop/user',
  storage
};

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token']
};

export const store = configureStore({
  reducer: {
    appReducer: appSlice,
    products: productSlide,
    user: persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);