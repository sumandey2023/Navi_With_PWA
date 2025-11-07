import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import ChatContextMenu from "./ChatContextMenu";
import RenameChatModal from "./RenameChatModal";
import ShareChatModal from "./ShareChatModal";

const ChatHistory = ({
  isSidebarOpen,
  chatHistory,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onShareChat,
}) => {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    chat: null,
    position: { x: 0, y: 0 },
  });
  const [renameModal, setRenameModal] = useState({
    isOpen: false,
    chat: null,
  });
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    chat: null,
  });

  const handleContextMenu = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the button's position and position menu to the right of it
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 160; // Approximate menu width
    const menuHeight = 120; // Approximate menu height
    const padding = 8;

    // Calculate position
    let x = buttonRect.right + padding;
    let y = buttonRect.top;

    // Check if menu would go off-screen to the right
    if (x + menuWidth > window.innerWidth) {
      x = buttonRect.left - menuWidth - padding; // Position to the left instead
    }

    // Check if menu would go off-screen at the bottom
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - padding; // Adjust to fit
    }

    // Ensure menu doesn't go off-screen at the top
    if (y < padding) {
      y = padding;
    }

    // Ensure menu doesn't go off-screen at the left
    if (x < padding) {
      x = padding;
    }

    setContextMenu({
      isOpen: true,
      chat: chat,
      position: {
        x: x,
        y: y,
      },
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ isOpen: false, chat: null, position: { x: 0, y: 0 } });
  };

  const handleRename = (chat) => {
    setRenameModal({ isOpen: true, chat: chat });
  };

  const handleCloseRenameModal = () => {
    setRenameModal({ isOpen: false, chat: null });
  };

  const handleRenameSubmit = (chatId, newTitle) => {
    if (onRenameChat) {
      onRenameChat(chatId, newTitle);
    }
  };

  const handleDelete = (chat) => {
    if (window.confirm(`Are you sure you want to delete "${chat.title}"?`)) {
      if (onDeleteChat) {
        onDeleteChat(chat.id);
      }
    }
  };

  const handleShare = (chat) => {
    setShareModal({ isOpen: true, chat: chat });
  };

  const handleCloseShareModal = () => {
    setShareModal({ isOpen: false, chat: null });
  };

  return (
    <div
      className={`flex-1 overflow-y-auto transition-all duration-500 delay-300 ${
        isSidebarOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 lg:opacity-100 lg:translate-y-0"
      }`}
    >
      <div className="px-3 py-2">
        <div className="mb-2 px-3 py-2">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Chats
          </h3>
        </div>
        <div className="space-y-1 relative">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="group flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-[#343541] cursor-pointer rounded-lg transition-colors"
              onClick={() => onSelectChat && onSelectChat(chat)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{chat.title}</p>
              </div>
              <button
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 hover:bg-[#40414f] rounded transition-colors"
                onClick={(e) => handleContextMenu(e, chat)}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      <ChatContextMenu
        chat={contextMenu.chat}
        isOpen={contextMenu.isOpen}
        onClose={handleCloseContextMenu}
        onRename={handleRename}
        onDelete={handleDelete}
        onShare={handleShare}
        position={contextMenu.position}
      />

      {/* Rename Modal */}
      <RenameChatModal
        isOpen={renameModal.isOpen}
        onClose={handleCloseRenameModal}
        chat={renameModal.chat}
        onRename={handleRenameSubmit}
      />

      {/* Share Modal */}
      <ShareChatModal
        isOpen={shareModal.isOpen}
        onClose={handleCloseShareModal}
        chat={shareModal.chat}
      />
    </div>
  );
};

export default ChatHistory;
