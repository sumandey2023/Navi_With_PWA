import React, { useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import NewChatPopup from "./NewChatPopup";
import { useChatStore } from "../store";

const NewChatButton = ({
  isSidebarOpen,
  isCreatingChat,
  chatError,
  onClosePopup,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { createNewChat, clearMessages } = useChatStore();

  const handleNewChatClick = () => {
    setIsPopupOpen(true);
  };

  const handleCreateChat = async (chatTitle) => {
    try {
      await createNewChat(chatTitle);
      clearMessages(); // Clear messages for new chat
      setIsPopupOpen(false);
    } catch (error) {
      // Error is handled in the store
      console.error("Error creating chat:", error);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    // Clear any existing errors when closing popup
    if (onClosePopup) {
      onClosePopup();
    }
  };

  return (
    <>
      <div
        className={`px-3 py-2 transition-all duration-500 delay-200 ${
          isSidebarOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 lg:opacity-100 lg:translate-y-0"
        }`}
      >
        <button
          onClick={handleNewChatClick}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-[#343541] rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New chat</span>
        </button>
      </div>

      <NewChatPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleCreateChat}
        isLoading={isCreatingChat}
        error={chatError}
      />
    </>
  );
};

export default NewChatButton;
