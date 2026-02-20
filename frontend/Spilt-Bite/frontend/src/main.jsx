import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // [cite: 2026-02-12]

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap App in BrowserRouter to enable routing hooks [cite: 2026-02-12] */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);