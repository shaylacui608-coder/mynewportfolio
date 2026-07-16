const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeButton = lightbox?.querySelector(".lightbox-close");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (!window.location.hash) {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

document.querySelectorAll("[data-lightbox] img").forEach((image) => {
  image.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
}

closeButton?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox?.hidden) closeLightbox();
});
