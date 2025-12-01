'use client';

import React, { useState } from 'react';
import { useProductContext } from './ProductContext';

export default function InventoryManagement() {
  const { products, addProduct, updateProduct } = useProductContext();

  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !productPrice || !productQuantity) {
      alert('Please fill in all fields!');
      return;
    }

    const newProduct = {
      name: productName,
      price: parseFloat(productPrice),
      quantity: parseInt(productQuantity),
    };

    addProduct(newProduct);

    setProductName('');
    setProductPrice('');
    setProductQuantity('');
  };

  const handleAdjustQuantity = (productName: string, adjustment: number) => {
    const product = products.find((p) => p.name === productName);
    if (product) {
      const newQuantity = Math.max(product.quantity + adjustment, 0);
      updateProduct(productName, newQuantity);
    }
  };

  return (
    <div
      className="bg-gray-800 p-6 sm:p-8 text-gray-100 max-w-3xl sm:max-w-5xl mx-auto rounded-lg"
      data-testid="inventory-page"
    >
      <h2
        className="text-4xl font-bold mb-8 text-center border-b border-gray-600 pb-4"
        data-testid="inventory-title"
      >
        Inventory Management
      </h2>

      {/* Form to add products */}
      <form
        onSubmit={handleAddProduct}
        className="mb-8"
        data-testid="inventory-form"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="p-4 bg-gray-700 text-gray-100 rounded-lg border border-gray-100"
            data-testid="inventory-input-name"
          />
          <input
            type="number"
            placeholder="Price (€)"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="p-4 bg-gray-700 text-gray-100 rounded-lg border border-gray-100"
            data-testid="inventory-input-price"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            className="p-4 bg-gray-700 text-gray-100 rounded-lg border border-gray-100"
            data-testid="inventory-input-quantity"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-gray-100 py-3 rounded-lg hover:bg-indigo-700 transition"
          data-testid="inventory-submit-button"
        >
          Add Product
        </button>
      </form>

      {/* Product List in Stock */}
      {products.length === 0 ? (
        <p
          className="text-gray-300 text-center"
          data-testid="inventory-empty"
        >
          No products in stock.
        </p>
      ) : (
        <ul className="space-y-4" data-testid="inventory-product-list">
          {products.map((product, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg border border-gray-100"
              data-testid={`inventory-product-${index}`}
            >
              {/* Product Information */}
              <div className="w-full sm:w-auto text-center sm:text-left">
                <span
                  className="block font-semibold text-lg text-gray-100"
                  data-testid={`inventory-product-name-${index}`}
                >
                  {product.name}
                </span>

                <span
                  className="block text-gray-300"
                  data-testid={`inventory-product-price-wrapper-${index}`}
                >
                  <span
                    data-testid={`inventory-product-price-label-${index}`}
                  >
                    Price: €
                  </span>
                  <span
                    data-testid={`inventory-product-price-value-${index}`}
                  >
                    {product.price.toFixed(2)}
                  </span>
                </span>
              </div>

              {/* Quantity and Buttons */}
              <div className="flex items-center mt-4 sm:mt-0 space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleAdjustQuantity(product.name, -1)
                    }
                    className="px-4 py-2 bg-red-600 text-gray-100 rounded-lg hover:bg-red-700 transition"
                    data-testid={`inventory-product-decrease-${index}`}
                  >
                    -
                  </button>
                  <span
                    className="text-2xl font-bold text-gray-100 text-center"
                    style={{ minWidth: '2rem' }}
                    data-testid={`inventory-product-quantity-${index}`}
                  >
                    {product.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleAdjustQuantity(product.name, 1)
                    }
                    className="px-4 py-2 bg-green-600 text-gray-100 rounded-lg hover:bg-green-700 transition"
                    data-testid={`inventory-product-increase-${index}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
