'use client';

import React from 'react';
import { useProductContext } from './ProductContext';

export default function OrdersPage() {
  const { orders } = useProductContext();

  return (
    <div
      className="bg-gray-800 p-6 sm:p-8 text-gray-100 max-w-3xl sm:max-w-5xl mx-auto rounded-lg"
      data-testid="orders-page"
    >
      <h2
        className="text-4xl font-bold mb-8 text-center border-b border-gray-600 pb-4"
        data-testid="orders-title"
      >
        Purchase Orders
      </h2>

      {orders.length === 0 ? (
        <p
          className="text-gray-300 text-center"
          data-testid="orders-empty-message"
        >
          No orders registered.
        </p>
      ) : (
        <ul className="space-y-8" data-testid="orders-list">
          {orders.map((order, index) => (
            <li
              key={index}
              className="bg-gray-700 p-4 rounded-lg border border-gray-100"
              data-testid={`order-${index}`}
            >
              <p
                className="text-lg font-semibold mb-2"
                data-testid={`order-date-${index}`}
              >
                Date: {order.date}
              </p>

              <p
                className="text-gray-300 mb-4"
                data-testid={`order-payment-${index}`}
              >
                Payment Method: {order.paymentMethod}
              </p>

              <ul
                className="space-y-2"
                data-testid={`order-items-${index}`}
              >
                {order.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex justify-between items-center"
                    data-testid={`order-item-${index}-${itemIndex}`}
                  >
                    <span
                      data-testid={`order-item-name-${index}-${itemIndex}`}
                    >
                      {item.cartQuantity} x {item.name}
                    </span>

                    <span
                      data-testid={`order-item-total-${index}-${itemIndex}`} // wrapper
                    >
                      <span
                        data-testid={`order-item-total-currency-${index}-${itemIndex}`}
                      >
                        €
                      </span>
                      <span
                        data-testid={`order-item-total-value-${index}-${itemIndex}`}
                      >
                        {(item.price * item.cartQuantity).toFixed(2)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className="mt-4 text-right font-bold"
                data-testid={`order-total-${index}`} // wrapper
              >
                <span
                  data-testid={`order-total-label-${index}`}
                >
                  Total: €
                </span>
                <span
                  data-testid={`order-total-value-${index}`}
                >
                  {order.total.toFixed(2)}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
