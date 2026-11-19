const heroHeader = document.querySelector(".headerHero");
const stickyHeader = document.querySelector(".headerSticky");

window.addEventListener("scroll", () => {
  const afficherSticky = window.scrollY > 100;

  heroHeader.classList.toggle("hidden", afficherSticky);
  stickyHeader.classList.toggle("visible", afficherSticky);
});