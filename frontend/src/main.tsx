import "./index.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./app/components/app.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
