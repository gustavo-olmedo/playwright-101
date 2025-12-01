import React from 'react';
import AboutCard from '../components/AboutCard/AbountCard';
import AdditionalInfo from '../components/AdditionalInfo/AdditionalInfo,';

const About = () => {
  return (
    <div
      id="aboutContainer"
      className="min-h-screen flex flex-col justify-start items-center bg-gray-800 p-8"
    >
      <AboutCard />
      <AdditionalInfo />
    </div>
  );
};

export default About;
