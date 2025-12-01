'use client'; // Indica que é um componente do cliente
import React from 'react';
import NavbarMobile from './NavbarMobile';
import NavbarWeb from './NavbarWeb';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <NavbarMobile />
          <div className="flex-1 flex items-center justify-center md:justify-around">
            <NavbarWeb />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
