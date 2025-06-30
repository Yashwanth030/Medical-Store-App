import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../features/cart/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

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

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold text-gray-800">
              Total Items: <span className="text-blue-700">{totalQuantity}</span>
            </p>
            <p className="text-xl font-bold text-green-700">
              Total Amount: ₹{totalAmount.toFixed(2)}
            </p>
            <button
              onClick={() => alert('Checkout process coming soon...')}
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
