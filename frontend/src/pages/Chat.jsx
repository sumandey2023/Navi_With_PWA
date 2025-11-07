import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar, Header, MessagesArea, InputArea } from "../components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChatStore, useUserStore } from "../store";
import { useChatContext } from "../context/ChatContext.jsx";
import { io } from "socket.io-client";
import baseUrl from "../config/baseUrl";

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isSharedChat, setIsSharedChat] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Zustand store state
  const {
    chatHistory,
    currentChat,
    messages,
    isLoading,
    isCreatingChat,
    chatError,
    fetchAllChats,
    createNewChat,
    fetchChatMessages,
    setMessages,
    addMessage,
    clearMessages,
    setLoading,
    setCurrentChat,
    clearChatError,
    renameChat,
    deleteChat,
    shareChat,
  } = useChatStore();

  // User store state
  const { user, fetchCurrentUser, isAuthenticated } = useUserStore();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { setIsViewOnly } = useChatContext();

  useEffect(() => {
    setIsViewOnly(false); // Reset view-only mode when entering regular chat
  }, [setIsViewOnly]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const tempSocket = io(baseUrl, {
      withCredentials: true,
    });

    tempSocket.on("ai-response", ({ content }) => {
      const aiMessage = {
        id: Date.now() + 1,
        text: content,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      addMessage(aiMessage);
      setLoading(false);
    });

    setSocket(tempSocket);

    return () => {
      tempSocket.disconnect();
    };
  }, [addMessage, setLoading]);

  // Initialize chat when component mounts or chatId changes
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);

        // Try to fetch messages first - this verifies if the chat exists
        try {
          const fetchedMessages = await fetchChatMessages(chatId);
          if (fetchedMessages) {
            // Messages exist, so the chat exists. Now ensure we have it in chat history
            if (chatHistory.length === 0) {
              await fetchAllChats();
            }

            let chat = chatHistory.find((c) => c.id === chatId);
            if (!chat) {
              // If still not in history, fetch all chats again
              await fetchAllChats();
              chat = chatHistory.find((c) => c.id === chatId);
            }

            // Even if we can't find it in history, we know it exists because we got messages
            setIsSharedChat(false);
            return;
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          // Don't navigate away on error, try the next approach
        }

        // If we get here, try fetching chat history
        if (chatHistory.length === 0) {
          await fetchAllChats();
        }

        const chat = chatHistory.find((c) => c.id === chatId);
        if (chat) {
          setCurrentChat(chat);
          await fetchChatMessages(chatId);
          setIsSharedChat(false);
        }
        // Don't navigate away if chat not found, it might still be loading
      } catch (error) {
        console.error("Error initializing chat:", error);
        // Don't navigate away, just show the error
        toast.error("Error loading chat");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      initializeChat();
    }
  }, [
    chatId,
    chatHistory,
    fetchAllChats,
    fetchChatMessages,
    setCurrentChat,
    navigate,
    setLoading,
  ]);

  // Fetch user data on component mount if not already available
  useEffect(() => {
    if (!user && !isAuthenticated) {
      fetchCurrentUser().catch((error) => {
        console.log("User not authenticated or error fetching user:", error);
      });
    }
  }, [user, isAuthenticated, fetchCurrentUser]);

  // Function to fetch shared chat data
  const fetchSharedChat = async (chatId) => {
    try {
      const response = await fetch(`${baseUrl}/api/chat/${chatId}/shared`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setCurrentChat(data.chat);
        setIsOwner(data.isOwner || false);
        setIsSharedChat(true);
      } else {
        // If shared chat not found, try to load as regular chat
        const chat = chatHistory.find((c) => c.id === chatId);
        if (chat) {
          setCurrentChat(chat);
          fetchChatMessages(chatId);
          setIsSharedChat(false);
          setIsOwner(true);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error fetching shared chat:", error);
      // Try to load as regular chat if there's an error
      const chat = chatHistory.find((c) => c.id === chatId);
      if (chat) {
        setCurrentChat(chat);
        fetchChatMessages(chatId);
        setIsSharedChat(false);
        setIsOwner(true);
      } else {
        navigate("/");
      }
    }
  };

  // Load specific chat when chatId changes
  useEffect(() => {
    if (chatId) {
      if (chatHistory.length > 0) {
        const chat = chatHistory.find((c) => c.id === chatId);
        if (chat) {
          setCurrentChat(chat);
          fetchChatMessages(chatId);
          setIsSharedChat(false);
          setIsOwner(true);
        } else {
          // Chat not in user's history, try as shared chat
          fetchSharedChat(chatId);
        }
      } else {
        // No chat history yet, try as shared chat
        fetchSharedChat(chatId);
      }
    }
  }, [chatId, chatHistory, setCurrentChat, fetchChatMessages, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    // Check if user is trying to send message in a shared chat they don't own
    if (isSharedChat && !isOwner) {
      toast.warning(
        "This is a shared chat. You can only read the conversation.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: userInput,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(userMessage);
    setUserInput("");
    setLoading(true);

    // Auto-resize textarea back to original size
    if (inputRef.current) {
      inputRef.current.style.height = "48px";
    }

    // Emit to backend via Socket.IO
    if (socket && currentChat?.id) {
      socket.emit("ai-message", {
        chat: currentChat.id,
        content: userInput,
      });
    } else {
      console.warn("No active chat or socket not connected");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);

    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectChat = async (chat) => {
    setCurrentChat(chat);
    await fetchChatMessages(chat.id);
    // Navigate to the specific chat route
    navigate(`/chat/${chat.id}`);
  };

  return (
    <div className="flex h-screen bg-[#212121] overflow-hidden">
      {/* Only show sidebar for owned chats */}
      {!isSharedChat && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          chatHistory={chatHistory}
          isCreatingChat={isCreatingChat}
          chatError={chatError}
          onClosePopup={clearChatError}
          onSelectChat={handleSelectChat}
          onRenameChat={renameChat}
          onDeleteChat={deleteChat}
          onShareChat={shareChat}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#212121]">
        <Header
          toggleSidebar={isSharedChat ? null : toggleSidebar}
          currentChat={currentChat}
        />

        <MessagesArea
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          currentChat={currentChat}
          user={user}
        />

        {/* Only show input area for owned chats */}
        {(!isSharedChat || isOwner) && (
          <InputArea
            userInput={userInput}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            handleSendClick={handleSendMessage}
            isLoading={isLoading}
            inputRef={inputRef}
          />
        )}

        {/* Show read-only message for shared chats */}
        {isSharedChat && !isOwner && (
          <div className="p-4 bg-[#212121] border-t border-gray-600">
            <div className="text-center text-gray-400 text-sm">
              <p>
                This is a shared chat. You can view the conversation but cannot
                send messages.
              </p>
            </div>
          </div>
        )}
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

export default Chat;
