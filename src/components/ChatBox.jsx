import React, { useState } from "react";
import axios from "axios";

const ChatBox = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const newMessage = { sender: "user", text: userMessage };
    setChatHistory((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      // ✅ Call your backend project directly
      const response = await axios.post(
        "https://mental-health-backend.vercel.app/chat",
        { message: userMessage }
      );

      const aiMessage = {
        sender: "ai",
        text: `${response.data.reply} (Sentiment: ${response.data.sentiment})`,
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setUserMessage("");
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1>Mental Health Chatbot</h1>
      <div className="chat-messages">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
