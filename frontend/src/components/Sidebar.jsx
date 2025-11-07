import React from "react";
import SidebarHeader from "./SidebarHeader";
import NewChatButton from "./NewChatButton";
import ChatHistory from "./ChatHistory";
import UserProfile from "./UserProfile";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  chatHistory,
  isCreatingChat,
  chatError,
  onClosePopup,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onShareChat,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`
           fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-out
           ${
             isSidebarOpen
               ? "bg-[#181818]/60 backdrop-blur-sm"
               : "bg-transparent pointer-events-none"
           }
         `}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`
         fixed lg:static inset-y-0 left-0 z-50
         w-80 sm:w-72 bg-[#181818]
         transform transition-all duration-300 ease-out
         lg:translate-x-0
         flex flex-col
         ${
           isSidebarOpen
             ? "translate-x-0 scale-100"
             : "-translate-x-full lg:translate-x-0 scale-95 lg:scale-100"
         }
       `}
      >
        <SidebarHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <NewChatButton
          isSidebarOpen={isSidebarOpen}
          isCreatingChat={isCreatingChat}
          chatError={chatError}
          onClosePopup={onClosePopup}
        />

        <ChatHistory
          isSidebarOpen={isSidebarOpen}
          chatHistory={chatHistory}
          onSelectChat={onSelectChat}
          onRenameChat={onRenameChat}
          onDeleteChat={onDeleteChat}
          onShareChat={onShareChat}
        />

        <UserProfile />
      </div>
    </>
  );
};

export default Sidebar;
