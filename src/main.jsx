// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import { persistor, store } from "./redux/store.js";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { ThemeProvider } from "./contexts/ThemeContext.jsx";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <PersistGate persistor={persistor} loading={null}>
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//     </PersistGate>
//   </Provider>
// );
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthProvider from "./contexts/AuthProvider";
import { store, persistor } from "./redux/store";
import { DataProvider } from "./contexts/FyersDataContext";
// import { BotTimeProvider } from "./contexts/BotTimeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <DataProvider>
              {/* <BotTimeProvider> */}
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <App />
              </GoogleOAuthProvider>
              {/* </BotTimeProvider> */}
            </DataProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
