import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChatProvider } from "./context/ChatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChakraProvider>
      <ChatProvider>
        <App></App>
      </ChatProvider>
    </ChakraProvider>
  </BrowserRouter>
);
