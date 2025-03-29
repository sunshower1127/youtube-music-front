import { ThemeProvider } from "@/features/ThemeProvider";
import Home from "@/pages/home";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import ReactQueryProvider from "./react-query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </ReactQueryProvider>
  </StrictMode>
);
