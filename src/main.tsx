import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AhsdGame } from "./ahsd/game";
import { AhsdSceneEditor } from "./ahsd/editor";
import "./ahsd/editor.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.location.pathname === "/editor" || window.location.pathname === "/editor.html" ? <AhsdSceneEditor /> : <AhsdGame />}
  </StrictMode>,
);
