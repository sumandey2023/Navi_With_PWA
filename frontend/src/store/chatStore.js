import { create } from "zustand";
import api from "../config/api";

const useChatStore = create((set, get) => ({
  // State
  chatHistory: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  isCreatingChat: false,
  chatError: "",

  // Actions
  setChatHistory: (chats) => set({ chatHistory: chats }),

  setCurrentChat: (chat) => set({ currentChat: chat }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  setCreatingChat: (creating) => set({ isCreatingChat: creating }),

  setChatError: (error) => set({ chatError: error }),

  clearChatError: () => set({ chatError: "" }),

  // Chat Management Actions
  renameChat: async (chatId, newTitle) => {
    try {
      const response = await api.put(`/chat/${chatId}`, { title: newTitle });

      if (response.data.success) {
        // Update chat in history
        set((state) => ({
          chatHistory: state.chatHistory.map((chat) =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
          ),
          currentChat:
            state.currentChat?.id === chatId
              ? { ...state.currentChat, title: newTitle }
              : state.currentChat,
        }));
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
      set({
        chatError: error.response?.data?.message || "Failed to rename chat",
      });
      throw error;
    }
  },

  deleteChat: async (chatId) => {
    try {
      const response = await api.delete(`/chat/${chatId}`);

      if (response.data.success) {
        // Remove chat from history
        set((state) => ({
          chatHistory: state.chatHistory.filter((chat) => chat.id !== chatId),
          currentChat:
            state.currentChat?.id === chatId ? null : state.currentChat,
          messages: state.currentChat?.id === chatId ? [] : state.messages,
        }));
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      set({
        chatError: error.response?.data?.message || "Failed to delete chat",
      });
      throw error;
    }
  },

  shareChat: (chat) => {
    console.log("shareChat - Chat object:", chat);
    console.log("shareChat - Chat user ID:", chat.user);

    // Create shareable URL with user ID
    const shareUrl = `${window.location.origin}/shared/${chat.id}/${chat.user}`;
    console.log("shareChat - Generated URL:", shareUrl);

    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        // You could show a toast notification here
        console.log("Chat URL copied to clipboard:", shareUrl);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      console.log("Chat URL copied to clipboard:", shareUrl);
    }
  },

  // API Actions
  fetchAllChats: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get("/chat");

      console.log("fetchAllChats - Raw response:", response.data);
      console.log("fetchAllChats - Chats array:", response.data.chats);

      const formattedChats = response.data.chats.map((chat) => {
        console.log("fetchAllChats - Processing chat:", chat);
        return {
          id: chat._id,
          title: chat.title,
          timestamp: chat.lastActivity,
          user: chat.user, // Keep as 'user' for consistency
          userId: chat.user, // Also keep userId for backward compatibility
        };
      });

      console.log("fetchAllChats - Formatted chats:", formattedChats);

      // Reverse the array to show most recent chats first
      const reversedChats = formattedChats.reverse();

      set({ chatHistory: reversedChats, isLoading: false });
      return reversedChats;
    } catch (error) {
      console.error("Error fetching chats:", error);
      set({
        chatError: error.response?.data?.message || "Failed to fetch chats",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchChatMessages: async (chatId) => {
    try {
      set({ isLoading: true });
      const response = await api.get(`/chat/${chatId}/messages`);

      const formattedMessages = response.data.messages.map((m) => ({
        id: m._id,
        text: m.content,
        sender: m.role === "model" ? "ai" : "user",
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      // Update currentChat with proper user ID if available
      if (response.data.chat) {
        set((state) => ({
          messages: formattedMessages,
          isLoading: false,
          currentChat: {
            ...state.currentChat,
            user: response.data.chat.user, // Ensure user ID is set
          },
        }));
      } else {
        set({ messages: formattedMessages, isLoading: false });
      }

      return formattedMessages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({
        chatError: error.response?.data?.message || "Failed to fetch messages",
        isLoading: false,
      });
      throw error;
    }
  },

  createNewChat: async (title) => {
    try {
      set({ isCreatingChat: true, chatError: "" });

      const response = await api.post("/chat", { title });

      if (response.data.chat) {
        const newChat = {
          id: response.data.chat._id,
          title: response.data.chat.title,
          timestamp: "Just now",
          user: response.data.chat.user, // Keep as 'user' for consistency
          userId: response.data.chat.user, // Also keep userId for backward compatibility
        };

        // Add to chat history
        set((state) => ({
          chatHistory: [newChat, ...state.chatHistory],
          currentChat: newChat,
          messages: [],
          isCreatingChat: false,
        }));

        return newChat;
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      set({
        chatError: error.response?.data?.message || "Failed to create chat",
        isCreatingChat: false,
      });
      throw error;
    }
  },

  // Utility Actions
  resetState: () =>
    set({
      chatHistory: [],
      currentChat: null,
      messages: [],
      isLoading: false,
      isCreatingChat: false,
      chatError: "",
    }),
}));

export default useChatStore;
