const animatedNodes = document.querySelectorAll("[data-animate]");
const progressBar = document.querySelector(".scroll-progress-bar");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.add("is-ready");

const revealNode = (node) => {
  const delay = Number(node.dataset.delay || 0);
  window.setTimeout(() => {
    node.classList.add("is-visible");
  }, delay);
};

const updateProgress = () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;
  progressBar.style.transform = `scaleX(${progress})`;
};

if (
  prefersReducedMotion ||
  !("IntersectionObserver" in window)
) {
  animatedNodes.forEach((node) => revealNode(node));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealNode(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  animatedNodes.forEach((node) => observer.observe(node));
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
