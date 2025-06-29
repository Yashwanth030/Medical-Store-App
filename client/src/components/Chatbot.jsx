import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { user: input }]);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { bot: data.reply }]);
      setInput("");
    } catch (err) {
      setMessages((prev) => [...prev, { bot: "Bot error. Please try again." }]);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 600, margin: "auto" }}>
      <h2>Chatbot</h2>
      <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", padding: "1rem" }}>
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.user ? "You" : "Bot"}:</strong> {msg.user || msg.bot}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chatbot;
