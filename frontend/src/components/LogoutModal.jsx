import React from "react";
import { LogOut, X } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const getPositionClasses = () => {
    // Always center the modal on the screen regardless of position prop
    return "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
  };

  const getModalClasses = () => {
    // Always use standard center modal styling
    return "bg-[#2f2f2f] rounded-xl border border-gray-600 shadow-2xl max-w-md w-full";
  };

  return (
    <div className={getPositionClasses()}>
      <div className={getModalClasses()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-600 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-400">
                Are you sure you want to log out?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6">
            You will be signed out of your account and redirected to the login
            page.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
