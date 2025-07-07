import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [], // [{ _id, name, price, quantity, image, countInStock }]
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find((x) => x._id === item._id);

      if (existing) {
        // 🛑 Prevent exceeding stock
        if (existing.quantity < item.countInStock) {
          existing.quantity += 1;
        } else {
          alert(`Only ${item.countInStock} available in stock`);
        }
      } else {
        if (item.countInStock > 0) {
          state.cartItems.push({ ...item, quantity: 1 });
        } else {
          alert('This item is out of stock');
        }
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
