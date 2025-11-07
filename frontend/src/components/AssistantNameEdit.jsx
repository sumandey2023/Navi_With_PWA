import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "../store";
import { Bot, Check, X } from "lucide-react";
import baseUrl from "../config/baseUrl";

const AssistantNameEdit = ({ onComplete }) => {
  const [editedName, setEditedName] = useState("Aria");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const { user, fetchCurrentUser } = useUserStore();

  useEffect(() => {
    if (user?.aiAssistantName) {
      setEditedName(user.aiAssistantName);
    }
  }, [user]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editedName.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${baseUrl}/api/auth/give-ai-assistant-name`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aiAssistantName: editedName.trim() }),
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        try {
          const data = await response.json();
          console.log("Success response:", data);
          await fetchCurrentUser(); // Refresh user data
          if (onComplete) onComplete();
        } catch (jsonError) {
          console.error("Error parsing success response:", jsonError);
          // Even if JSON parsing fails, the request was successful
          await fetchCurrentUser();
          if (onComplete) onComplete();
        }
      } else {
        let errorMessage = "Failed to update assistant name";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
          // If response is not JSON, use status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating assistant name:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onComplete();
      setEditedName(user?.aiAssistantName || "Aria");
    }
  };

  const isDisabled =
    !editedName.trim() ||
    editedName.trim() === user?.aiAssistantName ||
    isLoading;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Change Assistant Name
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="assistantName"
            className="block text-sm font-medium text-gray-300"
          >
            Assistant Name
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="assistantName"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 bg-[#343541] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a name for your assistant"
              autoFocus
              maxLength={30}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-2 text-gray-400 text-xs">
              {editedName.length}/30
            </div>
          </div>
          <p className="text-xs text-gray-400">
            This name will be displayed in your conversations with the AI
            assistant
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onComplete}
            disabled={isLoading}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDisabled}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssistantNameEdit;
