'use client';

import React, { useState } from 'react';
import { useProductContext } from './ProductContext';

export default function PaymentPage({
  goToOrders,
}: {
  goToOrders: () => void;
}) {
  const { cart, completePurchase } = useProductContext();
  const [paymentMethod, setPaymentMethod] = useState('');

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method!');
      return;
    }
    completePurchase(paymentMethod);
    goToOrders();
  };

  return (
    <div
      className="bg-gray-800 p-6 sm:p-8 text-gray-100 max-w-3xl sm:max-w-5xl mx-auto rounded-lg"
      data-testid="payment-page"
    >
      <h2
        className="text-4xl font-bold mb-8 text-center border-b border-gray-600 pb-4"
        data-testid="payment-title"
      >
        Payment
      </h2>

      {cart.length === 0 ? (
        <p
          className="text-gray-300 text-center"
          data-testid="payment-empty-message"
        >
          No items to pay.
        </p>
      ) : (
        <>
          <ul className="space-y-4" data-testid="payment-cart-list">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg border border-gray-100"
                data-testid={`payment-cart-item-${index}`}
              >
                <div data-testid={`payment-item-info-${index}`}>
                  <span
                    className="block font-semibold"
                    data-testid={`payment-item-name-${index}`}
                  >
                    {item.name}
                  </span>

                  <span
                    className="block text-gray-300"
                    data-testid={`payment-item-quantity-price-${index}`} // wrapper
                  >
                    <span data-testid={`payment-item-quantity-${index}`}>
                      {item.cartQuantity}
                    </span>
                    <span>{' x '}</span>
                    <span
                      data-testid={`payment-item-price-currency-${index}`}
                    >
                      €
                    </span>
                    <span
                      data-testid={`payment-item-price-value-${index}`}
                    >
                      {item.price.toFixed(2)}
                    </span>
                  </span>
                </div>

                <span
                  className="font-bold text-lg text-gray-100"
                  data-testid={`payment-item-total-${index}`} // wrapper
                >
                  <span
                    data-testid={`payment-item-total-currency-${index}`}
                  >
                    €
                  </span>
                  <span
                    data-testid={`payment-item-total-value-${index}`}
                  >
                    {(item.price * item.cartQuantity).toFixed(2)}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6" data-testid="payment-summary">
            <p
              className="text-xl text-center font-semibold"
              data-testid="payment-total"
            >
              <span data-testid="payment-total-label">Total: €</span>
              <span data-testid="payment-total-value">
                {totalAmount.toFixed(2)}
              </span>
            </p>
          </div>

          <div
            className="mt-6 space-y-4 text-center"
            data-testid="payment-methods-section"
          >
            <label
              className="block text-gray-300 text-lg font-semibold"
              data-testid="payment-methods-label"
            >
              Payment Method:
            </label>

            <div className="inline-block text-left">
              <div
                className="flex flex-col space-y-2"
                data-testid="payment-methods-list"
              >
                {['MBWay', 'Klarna', 'Multibanco', 'PayPal', 'Visa'].map(
                  (method) => (
                    <div
                      key={method}
                      className="flex items-center"
                      data-testid={`payment-method-${method}`}
                    >
                      <input
                        type="radio"
                        id={method}
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                        data-testid={`payment-method-input-${method}`}
                      />
                      <label
                        htmlFor={method}
                        className="ml-2 text-gray-100"
                        data-testid={`payment-method-label-${method}`}
                      >
                        {method}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full mt-6 py-3 rounded-lg bg-indigo-600 text-gray-100 font-semibold hover:bg-indigo-700 transition"
            data-testid="payment-confirm-button"
          >
            Confirm Payment
          </button>
        </>
      )}
    </div>
  );
}
