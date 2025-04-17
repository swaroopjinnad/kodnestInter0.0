import React, { useState } from 'react';
import SmartInterview from './SmartInterview';

const Navbar: React.FC = () => {
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-yellow-500">KodNest</span>
            </div>

            {/* Interview Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsInterviewOpen(true)}
                className="flex items-center space-x-2 px-6 py-2 rounded-full
                         bg-gradient-to-r from-red-500 to-red-600
                         hover:from-red-600 hover:to-red-700
                         text-white shadow-md hover:shadow-lg
                         transform hover:scale-105 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Start Interview</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SmartInterview 
        isOpen={isInterviewOpen}
        onClose={() => setIsInterviewOpen(false)}
      />
    </>
  );
};

export default Navbar; 