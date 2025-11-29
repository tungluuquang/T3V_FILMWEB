import { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Loader2,
  Send,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import "./chatbot.scss";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("chatbotState");
    return savedState ? JSON.parse(savedState).isOpen : false;
  });
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedState = localStorage.getItem("chatbotState");
    return savedState
      ? JSON.parse(savedState).messages
      : [
          {
            from: "bot",
            text: "🤖 Hello! I'm T3VMovieBot – How can I help you?",
            source: null,
            suggestedQuestions: [
              "Introduction to T3V",
              "What are the best romance movies",
              "How to register for T3V",
            ],
          },
        ];
  });
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "chatbotState",
      JSON.stringify({
        isOpen,
        messages,
      })
    );
  }, [isOpen, messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus the input when opening
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    // Add event listener to close chatbot when clicking outside
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        chatContainerRef.current &&
        !chatContainerRef.current.contains(e.target) &&
        !e.target.classList.contains("chatbot-toggle")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const sendMessage = async (text = question) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { from: "user", text }];
    setMessages(newMessages);
    setLoading(true);
    setQuestion("");
    setSelectedMessage(null);

    try {
      // Get conversation history for context
      const history = messages
        .filter((msg) => msg.from !== "system")
        .map((msg) => ({
          role: msg.from === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      const res = await axios.post(
        "http://localhost:5000/chat",
        {
          question: text,
          history,
        },
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        }
      );

      console.log(
        "Token:",
        JSON.parse(localStorage.getItem("user")).accessToken
      );

      // Handle response
      const { response, source, suggested_questions } = res.data;

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: response,
          source,
          suggestedQuestions: suggested_questions || [],
        },
      ]);
    } catch (error) {
      console.error("Error calling API:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "❌ Không thể kết nối đến chatbot API. Vui lòng thử lại sau.",
          source: null,
          suggestedQuestions: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleFeedback = (messageIndex, isPositive) => {
    // In a real app, you could send this feedback to your backend
    console.log(
      `Feedback for message ${messageIndex}: ${
        isPositive ? "positive" : "negative"
      }`
    );

    // Show a temporary confirmation message
    const updatedMessages = [...messages];
    updatedMessages.splice(messageIndex + 1, 0, {
      from: "system",
      text: isPositive
        ? "Cảm ơn phản hồi tích cực của bạn!"
        : "Cảm ơn phản hồi của bạn. Chúng tôi sẽ cải thiện.",
      isTemporary: true,
    });

    setMessages(updatedMessages);

    // Remove the temporary message after 2 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => !msg.isTemporary));
    }, 2000);
  };

  const resetChat = () => {
    const initialMessages = [
      {
        from: "bot",
        text: "🤖 Xin chào! Mình là T3VMovieBot – cuộc trò chuyện đã được làm mới.",
        source: null,
        suggestedQuestions: [
          "Giới thiệu về T3V",
          "Phim hay trên T3V là gì?",
          "Cách đăng ký tài khoản T3V",
        ],
      },
    ];
    setMessages(initialMessages);
    localStorage.setItem(
      "chatbotState",
      JSON.stringify({
        isOpen,
        messages: initialMessages,
      })
    );
  };

  const customLinkRenderer = ({ href, children }) => {
    // Check if the link is a movie link
    if (href.includes("/movie/")) {
      return (
        <Link
          to={href.replace("http://localhost:5173", "")}
          className="chatbot-link"
        >
          {children}
        </Link>
      );
    }
    // For external links, open in new tab
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="chatbot-link"
      >
        {children}
      </a>
    );
  };

  return (
    <>
      <button
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={20} /> : <Bot size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window" ref={chatContainerRef}>
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={18} />
              <span>T3VMovieBot 🎬</span>
            </div>
            <div className="chatbot-actions">
              <button
                className="icon-button"
                onClick={resetChat}
                title="Bắt đầu lại cuộc trò chuyện"
              >
                <RefreshCw size={16} />
              </button>
              <button
                className="icon-button"
                onClick={toggleChat}
                title="Đóng chatbot"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`msg ${msg.from} ${
                  msg.isTemporary ? "temporary" : ""
                }`}
                onClick={() =>
                  setSelectedMessage(selectedMessage === idx ? null : idx)
                }
              >
                {msg.from === "user" ? (
                  <div className="user-message-content">{msg.text}</div>
                ) : msg.from === "system" ? (
                  <div className="system-message">{msg.text}</div>
                ) : (
                  <div className="bot-message-container">
                    <div className="bot-message-content">
                      <ReactMarkdown
                        components={{
                          a: customLinkRenderer,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>

                      {msg.source && (
                        <div className="message-source">{msg.source}</div>
                      )}

                      {msg.suggestedQuestions &&
                        msg.suggestedQuestions.length > 0 && (
                          <div className="suggested-questions">
                            {msg.suggestedQuestions.map((q, qIdx) => (
                              <button
                                key={qIdx}
                                className="suggested-question"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSuggestedQuestion(q);
                                }}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>

                    {selectedMessage === idx && msg.from === "bot" && (
                      <div className="message-actions">
                        <button
                          className="icon-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(msg.text);
                          }}
                          title="Sao chép phản hồi"
                        >
                          {isCopied ? "Đã sao chép!" : <Copy size={14} />}
                        </button>
                        <button
                          className="icon-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFeedback(idx, true);
                          }}
                          title="Phản hồi hữu ích"
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          className="icon-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFeedback(idx, false);
                          }}
                          title="Phản hồi chưa hữu ích"
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="msg bot loading">
                <div className="typing-indicator">
                  <Loader2 className="loading-spinner" size={16} />
                  <span>Đang suy nghĩ...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Hỏi về phim hoặc dịch vụ T3V..."
              disabled={loading}
            />
            <button
              className="send-button"
              onClick={() => sendMessage()}
              disabled={loading || !question.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
