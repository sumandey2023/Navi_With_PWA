import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share, Edit, Trash2 } from "lucide-react";

const ChatContextMenu = ({
  chat,
  isOpen,
  onClose,
  onRename,
  onDelete,
  onShare,
  position = { x: 0, y: 0 },
}) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShare = () => {
    onShare(chat);
    onClose();
  };

  const handleRename = () => {
    onRename(chat);
    onClose();
  };

  const handleDelete = () => {
    onDelete(chat);
    onClose();
  };

  const menuContent = (
    <div
      ref={menuRef}
      className="fixed bg-[#212121] border border-gray-600 rounded-lg shadow-xl py-2 min-w-[160px]"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 99999,
      }}
    >
      <button
        onClick={handleShare}
        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#343541] transition-colors"
      >
        <Share className="w-4 h-4" />
        <span className="text-sm">Share</span>
      </button>

      <button
        onClick={handleRename}
        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#343541] transition-colors"
      >
        <Edit className="w-4 h-4" />
        <span className="text-sm">Rename</span>
      </button>

      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-[#343541] transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-sm">Delete</span>
      </button>
    </div>
  );

  // Render the menu as a portal to document.body to ensure it's above everything
  return createPortal(menuContent, document.body);
};

export default ChatContextMenu;
