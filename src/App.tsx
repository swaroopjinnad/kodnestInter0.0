import React from 'react';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to KodNest</h1>
          <p className="text-gray-600">Your learning journey starts here.</p>
        </div>
      </div>
    </div>
  );
};

export default App; 