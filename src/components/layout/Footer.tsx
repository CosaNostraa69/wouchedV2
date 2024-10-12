import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">FreelanceMatch</h2>
            <p className="text-gray-400">Connecting talent with opportunity</p>
          </div>
          <nav className="mb-6 md:mb-0">
            <ul className="flex flex-wrap justify-center space-x-6">
              <li><a href="#" className="hover:text-blue-400 transition duration-300">Home</a></li>
              <li><a href="#" className="hover:text-green-400 transition duration-300">Find Work</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Hire Freelancers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-300">About Us</a></li>
            </ul>
          </nav>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition duration-300"><Facebook size={24} /></a>
            <a href="#" className="hover:text-blue-400 transition duration-300"><Twitter size={24} /></a>
            <a href="#" className="hover:text-pink-400 transition duration-300"><Instagram size={24} /></a>
            <a href="#" className="hover:text-blue-400 transition duration-300"><Linkedin size={24} /></a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FreelanceMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;