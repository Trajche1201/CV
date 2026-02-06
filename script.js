// Mobile menu
const topbar = document.querySelector(".topbar");
const toggle = document.querySelector(".nav-toggle");

toggle?.addEventListener("click", () => {
  const open = topbar.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

// Close menu on link click (mobile)
document.querySelectorAll(".nav a").forEach(a => {
  a.addEventListener("click", () => {
    if (topbar.classList.contains("open")) {
      topbar.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("in");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Animated counters (start when stats become visible)
const counters = document.querySelectorAll("[data-counter]");
let countersStarted = false;

function animateCounter(el, to, duration = 900) {
  const start = performance.now();
  const from = 0;

  function tick(now) {
    const p = Math.min(1, (now - start) / duration);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - p, 3);
    const value = Math.round(from + (to - from) * eased);
    el.textContent = value + (to === 100 ? "%" : (to === 999 ? "∞" : "+"));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const stats = document.querySelector(".stats");
if (stats) {
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(el => {
          const to = parseInt(el.getAttribute("data-counter"), 10);
          // Special formatting:
          if (to === 999) { el.textContent = "∞"; return; }
          animateCounter(el, to);
        });
      }
    });
  }, { threshold: 0.25 });
  statsIO.observe(stats);
}

// Floating dots background
const dotsWrap = document.querySelector(".bg-dots");

function makeDot() {
  const dot = document.createElement("span");
  dot.className = "dot";
  const size = Math.random() * 6 + 3;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  dot.style.left = `${Math.random() * 100}%`;
  dot.style.top = `${Math.random() * 100}%`;
  dot.style.opacity = `${Math.random() * 0.35 + 0.08}`;
  dot.style.transform = `translate(-50%, -50%)`;
  dot.style.animationDuration = `${Math.random() * 10 + 8}s`;
  dot.style.animationDelay = `${Math.random() * 4}s`;
  dotsWrap.appendChild(dot);
}

if (dotsWrap) {
  // Inject dot styles (kept in JS to keep CSS clean)
  const style = document.createElement("style");
  style.textContent = `
    .dot{
      position:absolute;
      border-radius:999px;
      background: rgba(156,255,46,.85);
      box-shadow: 0 0 18px rgba(156,255,46,.25);
      animation: floaty linear infinite;
      filter: blur(.2px);
    }
    @keyframes floaty{
      0%{ transform: translate(-50%, -50%) translateY(0); }
      50%{ transform: translate(-50%, -50%) translateY(-18px); }
      100%{ transform: translate(-50%, -50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);

  const DOTS = window.matchMedia("(max-width: 720px)").matches ? 22 : 38;
  for (let i = 0; i < DOTS; i++) makeDot();
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form (front-end only)
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
});

