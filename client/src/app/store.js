import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';   // ✅ go up one level
import cartReducer from '../features/cart/cartSlice';   // ✅ go up one level

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export default store;
