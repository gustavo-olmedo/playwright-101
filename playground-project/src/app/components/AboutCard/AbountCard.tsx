import React from 'react';
import SocialLinks from '../SocialLinks/SocialLinks';

const AboutCard = () => {
  return (
    <div
      id="aboutCard"
      className="bg-gray-800 border border-gray-100 p-8 rounded-lg shadow-lg max-w-3xl w-full"
    >
      <h1
        id="aboutTitle"
        className="text-3xl font-bold text-gray-100 mb-6 text-center"
      >
        About Me
      </h1>

      <div id="aboutDescription" className="mb-8 text-gray-300 text-center">
        <p>I’m a test engineer passionate about technology</p>
        <p>and a mentor in the field of test automation.</p>
      </div>

      <SocialLinks />
    </div>
  );
};

export default AboutCard;
