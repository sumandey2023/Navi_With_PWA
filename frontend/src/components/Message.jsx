import React, { useCallback, useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext.jsx";
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Upload,
  RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Message = ({ message, user, isViewOnly }) => {
  const isUser = message.sender === "user";

  // Get user's first letter for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U"; // Default fallback
  };

  if (isUser) {
    // User message - right side layout
    return (
      <div className="flex items-start gap-2 sm:gap-4 max-w-4xl mx-auto justify-end px-4 sm:px-0">
        <div className="max-w-[85%] sm:max-w-none">
          <div className="inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-[#35363c] text-white">
            <p className="text-sm leading-relaxed break-words">
              {message.text}
            </p>
          </div>
        </div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#40414f] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs sm:text-sm font-medium text-white">
            {getUserInitial()}
          </span>
        </div>
      </div>
    );
  }

  // AI message - left side layout with Markdown & code highlighting
  return (
    <div className="flex items-start gap-2 sm:gap-4 max-w-4xl mx-auto px-4 sm:px-0">
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0 max-w-full overflow-hidden">
        <div className="inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-gray-100 bg-transparent w-full max-w-full overflow-hidden">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const codeText = String(children).replace(/\n$/, "");

                if (inline) {
                  // For inline code, we'll use a simpler approach - no copy button
                  return (
                    <code
                      className="bg-[#374151] px-1.5 py-0.5 rounded text-[0.85em] text-gray-200"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                // Check if this is a small code block (likely from key points)
                const isSmallCodeBlock =
                  codeText.length < 100 && !codeText.includes("\n");

                if (isSmallCodeBlock) {
                  // Render small code blocks without copy button and with simpler styling
                  return (
                    <code className="bg-[#1f2937] px-2 py-1 rounded text-sm text-gray-100 inline-block leading-relaxed">
                      {codeText}
                    </code>
                  );
                }

                return (
                  <div className="relative group w-full max-w-full overflow-hidden mobile-code-container">
                    <CopyButton text={codeText} isViewOnly={isViewOnly} />
                    <div
                      className="overflow-x-auto max-w-full mobile-code-container"
                      style={{
                        maxWidth: "100%",
                        width: "100%",
                        minWidth: 0,
                        flex: "1 1 0%",
                      }}
                    >
                      <div style={{ minWidth: 0, maxWidth: "100%" }}>
                        <SyntaxHighlighter
                          style={{
                            ...oneDark,
                            'code[class*="language-"]': {
                              ...oneDark['code[class*="language-"]'],
                              background: "transparent",
                              maxWidth: "100%",
                              overflow: "hidden",
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                            },
                            'pre[class*="language-"]': {
                              ...oneDark['pre[class*="language-"]'],
                              background: "transparent",
                              maxWidth: "100%",
                              overflow: "hidden",
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                            },
                          }}
                          language={match ? match[1] : undefined}
                          PreTag="div"
                          wrapLongLines={true}
                          wrapLines={true}
                          customStyle={{
                            margin: 0,
                            padding: "12px",
                            borderRadius: "8px",
                            background: "#1f2937",
                            fontSize: "0.75rem",
                            maxWidth: "100%",
                            width: "100%",
                            overflow: "auto",
                            wordBreak: "break-all",
                            whiteSpace: "pre-wrap",
                            boxSizing: "border-box",
                            minWidth: 0,
                          }}
                          {...props}
                        >
                          {codeText}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                );
              },
              a({ children, href }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline"
                  >
                    {children}
                  </a>
                );
              },
              ul({ children }) {
                return (
                  <ul className="list-disc pl-4 sm:pl-6 space-y-1 break-words">
                    {children}
                  </ul>
                );
              },
              ol({ children }) {
                return (
                  <ol className="list-decimal pl-4 sm:pl-6 space-y-1 break-words">
                    {children}
                  </ol>
                );
              },
              li({ children }) {
                return (
                  <li className="text-sm leading-relaxed mb-1 break-words overflow-wrap-anywhere">
                    {children}
                  </li>
                );
              },
              strong({ children }) {
                return <strong className="font-semibold">{children}</strong>;
              },
              em({ children }) {
                return <em className="italic">{children}</em>;
              },
              h1({ children }) {
                return (
                  <h1 className="text-lg font-semibold mb-1">{children}</h1>
                );
              },
              h2({ children }) {
                return (
                  <h2 className="text-base font-semibold mb-1">{children}</h2>
                );
              },
              h3({ children }) {
                return (
                  <h3 className="text-sm font-semibold mb-1">{children}</h3>
                );
              },
              p({ children }) {
                return (
                  <p className="text-sm leading-relaxed mb-2 break-words overflow-wrap-anywhere">
                    {children}
                  </p>
                );
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Interaction Buttons for AI messages */}
        {!isViewOnly && (
          <div className="flex items-center gap-1 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 sm:p-1 text-gray-400 hover:text-gray-300 hover:bg-[#40414f] rounded transition-colors">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="p-1.5 sm:p-1 text-gray-400 hover:text-gray-300 hover:bg-[#40414f] rounded transition-colors">
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button className="p-1.5 sm:p-1 text-gray-400 hover:text-gray-300 hover:bg-[#40414f] rounded transition-colors">
              <Volume2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 sm:p-1 text-gray-400 hover:text-gray-300 hover:bg-[#40414f] rounded transition-colors">
              <Upload className="w-4 h-4" />
            </button>
            <button className="p-1.5 sm:p-1 text-gray-400 hover:text-gray-300 hover:bg-[#40414f] rounded transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

const CopyButton = ({ text, isViewOnly }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    if (isViewOnly) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (_e) {}
  }, [text, isViewOnly]);

  return (
    <button
      onClick={onCopy}
      className={`absolute right-1 top-1 sm:right-2 sm:top-2 inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded ${
        isViewOnly
          ? "bg-[#2b3341] text-gray-400 cursor-not-allowed"
          : "bg-[#374151] text-gray-200 hover:bg-[#4b5563]"
      } transition-colors z-10`}
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      ) : (
        <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      )}
      <span className="text-[10px] sm:text-[11px] hidden sm:inline">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
};
