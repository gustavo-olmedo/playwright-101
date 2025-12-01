'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  if (!hasMounted) {
    return (
      <div className="absolute top-0 left-0 flex items-center md:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <FontAwesomeIcon icon={faBars} className="block h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-0 left-0 flex items-center md:hidden">
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-center"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Toggle main menu</span>
          <FontAwesomeIcon
            icon={isOpen ? faTimes : faBars}
            className="block h-6 w-6"
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-gray-800 z-40 ${
          isOpen ? 'block' : 'hidden'
        }`}
        id="mobile-menu"
      >
        <div className="flex flex-col items-center pt-16 space-y-6">
          <div className="px-2 pt-2 pb-3 space-y-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-6 py-4 rounded-md text-2xl text-center"
            >
              HOME
            </Link>
            <Link
              href="/login"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-6 py-4 rounded-md text-2xl text-center"
            >
              LOGIN
            </Link>
            <Link
              href="/form"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-6 py-4 rounded-md text-2xl text-center"
            >
              FORM
            </Link>
            <Link
              href="/table"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-6 py-4 rounded-md text-2xl text-center"
            >
              TABLE
            </Link>
            <Link
              href="/tasks"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-6 py-4 rounded-md text-2xl text-center"
            >
              TASKS
            </Link>
            <Link
              href="/store"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-6 py-4 rounded-md text-2xl text-center"
            >
              STORE
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-6 py-4 rounded-md text-2xl text-center"
            >
              ABOUT
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMobile;
