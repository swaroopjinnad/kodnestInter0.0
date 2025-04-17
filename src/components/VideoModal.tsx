import React, { useEffect, useRef, useState } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    if (isOpen) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="flex w-full h-[90vh] max-w-7xl gap-4">
        {/* Left side - Camera View */}
        <div className="relative flex-grow bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Red divider line */}
          <div className="absolute bottom-20 left-0 right-0 h-0.5 bg-red-600"></div>
          
          {/* Control button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`w-32 h-12 rounded-full transition-all duration-300 flex items-center justify-center
                ${isRecording 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-500 hover:bg-red-600'}`}
            >
              <span className="text-white font-medium">
                {isRecording ? 'Stop' : 'Start'}
              </span>
            </button>
          </div>

          {/* Close button - top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2
                     hover:bg-opacity-70 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Right side - Info Panel */}
        <div className="hidden md:block w-80 bg-white rounded-2xl shadow-lg p-4">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Interview Info</h2>
            
            {/* Status indicator */}
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isRecording ? 'Recording in progress' : 'Ready to start'}
              </span>
            </div>

            {/* Tips section */}
            <div className="flex-grow space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Ensure good lighting</li>
                  <li>• Check your background</li>
                  <li>• Speak clearly</li>
                  <li>• Maintain eye contact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal; 