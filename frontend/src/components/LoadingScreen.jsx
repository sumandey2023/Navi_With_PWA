import React, { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [progress, setProgress] = useState(0);

  const messages = [
    "Initializing...",
    "Loading AI models...",
    "Preparing your assistant...",
    "Almost ready...",
    "Welcome to Navi!",
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setLoadingMessage((prev) => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#212121] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center z-50">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo/Title */}
        <div className="mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
            <h1 className="relative text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Navi
            </h1>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex flex-col items-center space-y-6">
          {/* Spinning loader */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-spin border-t-blue-500"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-500"></div>
            <div className="absolute inset-2 w-12 h-12 border-2 border-gray-700 rounded-full animate-spin border-t-blue-300"></div>
          </div>

          {/* Loading text with animation */}
          <div className="space-y-3">
            <p className="text-xl text-gray-300 font-light animate-pulse">
              {loadingMessage}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-10 w-80 mx-auto">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {Math.round(Math.min(progress, 100))}% complete
          </p>
        </div>

        {/* Additional loading message */}
        <p className="mt-6 text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          Setting up your personalized AI chat experience...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
