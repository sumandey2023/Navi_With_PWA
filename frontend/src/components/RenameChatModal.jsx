import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const RenameChatModal = ({ isOpen, onClose, chat, onRename }) => {
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && chat) {
      setNewTitle(chat.title);
      // Focus input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, chat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle.trim() && newTitle.trim() !== chat.title) {
      onRename(chat.id, newTitle.trim());
    }
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-[#212121] border border-gray-600 rounded-lg w-full max-w-md mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Rename Chat</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Chat Title
              </label>
              <input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 bg-[#343541] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter chat title"
                maxLength={100}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim() || newTitle.trim() === chat.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Rename
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render the modal as a portal to document.body to ensure it's centered on the entire screen
  return createPortal(modalContent, document.body);
};

export default RenameChatModal;
