import Image from 'next/image';
import React from 'react';

function HomeBanner() {
  return (
    <div className="relative w-11/12 max-w-4xl h-60 mx-auto overflow-hidden mb-6 ">
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dtglidvcw/image/upload/v1721943129/BUGBUSTER/smsccp4wsl8o6v4tmmfb.jpg"
          alt="Bug Buster Mentoring Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
}

export default HomeBanner;
