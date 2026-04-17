const tiltNodes = document.querySelectorAll("[data-tilt]");
const depthScopes = document.querySelectorAll("[data-depth-scope]");
const revealNodes = document.querySelectorAll(".reveal");
const heroVisual = document.querySelector(".hero-visual");
const heroCopy = document.querySelector(".hero-copy");
const commandChips = document.querySelectorAll(".command-chip");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const transformCache = new WeakMap();
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setTransformCache = (node) => {
  const baseTransform = getComputedStyle(node).transform;
  transformCache.set(node, baseTransform === "none" ? "" : baseTransform);
};

tiltNodes.forEach((node) => {
  setTransformCache(node);

  const handleMove = (event) => {
    if (prefersReducedMotion) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 18;
    const rotateX = (0.5 - py) * 18;
    const base = transformCache.get(node);

    node.style.transform = `${base} rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const reset = () => {
    node.style.transform = transformCache.get(node);
  };

  node.addEventListener("pointermove", handleMove);
  node.addEventListener("pointerleave", reset);
  node.addEventListener("pointerup", reset);
});

depthScopes.forEach((scope) => {
  const depthNodes = scope.querySelectorAll("[data-depth]");
  depthNodes.forEach(setTransformCache);

  const updateDepth = (event) => {
    if (prefersReducedMotion) return;
    const rect = scope.getBoundingClientRect();
    const px = clamp((event.clientX - rect.left) / rect.width, 0, 1) - 0.5;
    const py = clamp((event.clientY - rect.top) / rect.height, 0, 1) - 0.5;

    depthNodes.forEach((node) => {
      const depth = Number(node.dataset.depth || 0);
      const moveX = px * depth;
      const moveY = py * depth;
      const base = transformCache.get(node);

      node.style.transform = `${base} translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  };

  const resetDepth = () => {
    depthNodes.forEach((node) => {
      node.style.transform = transformCache.get(node);
    });
  };

  scope.addEventListener("pointermove", updateDepth);
  scope.addEventListener("pointerleave", resetDepth);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

if (!prefersReducedMotion && heroVisual && heroCopy) {
  let ticking = false;

  const updateScrollEffects = () => {
    const offset = window.scrollY;
    const viewport = window.innerHeight || 800;
    const progress = clamp(offset / (viewport * 1.1), 0, 1);
    const move = progress * 54;
    const scale = 1 + progress * 0.03;
    const rotation = progress * 7;

    heroVisual.style.transform = `translateY(${move}px) scale(${scale}) rotateX(${rotation}deg)`;
    heroCopy.style.transform = `translateY(${move * 0.35}px)`;

    commandChips.forEach((chip, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      chip.style.transform = `translate3d(0, ${move * 0.28 * direction}px, 0)`;
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateScrollEffects();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateScrollEffects);
  updateScrollEffects();
}

