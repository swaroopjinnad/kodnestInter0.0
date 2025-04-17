import React from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-md rounded-lg px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-yellow-500">KodNest</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          {/* Skeleton Loading Tabs */}
          {['Home', 'Courses', 'Practice', 'Contest'].map((item) => (
            <div key={item} className="relative group">
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded mb-1"></div>
              <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-yellow-500"></div>
            </div>
          ))}

          {/* Face to Face Interview Tab */}
          <div className="relative group">
            <div className="flex items-center space-x-2 cursor-pointer transform transition hover:scale-105">
              <VideoCameraIcon className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-gray-800 whitespace-nowrap">
                Face to Face Interview
              </span>
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
                New
              </span>
            </div>
            <div className="absolute inset-0 rounded-lg bg-yellow-100 opacity-0 group-hover:opacity-10 transition-opacity -z-10"></div>
            <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-yellow-500"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 