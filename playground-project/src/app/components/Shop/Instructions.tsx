import React from 'react';
import {
  FaStore,
  FaShoppingCart,
  FaCreditCard,
  FaWarehouse,
  FaClipboardList,
} from 'react-icons/fa';

export default function Instructions() {
  return (
    <div
      id="instructionsContainer"
      className="bg-gray-800 p-6 text-gray-100 max-w-3xl sm:max-w-5xl mx-auto"
      data-testid="instructions-page"
    >
      <h2
        id="instructionsHeader"
        className="text-4xl font-bold mb-8 text-center border-b border-gray-600 pb-4"
        data-testid="instructions-title"
      >
        Instructions
      </h2>

      <p
        className="mb-8 text-lg text-gray-300 text-center"
        data-testid="instructions-description"
      >
        Learn how to make the most of all the features in our application with
        these quick and easy-to-follow instructions. Each section is designed to
        make your experience even better!
      </p>

      <div className="flex flex-col space-y-8" data-testid="instructions-list">
        
        {/* Inventory */}
        <div
          className="flex items-center space-x-6 border border-gray-100 p-6 rounded-lg"
          data-testid="instructions-section-inventory"
        >
          <FaWarehouse
            className="text-7xl text-gray-100"
            data-testid="instructions-icon-inventory"
          />
          <div>
            <h3
              className="text-2xl font-semibold text-gray-100 mb-2"
              data-testid="instructions-inventory-title"
            >
              Inventory
            </h3>
            <p
              className="text-gray-300"
              data-testid="instructions-inventory-text"
            >
              Manage the store’s inventory and register new products by defining
              their name, price, and initial quantity.
            </p>
          </div>
        </div>

        {/* Catalog */}
        <div
          className="flex items-center space-x-6 border border-gray-100 p-6 rounded-lg"
          data-testid="instructions-section-catalog"
        >
          <FaStore
            className="text-7xl text-gray-100"
            data-testid="instructions-icon-catalog"
          />
          <div>
            <h3
              className="text-2xl font-semibold text-gray-100 mb-2"
              data-testid="instructions-catalog-title"
            >
              Catalog
            </h3>
            <p
              className="text-gray-300"
              data-testid="instructions-catalog-text"
            >
              Browse the available products, view details, and add them to your
              cart for purchase.
            </p>
          </div>
        </div>

        {/* Cart */}
        <div
          className="flex items-center space-x-6 border border-gray-100 p-6 rounded-lg"
          data-testid="instructions-section-cart"
        >
          <FaShoppingCart
            className="text-7xl text-gray-100"
            data-testid="instructions-icon-cart"
          />
          <div>
            <h3
              className="text-2xl font-semibold text-gray-100 mb-2"
              data-testid="instructions-cart-title"
            >
              Cart
            </h3>
            <p
              className="text-gray-300"
              data-testid="instructions-cart-text"
            >
              View the items you’ve added. Quantities can be updated only inside
              the Catalog. When ready, proceed to checkout.
            </p>
          </div>
        </div>

        {/* Payment */}
        <div
          className="flex items-center space-x-6 border border-gray-100 p-6 rounded-lg"
          data-testid="instructions-section-payment"
        >
          <FaCreditCard
            className="text-7xl text-gray-100"
            data-testid="instructions-icon-payment"
          />
          <div>
            <h3
              className="text-2xl font-semibold text-gray-100 mb-2"
              data-testid="instructions-payment-title"
            >
              Payment
            </h3>
            <p
              className="text-gray-300"
              data-testid="instructions-payment-text"
            >
              You’ll see a full summary of the cart items. Select a payment
              method to complete your purchase.
            </p>
          </div>
        </div>

        {/* Orders */}
        <div
          className="flex items-center space-x-6 border border-gray-100 p-6 rounded-lg"
          data-testid="instructions-section-orders"
        >
          <FaClipboardList
            className="text-7xl text-gray-100"
            data-testid="instructions-icon-orders"
          />
          <div>
            <h3
              className="text-2xl font-semibold text-gray-100 mb-2"
              data-testid="instructions-orders-title"
            >
              Orders
            </h3>
            <p
              className="text-gray-300"
              data-testid="instructions-orders-text"
            >
              Review your purchase history, including date, items, total, and
              payment method.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
