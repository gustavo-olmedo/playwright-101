import React from 'react';

function SubmitedForm() {
  return (
    <div className="min-h-screen bg-gray-800 flex items-start justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-100">
        <div className="text-center text-gray-100">
          <strong className="font-bold text-2xl mb-4">Success!</strong>
          <p className="text-lg">The form has been submitted successfully.</p>
        </div>
      </div>
    </div>
  );
}

export default SubmitedForm;
