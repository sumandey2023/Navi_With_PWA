import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Link, Info } from "lucide-react";
import { useUserStore } from "../store";

const ShareChatModal = ({ isOpen, onClose, chat }) => {
  const [shareUrl, setShareUrl] = useState("");
  const [isLinkCreated, setIsLinkCreated] = useState(false);
  const inputRef = useRef(null);
  const { user } = useUserStore();

  useEffect(() => {
    if (isOpen && chat) {
      console.log("ShareChatModal - Chat object:", chat);
      console.log("ShareChatModal - Chat user ID:", chat.user);
      console.log("ShareChatModal - Chat user type:", typeof chat.user);
      console.log("ShareChatModal - All chat keys:", Object.keys(chat));
      console.log("ShareChatModal - Current user:", user);

      // Use chat.user if available, otherwise fall back to current user ID
      const userId = chat.user || user?.id;
      console.log("ShareChatModal - Using user ID:", userId);

      // Create shareable URL with user ID
      const url = `${window.location.origin}/shared/${chat.id}/${userId}`;
      console.log("ShareChatModal - Generated URL:", url);
      setShareUrl(url);
      setIsLinkCreated(true);

      // Focus input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, chat, user]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
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
      <div className="bg-[#212121] border border-gray-600 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Share public link to chat
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="mb-4 p-3 bg-gray-800 border border-gray-600 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              This conversation may include personal information. Take a moment
              to check the content before sharing the link.
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-gray-400 mb-4">
          Your name, custom instructions, and any messages you add after sharing
          stay private.{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Learn more
          </a>
        </p>

        {/* Link Input Field */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={shareUrl}
              readOnly
              onKeyDown={handleKeyPress}
              className="flex-1 px-3 py-2 bg-[#343541] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-app.com/chat/..."
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-[#343541] border border-gray-600 text-white rounded-lg hover:bg-[#40414f] transition-colors flex items-center gap-2"
            >
              <Link className="w-4 h-4" />
              <span className="text-sm">Copy link</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Render the modal as a portal to document.body to ensure it's centered on the entire screen
  return createPortal(modalContent, document.body);
};

export default ShareChatModal;
