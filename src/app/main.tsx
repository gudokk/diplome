import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Background from "../assets/back.png";
import "./index.css";
import App from "./routes/";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <div
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100%",
          }}
        >
          <App />
        </div>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
