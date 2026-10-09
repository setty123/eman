import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/sora/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./styles/main.css";
import App from "./App";
async function bootstrap() {
  const homePage = window.location.pathname === "/";
  const initialPage = homePage
    ? (await import("./pages/Home")).default
    : (await import("./pages/ContentPage")).default;
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App initialPage={initialPage} homePage={homePage} />
      </BrowserRouter>
    </React.StrictMode>,
  );
}
void bootstrap();
