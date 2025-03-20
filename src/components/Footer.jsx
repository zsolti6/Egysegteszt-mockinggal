import React from "react";

export const FooterComponent = () => {
  return (
    <footer className="mt-auto py-3 bg-purple-800 text-white text-center color-bg1">
      <div className="container">
        <p className="mb-0">
          Elérhetőség: @
          <a href="https://github.com/pixel-pirates" className="text-white hover:text-gray-300">
            Pixel Pirates
          </a>
        </p>
      </div>
    </footer>
  );
};