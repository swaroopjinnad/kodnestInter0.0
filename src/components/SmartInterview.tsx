import React, { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface SmartInterviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const SmartInterview: React.FC<SmartInterviewProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && !recognition.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
      }
    }
  }, []);

  // Setup camera when modal opens
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
      // Reset state when opening
      setIsFirstQuestion(true);
      setIsWaitingForAnswer(false);
      setMessages([]);
      setCurrentQuestion('Tell me about yourself');
      setTranscript('');
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [isOpen]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startListening = () => {
    setIsListening(true);
    setIsWaitingForAnswer(true);
    if (recognition.current) {
      recognition.current.start();
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  // Setup speech recognition handlers
  useEffect(() => {
    if (!recognition.current) return;

    recognition.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.current.onend = () => {
      if (isListening) {
        recognition.current.start();
      }
    };
  }, [isListening]);

  const sendToGPT = async (userResponse: string) => {
    try {
      // Add user's response to messages
      const updatedMessages = [
        ...messages,
        { role: 'user' as const, content: userResponse }
      ];
      setMessages(updatedMessages);

      const response = await fetch('http://localhost:3001/interview/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript: userResponse
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from interview service');
      }

      const { nextQuestion, suggestion } = data;
      
      // First add the feedback
      setMessages(prev => [
        ...prev,
        { role: 'assistant' as const, content: `Feedback: ${suggestion}` }
      ]);

      // Then add the next question as a separate message
      setMessages(prev => [
        ...prev,
        { role: 'assistant' as const, content: nextQuestion }
      ]);
      
      setCurrentQuestion(nextQuestion);
      setTranscript('');
      setIsWaitingForAnswer(false);
    } catch (error) {
      console.error('Error in interview:', error);
      setIsWaitingForAnswer(false);
      setCurrentQuestion('Sorry, there was an error. Please try again.');
    }
  };

  const handleNext = async () => {
    if (isFirstQuestion) {
      // Starting the interview
      setIsFirstQuestion(false);
      setMessages([
        { role: 'assistant' as const, content: currentQuestion }
      ]);
      startListening();
    } else if (isListening) {
      // User finished speaking, process their answer
      stopListening();
      if (transcript.trim()) {
        await sendToGPT(transcript);
      }
    } else if (!isWaitingForAnswer) {
      // Ready for next question, start listening
      startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="flex w-full h-[90vh] max-w-7xl gap-4">
        {/* Left side - Camera View */}
        <div className="relative flex-grow bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Current Question Display */}
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
            <h2 className="text-xl font-semibold mb-2">Current Question:</h2>
            <p>{currentQuestion}</p>
          </div>

          <div className="absolute inset-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Red divider line */}
          <div className="absolute bottom-32 left-0 right-0 h-0.5 bg-red-600"></div>
          
          {/* Transcript Display */}
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <p className="text-white text-sm bg-black bg-opacity-50 p-2 rounded">
              {isListening ? (transcript || 'Listening...') : 'Click Next to continue'}
            </p>
          </div>

          {/* Control buttons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
              onClick={handleNext}
              className="w-32 h-12 rounded-full bg-red-500 hover:bg-red-600 
                       transition-all duration-300 flex items-center justify-center"
            >
              <span className="text-white font-medium">
                {isFirstQuestion ? 'Start' : isListening ? 'Done' : 'Next'}
              </span>
            </button>
          </div>

          {/* Close button */}
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

        {/* Right side - Conversation Log */}
        <div className="hidden md:block w-96 bg-white rounded-2xl shadow-lg p-4">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 sticky top-0 bg-white pb-2 border-b">
              Interview Progress
            </h2>
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-4 py-4"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'assistant'
                      ? message.content.startsWith('Feedback:')
                        ? 'bg-green-50 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                      : 'bg-blue-50 text-gray-800'
                  }`}
                >
                  <p className="text-xs font-medium mb-1">
                    {message.role === 'assistant' 
                      ? message.content.startsWith('Feedback:') 
                        ? 'Feedback'
                        : 'Interviewer'
                      : 'You'}:
                  </p>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
              {isListening && transcript && (
                <div className="p-3 rounded-lg bg-gray-50 text-gray-500 italic">
                  <p className="text-xs font-medium mb-1">Typing...</p>
                  <p className="text-sm">{transcript}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartInterview;