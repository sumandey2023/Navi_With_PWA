import React, { useState } from "react";
import { Menu, Share2, MoreVertical, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { toast } from "react-toastify";
import ShareChatModal from "./ShareChatModal";
import LogoutModal from "./LogoutModal";

const Header = ({ toggleSidebar, currentChat }) => {
  const navigate = useNavigate();
  const { logout, user } = useUserStore();
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    chat: null,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShare = () => {
    if (currentChat) {
      setShareModal({ isOpen: true, chat: currentChat });
    }
  };

  const handleCloseShareModal = () => {
    setShareModal({ isOpen: false, chat: null });
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Fixed Header */}
      <div className="bg-[#212121] p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 lg:left-80">
        <div className="flex items-center gap-4">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-300 hover:bg-[#40414f] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-gray-300 hover:bg-[#40414f] rounded-lg transition-colors"
            disabled={!currentChat}
            title="Share chat"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogoutClick}
            className="p-2 text-gray-300 hover:bg-[#40414f] rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Add top padding so page content doesn’t go under header */}
      <div className="pt-16">{/* Page content will go here */}</div>

      {/* Share Modal */}
      <ShareChatModal
        isOpen={shareModal.isOpen}
        onClose={handleCloseShareModal}
        chat={shareModal.chat}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Header;
