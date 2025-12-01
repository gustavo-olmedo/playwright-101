import React from 'react';

const SocialLinks = () => {
  return (
    <div id="socialLinks" className="flex justify-center space-x-4">
      <a
        id="linkedinLink"
        href="https://www.linkedin.com/in/brunomrs"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 rounded px-3 py-2 transition flex items-center"
      >
        <svg
          className="w-8 h-8 text-gray-100"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19.52 3H4.48C3.6 3 3 3.6 3 4.48v15.04c0 .88.6 1.48 1.48 1.48h15.04c.88 0 1.48-.6 1.48-1.48V4.48c0-.88-.6-1.48-1.48-1.48zM8.44 20.44H5.56v-8.88h2.88v8.88zm-1.44-10.12c-.96 0-1.76-.8-1.76-1.76s.8-1.76 1.76-1.76c.96 0 1.76.8 1.76 1.76s-.8 1.76-1.76 1.76zm12 10.12h-2.88v-4.8c0-1.12-.04-2.08-1.24-2.08-1.24 0-1.44.96-1.44 1.92v4.96h-2.88v-8.88h2.76v1.22h.04c.38-.72 1.32-1.48 2.72-1.48 2.88 0 3.42 1.92 3.42 4.42v4.72z" />
        </svg>
      </a>
      <a
        id="githubLink"
        href="https://github.com/brunomachadors"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 rounded px-3 py-2 transition flex items-center"
      >
        <svg
          className="w-8 h-8 text-gray-100"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.306 3.438 9.801 8.207 11.387.6.113.793-.26.793-.578v-2.069c-3.338.723-4.043-1.604-4.043-1.604-.545-1.382-1.331-1.749-1.331-1.749-1.085-.743.082-.728.082-.728 1.203.084 1.835 1.237 1.835 1.237 1.072 1.827 2.812 1.298 3.496.995.109-.776.419-1.298.764-1.597-2.664-.303-5.466-1.331-5.466-5.928 0-1.31.469-2.379 1.236-3.219-.124-.303-.537-1.528.118-3.176 0 0 1.008-.322 3.304 1.235a11.405 11.405 0 0 1 3.006-.4 11.366 11.366 0 0 1 3.006.4c2.296-1.557 3.304-1.235 3.304-1.235.656 1.648.242 2.873.118 3.176.767.84 1.236 1.91 1.236 3.219 0 4.609-2.808 5.626-5.482 5.921.43.371.813 1.104.813 2.222v3.293c0 .319.192.692.798.576C20.564 21.802 24 17.307 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      </a>
      <a
        id="emailLink"
        href="mailto:brunomachadors@gmail.com"
        className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 rounded px-3 py-2 transition flex items-center"
      >
        <svg
          className="w-8 h-8 text-gray-100"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 330.001 330.001"
        >
          <path d="M173.871,177.097c-2.641,1.936-5.756,2.903-8.87,2.903c-3.116,0-6.23-0.967-8.871-2.903L30,84.602 L0.001,62.603L0,275.001c0.001,8.284,6.716,15,15,15L315.001,290c8.285,0,15-6.716,15-14.999V62.602l-30.001,22L173.871,177.097z"></path>
          <polygon points="165.001,146.4 310.087,40.001 19.911,40 "></polygon>
        </svg>
      </a>
      <a
        id="mediumLink"
        href="https://medium.com/@brunomachadoricardosilva"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 rounded px-3 py-2 transition flex items-center"
      >
        <span className="text-3xl font-semibold text-gray-100">M</span>
      </a>
    </div>
  );
};

export default SocialLinks;
