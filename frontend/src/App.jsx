import React, { useState, useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { ChatProvider } from "./context/ChatContext.jsx";
import { LoadingScreen } from "./components";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for free hosting services
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    // Also hide loading when page is fully loaded
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Additional 500ms after page load
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
  );
};

export default App;
