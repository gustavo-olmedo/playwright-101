import React from 'react';

const AdditionalInfo = () => {
  return (
    <div
      id="additionalInfo"
      className="mt-8 max-w-3xl w-full text-center text-gray-300"
    >
      <p>Wanna know more? Access:</p>
      <p className="m-10">
        <a
          id="bugBusterLink"
          href="https://brunomachadors.github.io/bugbuster"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:bg-gray-100 hover:text-gray-800 rounded px-3 py-2 transition border-2 border-gray-300"
        >
          <b>Bug Buster</b>
        </a>
      </p>
    </div>
  );
};

export default AdditionalInfo;
