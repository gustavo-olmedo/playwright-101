'use client'; // Indica que é um componente do cliente

import React from 'react';
import { InstructionsForm } from '../components/Instructions/Instructions';
import Form from '../components/Form/Form';

export default function FormPage() {
  return (
    <div
      id="formPage"
      className="min-h-screen bg-gray-800 pt-2 px-4 sm:px-6 lg:px-8"
    >
      <InstructionsForm />
      <main className="flex flex-col items-center justify-start mt-6">
        <Form />
      </main>
    </div>
  );
}
