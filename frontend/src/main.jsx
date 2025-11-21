// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Note: It looks like the path changed from './styles/main.css' to './index.css'. Use the path that matches the file you fixed earlier!

// Assuming './index.css' is the file you just fixed with the Tailwind directives:
// import "./index.css"; 

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);