'use client';

import React from 'react';
import { useProductContext } from './ProductContext';

export default function CatalogPage() {
  const { products, addToCart } = useProductContext();

  return (
    <div
      className="bg-gray-800 p-6 sm:p-8 text-gray-100 max-w-3xl sm:max-w-5xl mx-auto rounded-lg"
      data-testid="catalog-page"
    >
      <h2
        className="text-4xl font-bold mb-8 text-center border-b border-gray-600 pb-4"
        data-testid="catalog-title"
      >
        Product Catalog
      </h2>

      {products.length === 0 ? (
        <p
          className="text-gray-300 text-center"
          data-testid="catalog-empty-message"
        >
          No products available at the moment.
        </p>
      ) : (
        <ul className="space-y-4" data-testid="catalog-list">
          {products.map((product, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg border border-gray-100"
              data-testid={`catalog-item-${index}`}
            >
              {/* Product Information */}
              <div
                className="text-center sm:text-left"
                data-testid={`catalog-item-info-${index}`}
              >
                <span
                  className="block font-semibold text-lg"
                  data-testid={`catalog-item-name-${index}`}
                >
                  {product.name}
                </span>

                <span
                  className="block text-gray-300"
                  data-testid={`catalog-item-price-${index}`} // wrapper
                >
                  <span
                    data-testid={`catalog-item-price-label-${index}`}
                  >
                    Price: €
                  </span>
                  <span
                    data-testid={`catalog-item-price-value-${index}`}
                  >
                    {product.price.toFixed(2)}
                  </span>
                </span>
              </div>

              {/* Quantity and Button */}
              <div
                className="flex flex-col items-center mt-4 sm:mt-0 space-y-2"
                data-testid={`catalog-item-actions-${index}`}
              >
                {/* Quantity Highlight */}
                <span
                  className="text-2xl font-bold text-gray-100"
                  data-testid={`catalog-item-quantity-${index}`}
                >
                  {product.quantity} units
                </span>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product.name)}
                  disabled={product.quantity === 0}
                  className={`px-4 py-2 rounded-lg transition min-w-[12rem] text-center ${
                    product.quantity > 0
                      ? 'bg-indigo-600 text-gray-100 hover:bg-indigo-700'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                  data-testid={`catalog-item-add-button-${index}`}
                >
                  {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
