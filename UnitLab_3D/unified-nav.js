/* Consistent accessible mobile navigation for standalone 3D Parts Gallery.
   Academy uses the matching controls in academy.js. */
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("menuToggle");
  const rail = document.getElementById("primaryRail");
  const scrim = document.getElementById("railScrim");
  if (!button || !rail || !scrim) return;
  const close = () => {
    rail.classList.remove("open");
    scrim.hidden = true;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open navigation");
  };
  button.addEventListener("click", () => {
    if (rail.classList.contains("open")) { close(); return; }
    rail.classList.add("open");
    scrim.hidden = false;
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Close navigation");
  });
  scrim.addEventListener("click", close);
  rail.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
});
