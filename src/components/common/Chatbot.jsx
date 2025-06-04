
// src/components/ChatbotComponent.jsx
import React, { useState, useEffect } from "react";
import Chatbot from "react-chatbot-kit";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector to access Redux state
import "react-chatbot-kit/build/main.css";
import config from "../chatbot/config";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";
import CustomMessageContainer from "../chatbot/widgets/CustomMessageContainer"

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [usersId, setUsersId] = useState("");

  const auth = useSelector((state) => state.user);

  useEffect(() => {
    if (auth?.currentUser?.id) {
      setUsersId(auth.currentUser.id);
    }
  }, [auth]); // Runs only when `auth` changes

  if (!auth) return null; // Prevent rendering if auth doesn't exist

  const chatbotConfig = config(usersId);

  return (
    <div>
      {/* Toggle Button */}
      <button
        className="fixed bottom-4 right-6 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chatbot Container */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 max-w-[90%] sm:max-w-[20rem] md:max-w-[25rem] lg:max-w-[32rem] w-full min-w-[18rem] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          style={{ zIndex: isOpen ? 10 : "auto" }}
        >
          <Chatbot
            config={chatbotConfig}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            messageHistory={{ component: CustomMessageContainer }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;
