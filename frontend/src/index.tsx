import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <p>hello world</p>
    </React.StrictMode>
  );
}
