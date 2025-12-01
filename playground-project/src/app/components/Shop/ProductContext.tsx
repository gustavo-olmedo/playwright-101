'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipo para representar um produto
interface Product {
  name: string;
  price: number;
  quantity: number;
}

// Tipo para o carrinho
interface CartItem extends Product {
  cartQuantity: number;
}

// Tipo para uma ordem concluída
interface Order {
  items: CartItem[];
  total: number;
  date: string;
  paymentMethod: string;
}

// Tipo para o contexto
interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addProduct: (product: Product) => void;
  updateProduct: (productName: string, newQuantity: number) => void;
  addToCart: (productName: string) => void;
  completePurchase: (paymentMethod: string) => void;
}

// Criando o contexto
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Hook para usar o contexto
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      'useProductContext deve ser usado dentro de um ProductProvider'
    );
  }
  return context;
};

// Provider para encapsular os componentes
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([
    { name: 'Lightsaber (Star Wars)', price: 9999.99, quantity: 2 },
    { name: 'Giant Rubber Duck', price: 49.99, quantity: 15 },
    { name: 'Shark Repellent', price: 299.99, quantity: 5 },
    {
      name: 'Aluminum Helmet for Protection Against Alien Mind Control',
      price: 19.99,
      quantity: 50,
    },
    { name: 'Sonic Screwdriver (Doctor Who)', price: 79.99, quantity: 7 },
    { name: 'Bacon-Scented Candle', price: 14.99, quantity: 20 },
    { name: 'Invisible Pen', price: 9.99, quantity: 0 },
    { name: 'Dog Sunglasses', price: 24.99, quantity: 12 },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Adicionar um novo produto ao estoque
  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  // Atualizar a quantidade de um produto no estoque
  const updateProduct = (productName: string, newQuantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.name === productName
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  };

  // Adicionar produto ao carrinho
  const addToCart = (productName: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.name === productName
          ? { ...product, quantity: Math.max(product.quantity - 1, 0) }
          : product
      )
    );

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === productName);

      if (existingItem) {
        return prevCart.map((item) =>
          item.name === productName
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }

      const product = products.find((p) => p.name === productName);
      if (!product) return prevCart;

      return [...prevCart, { ...product, cartQuantity: 1 }];
    });
  };

  // Concluir a compra
  const completePurchase = (paymentMethod: string) => {
    if (cart.length === 0) return;

    // Calcula o total da compra
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.cartQuantity,
      0
    );

    // Cria uma nova ordem
    const newOrder: Order = {
      items: [...cart],
      total,
      date: new Date().toLocaleString(),
      paymentMethod,
    };

    // Atualiza o estado de ordens e limpa o carrinho
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setCart([]);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        cart,
        orders,
        addProduct,
        updateProduct,
        addToCart,
        completePurchase,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
