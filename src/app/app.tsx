import { ThemeProvider } from "@/features/theme-provider.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import ReactQueryProvider from "./react-query";
import Router from "./react-router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </ReactQueryProvider>
  </StrictMode>
);
