import React, { useState, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";

const Main = () => {
  /* ────────────────────────────────────────────
     ①  Chat state
  ───────────────────────────────────────────── */
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I help you today?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatHistoryRef = useRef(null);

  /* keep chat scrolled to the bottom */
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  /* ────────────────────────────────────────────
     ②  Send a message
  ───────────────────────────────────────────── */
  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;

    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    setUserInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5050/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          text:
            data.reply ??
            "Oops! The chatbot didn’t return a valid reply.",
          sender: "bot",
        },
      ]);
    } catch (err) {
      console.error(err);
      const fallback =
        "Sorry, I’m having trouble connecting to the chatbot. Please try again later.";
      setError(fallback);
      setMessages((prev) => [...prev, { text: fallback, sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  /* ────────────────────────────────────────────
     ③  Render
  ───────────────────────────────────────────── */
  return (
    <div className="main">
      {/* top nav — unchanged */}
      <div className="nav">
        <p>
          <b>NeoNik</b>
        </p>
        <img src={assets.user_icon} alt="User Icon" />
      </div>

      <div className="main_container">
        {/* greeting — unchanged */}
        <div className="greet">
          <p>
            <span>Hello, Nikesh</span>
          </p>
          <p>How can i help you today? </p>
        </div>

        {/* quick‑start cards — unchanged */}
        <div className="cards">
          <div className="card">
            <p>Suggest beautiful places to see on upcoming road trip</p>
            <img src={assets.compass_icon} alt="" />
          </div>
          <div className="card">
            <p>Briefly summerize this concept: urban planning</p>
            <img src={assets.bulb_icon} alt="" />
          </div>
          <div className="card">
            <p>Brainstrom team bonding activites for our work retreat</p>
            <img src={assets.message_icon} alt="" />
          </div>
          <div className="card">
            <p>improve the readability of the following code</p>
            <img src={assets.code_icon} alt="" />
          </div>
        </div>

        {/* chat history */}
        <div id="chat-history" ref={chatHistoryRef} className="chat-history">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${
                msg.sender === "user" ? "user-bubble" : "bot-bubble"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && <p className="loading">AI is thinking…</p>}
          {error && <p className="error">{error}</p>}
        </div>

        {/* prompt input */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {/* wrap the send icon so it acts as a button */}
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="send-btn"
              >
                <img src={assets.send_icon} alt="Send" />
              </button>
            </div>
          </div>
          <p className="bottom-info">
            NeoNik can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
