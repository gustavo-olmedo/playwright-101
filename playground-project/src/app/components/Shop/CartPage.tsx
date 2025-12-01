'use client';

import React from 'react';
import { useProductContext } from './ProductContext';

export default function CartPage({ goToPayment }: { goToPayment: () => void }) {
  const { cart } = useProductContext();

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );

  return (
    <div
      className="bg-gray-800 p-6 sm:p-8 text-gray-100 max-w-3xl sm:max-w-5xl mx-auto rounded-lg"
      data-testid="cart-page"
    >
      <h2
        className="text-4xl font-bold mb-8 text-center border-b border-gray-600 pb-4"
        data-testid="cart-title"
      >
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p
          className="text-gray-300 text-center"
          data-testid="cart-empty-message"
        >
          Your cart is empty.
        </p>
      ) : (
        <>
          <ul className="space-y-4" data-testid="cart-list">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg border border-gray-100"
                data-testid={`cart-item-${index}`}
              >
                <div data-testid={`cart-item-info-${index}`}>
                  <span
                    className="block font-semibold"
                    data-testid={`cart-item-name-${index}`}
                  >
                    {item.name}
                  </span>

                  <span
                    className="block text-gray-300"
                    data-testid={`cart-item-quantity-price-${index}`} // wrapper
                  >
                    <span data-testid={`cart-item-quantity-${index}`}>
                      {item.cartQuantity}
                    </span>
                    <span>{' x '}</span>
                    <span
                      data-testid={`cart-item-price-currency-${index}`}
                    >
                      €
                    </span>
                    <span
                      data-testid={`cart-item-price-value-${index}`}
                    >
                      {item.price.toFixed(2)}
                    </span>
                  </span>
                </div>

                <span
                  className="font-bold text-lg text-gray-100"
                  data-testid={`cart-item-total-${index}`} // wrapper
                >
                  <span
                    data-testid={`cart-item-total-currency-${index}`}
                  >
                    €
                  </span>
                  <span
                    data-testid={`cart-item-total-value-${index}`}
                  >
                    {(item.price * item.cartQuantity).toFixed(2)}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6" data-testid="cart-summary">
            <p
              className="text-xl text-center font-semibold"
              data-testid="cart-total"
            >
              <span data-testid="cart-total-label">Total: €</span>
              <span data-testid="cart-total-value">
                {totalAmount.toFixed(2)}
              </span>
            </p>

            <button
              onClick={goToPayment}
              className="w-full mt-4 py-3 rounded-lg bg-indigo-600 text-gray-100 font-semibold hover:bg-indigo-700 transition"
              data-testid="cart-go-to-payment"
            >
              Go to Payments
            </button>
          </div>
        </>
      )}
    </div>
  );
}
