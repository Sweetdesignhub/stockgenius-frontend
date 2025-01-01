// import React, { useState } from "react";
// import Chatbot from "react-chatbot-kit";
// import "react-chatbot-kit/build/main.css";

// import config from "../chatbot/config";
// import MessageParser from "../chatbot/MessageParser";
// import ActionProvider from "../chatbot/ActionProvider";

// const ChatbotComponent = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div>
//       {/* Toggle Button */}
//       <button
//         className="fixed bottom-4 right-6 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         💬
//       </button>

//       {/* Chatbot Container */}
//       {isOpen && (
//         <div className="fixed bottom-20 right-6 w-[26rem] sm:w-[20rem] md:w-[25rem] lg:w-[32rem] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
//           {/* Close Button */}
//           <button
//             className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             onClick={() => setIsOpen(false)}
//           >
//             ❌
//           </button>

//           <Chatbot
//             config={config}
//             messageParser={MessageParser}
//             actionProvider={ActionProvider}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatbotComponent;

// src/components/ChatbotComponent.jsx
import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../chatbot/config";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="fixed bottom-20 right-6 w-[26rem] sm:w-[20rem] md:w-[25rem] lg:w-[32rem] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;

