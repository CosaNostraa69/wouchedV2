import React from 'react';
import Image from 'next/image';
import { Search, MapPin } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src="/images/download (1).svg"
        alt="Background"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        className="z-0"
      />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8 mx-auto w-[1320px] h-[393px] mt-8"> {/* Added margin-top here */}
          <div className="w-full lg:w-1/2 h-full px-6 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Where companies and freelancers find the perfect fit
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Find the right talent to power your project
            </p>
          </div>
          
          <div className="w-full lg:w-1/2 h-full px-6 flex justify-center items-center">
            <Image
              src="/images/S.png"
              alt="Team of professionals"
              width={600}
              height={400}
              style={{ objectFit: 'contain' }}
              quality={100}
              className="rounded-lg"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8 max-w-full mx-auto w-[1320px]">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder='Try "Java", "Marketing Consultant"...'
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Project location (ex: Paris, Lyon...)"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md whitespace-nowrap font-semibold">
              Find a freelancer
            </button>
            <div className="flex-1 text-center md:text-left">
              <a href="#" className="text-red-500 hover:underline font-semibold">
                or Post a project
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
