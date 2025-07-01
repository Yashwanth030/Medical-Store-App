import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeFromCart } from '../features/cart/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('COD');

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

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          medicine: item._id,
          qty: item.quantity,
          price: item.price,
        })),
        totalPrice: totalAmount,
        paymentMethod,
      };

      await axios.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      alert('Order placed successfully!');
      // Optional: dispatch(clearCart()); // if you have a clearCart action
      navigate('/orders'); // create MyOrders page next
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
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
                      src={item.image}
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

          {/* 🔹 Payment Selection */}
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
                <span className="ml-2">UPI/PhonePe</span>
              </label>
            </div>
          </div>

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
