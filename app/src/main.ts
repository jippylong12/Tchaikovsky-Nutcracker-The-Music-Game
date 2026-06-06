import { createAppShell } from "./app";

window.addEventListener("DOMContentLoaded", () => {
  const mount = document.querySelector<HTMLElement>("#app");
  if (!mount) {
    throw new Error("Missing #app mount point");
  }

  createAppShell(mount);
});
