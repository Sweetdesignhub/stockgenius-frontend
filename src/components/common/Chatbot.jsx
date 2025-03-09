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
import React, { useState, useEffect } from "react";
import Chatbot from "react-chatbot-kit";
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector to access Redux state
import "react-chatbot-kit/build/main.css";
import config from "../chatbot/config";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";
import { signOut } from "../../redux/user/userSlice.js"
import api from "../../config.js";
import { clearRegion } from "../../redux/region/regionSlice.js";
// import { clearRegion } from "./redux/region/regionSlice.js";
import { clearFyersAccessToken } from "../../redux/brokers/fyersSlice.js";

const ChatbotComponent = () => {
  // console.log("Inside Chatbot");
  // const [isOpen, setIsOpen] = useState(false);
  // const [usersId, setUsersId] = useState("");
  // const auth = useSelector((state) => state.user);
  // if (!auth) return null; // Prevent rendering if auth doesn't exist

  // usersId = auth?.currentUser?.id;

  // const chatbotConfig = config(usersId);
  console.log("Inside Chatbot");
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

  // const dispatch = useDispatch();
  // const auth = useSelector((state) => state.auth);
  // if (auth === undefined) window.location.href = "/sign-in"; // Redirect to sign-in page
  // const handleSignOut = async () => {
  //   try {
  //     await api.post("/api/v1/auth/sign-out");
  //     dispatch(clearRegion());
  //     dispatch(clearFyersAccessToken());
  //     dispatch(signOut());
  //     // window.location.href = "/sign-in"; // Redirect to sign-in page
  //   } catch (error) {
  //     console.error("Error signing out:", error);
  //   }
  // };
  // useEffect(() => {
  //   // if (auth === undefined) return; // Prevent execution if auth is still loading
  //   console.log("Inside Use Effect");
  //   if (auth === undefined) {
  //     console.log("Inside Auth not Defined");
  //     // handleSignOut();
  //     // dispatch(signOut());

  //     // setTimeout(() => {
  //     // window.location.href = "/sign-in"; // Redirect after signOut
  //     // });
  //   } else {
  //     console.log("User is: ", auth);

  //     setUsersId(auth?.user?.userId || "12345");
  //   }
  // }, []);




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
          className="fixed bottom-20 right-6 w-[26rem] sm:w-[20rem] md:w-[25rem] lg:w-[32rem] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          style={{ zIndex: isOpen ? 10 : "auto" }}
        >
          <Chatbot
            config={chatbotConfig}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;