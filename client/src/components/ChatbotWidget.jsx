// src/components/ChatbotWidget.jsx
import React, { useState } from "react";
import Chatbot from "./Chatbot";
import { FaRobot } from "react-icons/fa";

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating chatbot button */}
      <div style={styles.fab} onClick={toggleChat}>
        <FaRobot size={24} />
      </div>

      {/* Chatbot panel */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <Chatbot />
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#4caf50",
    color: "#fff",
    padding: "12px",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 1000,
  },
  chatWindow: {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "350px",
    height: "500px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
    overflow: "hidden",
  },
};

export default ChatbotWidget;
