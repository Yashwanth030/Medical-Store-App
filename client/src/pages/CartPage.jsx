import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart } from '../features/cart/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState('');

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty.');
      return;
    }
    if (!address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    try {
      console.log('📦 Order Payload:', cartItems);

      const orderData = {
        orderItems: cartItems.map((item) => ({
          medicine: item._id,
          qty: item.quantity,
          price: item.price,
          name: item.name, // ✅ Important fix
        })),
        totalPrice: totalAmount,
        paymentMethod,
        shippingAddress: address,
      };

      await axios.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      alert('✅ Order placed successfully!');
      dispatch(clearCart());
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to place order. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🛒 My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 italic">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid gap-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border p-4 rounded shadow bg-white"
              >
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE}${item.image}`}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Address Input */}
          <div className="mt-4">
            <label className="block mb-1 font-semibold">Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Enter your full delivery address"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <label className="font-semibold">Select Payment Method:</label>
            <div className="flex gap-6 mt-2">
              <label>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">UPI / PhonePe</span>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 text-right">
            <p className="text-lg font-semibold text-gray-800">
              Total Items: <span className="text-blue-700">{totalQuantity}</span>
            </p>
            <p className="text-xl font-bold text-green-700">
              Total Amount: ₹{totalAmount.toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
