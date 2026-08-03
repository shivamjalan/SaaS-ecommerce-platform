import { useState, useRef, useEffect } from "react";

import Markdown from "react-markdown";

import {
  FaCommentDots,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

import { API_URL } from "../utils/api";

const ChatBot = ({
  storeSlug,
  storeName,
}) => {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the assistant for ${storeName}. Ask me about our products, prices or availability.`,
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  /* ===================================================== */
  /* ================== AUTO SCROLL ====================== */
  /* ===================================================== */

  useEffect(() => {

    if (scrollRef.current) {

      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;

    }

  }, [messages, open]);

  /* ===================================================== */
  /* ===================== SEND ========================== */
  /* ===================================================== */

  const sendMessage = async () => {

    const text = input.trim();

    if (!text || loading) return;

    const updated = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(updated);

    setInput("");

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/ai/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            storeSlug,
            message: text,
            history: updated.slice(-6),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Chat failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

    } catch (error) {

      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble right now. Please try again in a moment.",
        },
      ]);

    } finally {

      setLoading(false);

    }

  };

  return (
    <>
      {/* ===================================================== */}
      {/* ================= FLOATING BUTTON =================== */}
      {/* ===================================================== */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 gradient-bg text-white p-4 rounded-full shadow-accent-lg hover:scale-110 hover:brightness-110 transition-all duration-200"
          aria-label="Open store assistant"
        >
          <FaCommentDots size={24} />
        </button>
      )}

      {/* ===================================================== */}
      {/* ==================== CHAT PANEL ===================== */}
      {/* ===================================================== */}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-card rounded-3xl shadow-xl overflow-hidden border border-border flex flex-col">

          {/* HEADER */}

          <div className="relative bg-foreground text-background px-5 py-4 flex items-center justify-between">

            <div className="absolute inset-0 dot-pattern" />

            <div className="relative flex items-center gap-3">

              <div className="gradient-bg h-10 w-10 rounded-xl flex items-center justify-center shadow-accent">

                <FaCommentDots className="text-white" />

              </div>

              <div>

                <p className="font-semibold">
                  Ask {storeName}
                </p>

                <p className="flex items-center gap-1.5 text-xs text-white/60">

                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />

                  Store assistant

                </p>

              </div>

            </div>

            <button
              onClick={() => setOpen(false)}
              className="relative hover:bg-white/10 p-2 rounded-lg transition"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>

          </div>

          {/* MESSAGES */}

          <div
            ref={scrollRef}
            className="h-80 overflow-y-auto px-4 py-4 space-y-3 bg-muted/50"
          >

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "gradient-bg text-white ml-auto rounded-br-sm shadow-accent whitespace-pre-wrap"
                    : "bg-card border border-border shadow-sm mr-auto rounded-bl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="markdown">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm bg-card border border-border shadow-sm mr-auto inline-flex items-center gap-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot [animation-delay:0.4s]" />

              </div>
            )}

          </div>

          {/* INPUT */}

          <div className="p-3 border-t border-border flex items-center gap-2">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              autoFocus
              placeholder="Type a message..."
              className="flex-1 border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="gradient-bg hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none text-white p-3 rounded-xl transition-all duration-200"
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default ChatBot;
