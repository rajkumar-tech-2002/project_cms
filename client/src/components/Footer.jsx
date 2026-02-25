import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 mt-auto">
      <div className="container mx-auto text-center px-4">
        <p className="text-gray-500 mb-0 text-sm">
          &copy; {new Date().getFullYear()} Canteen Management System.
        </p>
        <p className="text-gray-500 mb-0 text-xs italic">
          Developed by: Rajkumar Anbazhagan
        </p>
      </div>
    </footer>
  );
};

export default Footer;
