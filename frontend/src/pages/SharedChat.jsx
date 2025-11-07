import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessagesArea } from "../components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseUrl from "../config/baseUrl";
import { useUserStore } from "../store";
import { useChatContext } from "../context/ChatContext.jsx";

const SharedChat = () => {
  const { chatId, userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useUserStore();
  const { setIsViewOnly } = useChatContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setIsViewOnly(true); // Set view-only mode when entering shared chat
    return () => setIsViewOnly(false); // Reset view-only mode when leaving
  }, [setIsViewOnly]);

  useEffect(() => {
    const checkOwnershipAndFetchChat = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if the current user is the owner
        if (user && user._id === userId) {
          // If owner, redirect to regular chat view
          navigate(`/chat/${chatId}`);
          return;
        }

        // Fetch shared chat data
        const response = await fetch(
          `${baseUrl}/api/chat/${chatId}/shared/${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Format messages
          const formattedMessages = data.messages.map((m) => ({
            id: m._id,
            text: m.content,
            sender: m.role === "model" ? "ai" : "user",
            timestamp: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setMessages(formattedMessages);
          setCurrentChat(data.chat);
          setIsOwner(data.isOwner || false);
        } else if (response.status === 404) {
          setError("Chat not found or no longer shared");
          toast.error("Chat not found or no longer shared");
        } else {
          setError("Error loading shared chat");
          toast.error("Error loading shared chat");
        }
      } catch (error) {
        console.error("Error fetching shared chat:", error);
        setError("Error loading shared chat");
        toast.error("Error loading shared chat");
      } finally {
        setIsLoading(false);
      }
    };

    if (chatId && userId) {
      checkOwnershipAndFetchChat();
    } else {
      setError("Invalid shared chat URL");
      setIsLoading(false);
    }
  }, [chatId, userId, user, navigate]);

  const fetchSharedChat = async (chatId, userId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${baseUrl}/api/chat/${chatId}/shared/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setCurrentChat(data.chat);
        setIsLoading(false);
      } else if (response.status === 404) {
        setError("Chat not found or not shared");
        setIsLoading(false);
      } else {
        setError("Failed to load shared chat");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching shared chat:", error);
      setError("Failed to load shared chat");
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#343541] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading shared chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#343541] items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-[#212121] border border-gray-600 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Chat Not Found
            </h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleGoHome}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#343541]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#212121] p-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">
                {currentChat?.title || "Shared Chat"}
              </h1>
              <p className="text-sm text-gray-400">Shared by another user</p>
            </div>
            <button
              onClick={handleGoHome}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <MessagesArea
          messages={messages}
          isLoading={false}
          messagesEndRef={messagesEndRef}
          currentChat={currentChat}
          user={null} // No user for shared chats
        />

        {/* Read-only message */}
        <div className="p-4 bg-[#212121] border-t border-gray-600">
          <div className="text-center text-gray-400 text-sm">
            <p>
              This is a shared chat. You can view the conversation but cannot
              send messages.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Want to start your own conversation?{" "}
              <button
                onClick={handleGoHome}
                className="text-blue-400 hover:underline"
              >
                Go to Home
              </button>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default SharedChat;
