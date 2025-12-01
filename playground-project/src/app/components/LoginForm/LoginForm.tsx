'use client'; // Indica que é um componente do cliente

import React, { useState } from 'react';
import Button from '../Buttons/Buttons';

type LoginFormProps = {
  onSubmit: (username: string, password: string) => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div
      id="loginContainer"
      className="flex justify-center items-center bg-gray-800 w-full mt-10"
    >
      <div
        id="loginBox"
        className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border"
      >
        <h2
          id="loginTitle"
          className="text-2xl font-bold mb-6 text-gray-100 text-center"
        >
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-100"
            >
              Username
            </label>
            <input
              id="usernameInput"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Type your username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-100"
            >
              Password
            </label>
            <input
              id="passwordInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Type your password"
              required
            />
          </div>
          <div className="flex justify-center w-full">
            <Button
              id="submitButton"
              type="submit"
              color="gray-100"
              textColor="gray-800"
              borderColor="gray-300"
              hoverColor="gray-200"
              focusColor="gray-500"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
