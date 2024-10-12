import React from 'react';
import { Search, MapPin } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-black to-gray-800">
      <div className="container mx-auto px-4 relative z-10 h-[600px] flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            <span className="text-blue-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Where companies</span>{' '}
            <span className="text-green-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">and freelancers</span>{' '}
            <span className="text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">find the perfect fit</span>
          </h1>
          <p className="text-lg sm:text-xl text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            Find the right talent to power your project
          </p>
        </div>

        <div className="w-full max-w-[1200px] bg-transparent border border-gray-600 rounded-lg shadow-lg p-6 backdrop-filter backdrop-blur-lg">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-2/3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder='Try "Java", "Marketing Consultant"...'
                  className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
                />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Project location (ex: Paris, Lyon...)"
                  className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-md whitespace-nowrap font-semibold text-lg shadow-md">
                Find a freelancer
              </button>
              <span className="text-white">or</span>
              <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold text-lg">
                Post a project
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;