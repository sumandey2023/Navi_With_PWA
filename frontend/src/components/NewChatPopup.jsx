import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useChatStore } from "../store";

const NewChatPopup = ({ isOpen, onClose, onSubmit, isLoading, error }) => {
  const [chatTitle, setChatTitle] = useState("");
  const { createNewChat } = useChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (chatTitle.trim()) {
      try {
        await onSubmit(chatTitle.trim());
        setChatTitle("");
        handleClose();
      } catch (error) {
        console.error("Error creating chat:", error);
        // Error is already handled by the parent component
      }
    }
  };

  const handleClose = () => {
    setChatTitle("");
    onClose();
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
            <h2 className="text-lg font-semibold text-white">
              Create New Chat
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="chatTitle"
                className="block text-sm font-medium text-gray-300"
              >
                Chat Title
              </label>
              <input
                type="text"
                id="chatTitle"
                value={chatTitle}
                onChange={(e) => setChatTitle(e.target.value)}
                placeholder="Enter chat title..."
                className="w-full px-3 py-2 bg-[#343541] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!chatTitle.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? "Creating..." : "Create"}
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

export default NewChatPopup;
