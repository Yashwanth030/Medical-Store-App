import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { user: input }]);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      console.log("✅ Bot Reply:", data);
      setMessages((prev) => [...prev, { bot: data.reply }]);
    } catch (error) {
      console.error("❌ Error:", error);
      setMessages((prev) => [...prev, { bot: "Bot error. Please try again." }]);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px" }}>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "250px", overflowY: "auto" }}>
        {messages.map((msg, idx) =>
          msg.user ? (
            <p key={idx}><b>You:</b> {msg.user}</p>
          ) : (
            <p key={idx}><b>Bot:</b> {msg.bot}</p>
          )
        )}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "70%", marginTop: "10px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>Send</button>
    </div>
  );
}

export default Chatbot;
