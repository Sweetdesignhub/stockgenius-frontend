// components/CustomMessageContainer.jsx
import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

const CustomMessageContainer = ({ messages }) => {
    const lastFive = messages.slice(-5); // Only last 5 messages

    return (
        <div className="custom-message-container">
            {lastFive.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                    {message.message}
                </div>
            ))}
        </div>
    );
};

export default CustomMessageContainer;
