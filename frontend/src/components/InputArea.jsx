import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";

const InputArea = ({
  userInput,
  handleInputChange,
  handleKeyPress,
  handleSendClick,
  isLoading,
  inputRef,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 100) + "px";
    }
  }, [userInput]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (isMobile) {
      // On mobile: Enter always creates new line, no sending
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        // Insert newline at cursor position
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText =
          userInput.substring(0, start) + "\n" + userInput.substring(end);

        // Trigger onChange event
        const event = {
          target: {
            value: newText,
            selectionStart: start + 1,
            selectionEnd: start + 1,
          },
        };
        handleInputChange(event);

        // Set cursor position after newline
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    } else {
      // On desktop: use original behavior
      handleKeyPress(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading && userInput.trim()) {
      handleSendClick(e);
    }
  };

  return (
    <div className="bg-[#212121] border-t border-gray-700/50 min-h-0 w-full relative">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 w-full relative">
        {/* Main Input Container */}
        <div className="relative">
          <form onSubmit={handleSubmit} className="relative">
            <div
              className={`
                relative bg-[#2f2f2f] border rounded-xl transition-all duration-200 ease-out
                ${
                  isFocused
                    ? "border-blue-500/50 shadow-md shadow-blue-500/10"
                    : "border-gray-600/30 hover:border-gray-500/50"
                }
                ${isLoading ? "opacity-70" : ""}
                ${isMobile ? "shadow-none" : ""}
                w-full overflow-hidden
              `}
            >
              {/* Input Row */}
              <div className="flex items-center gap-3 p-3 sm:p-4 w-full relative">
                {/* Text Input */}
                <div className="flex-1 relative bg-transparent">
                  <textarea
                    ref={inputRef}
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Message Navi..."
                    className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed pr-2 border-none focus:bg-transparent"
                    rows="1"
                    style={{ minHeight: "20px", maxHeight: "100px" }}
                    disabled={isLoading}
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className={`
                    relative overflow-hidden rounded-lg transition-all duration-200 transform
                    ${
                      userInput.trim() && !isLoading
                        ? isMobile
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 active:from-blue-700 active:to-purple-700 active:scale-95"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-md shadow-blue-500/20"
                        : "bg-gray-600 cursor-not-allowed"
                    }
                    p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center flex-shrink-0
                    ${isMobile ? "touch-manipulation" : ""}
                  `}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <div className="relative">
                      <svg
                        className="animate-spin w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <Send
                      className={`w-4 h-4 transition-colors ${
                        userInput.trim() ? "text-white" : "text-gray-400"
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Show different text based on screen size */}
        <div className="mt-2 text-center bg-[#212121]">
          <p className="text-xs text-gray-500">
            {isMobile
              ? "Tap send button to send message"
              : "Press Enter to send • Shift + Enter for new line"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
