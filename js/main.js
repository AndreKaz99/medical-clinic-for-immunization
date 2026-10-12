/* =========================================================
   Medical Clinic for Immunization — interactions
   ========================================================= */

/* ---------- EDIT YOUR CLINIC DETAILS HERE ---------- */
const CLINIC = {
  phone: "",   // e.g. "(818) 123-4567" — leave empty to hide
  email: "",   // e.g. "info@yourclinic.com" — leave empty to hide
  address: "Glendale, California", // full street address shows on the site and opens in Google Maps
  yelpUrl: "https://www.yelp.com/biz/medical-clinic-for-immunization-glendale-2",
};
/* --------------------------------------------------- */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Clinic details ---------- */
  const phoneLink = $(".js-phone");
  if (CLINIC.phone) {
    phoneLink.href = "tel:" + CLINIC.phone.replace(/[^\d+]/g, "");
    $(".js-phone-text").textContent = CLINIC.phone;
  } else phoneLink.remove();

  const emailLink = $(".js-email");
  if (CLINIC.email) {
    emailLink.href = "mailto:" + CLINIC.email;
    $(".js-email-text").textContent = CLINIC.email;
  } else emailLink.remove();

  $(".js-address-text").textContent = CLINIC.address;
  $(".js-map").href = "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Medical Clinic for Immunization " + CLINIC.address);
  $$(".js-yelp, .js-yelp-read").forEach((a) => (a.href = CLINIC.yelpUrl));
  $(".js-year").textContent = new Date().getFullYear();

  /* ---------- Split headings into words ---------- */
  $$(".split").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
            const w = document.createElement("span");
            w.className = "word";
            const inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--d", i++ * 70 + "ms");
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") walk(child);
      });
    };
    walk(el);
  });

  /* ---------- Reveal on scroll ---------- */
  $$(".reveal").forEach((el) => el.style.setProperty("--d", (el.dataset.delay || 0) + "ms"));

  // Stagger grid children automatically
  $$(".vax-grid .vax-card").forEach((el, i) => el.style.setProperty("--d", (i % 3) * 110 + "ms"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          el.classList.add("in");
          io.unobserve(el);
          // Drop the entrance delay once revealed so hover effects respond instantly
          if (el.classList.contains("reveal")) {
            setTimeout(() => el.style.setProperty("--d", "0ms"), 1200 + (+el.dataset.delay || 0) + 400);
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal, .split, .stack-card").forEach((el) => io.observe(el));

  // Hero animates immediately
  requestAnimationFrame(() => $(".hero-title").classList.add("in"));

  /* ---------- Counters ---------- */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const dur = reduceMotion ? 0 : 1800;
      const t0 = performance.now();
      const tick = (t) => {
        const p = dur ? Math.min((t - t0) / dur, 1) : 1;
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => counterIO.observe(el));

  /* ---------- Scroll-driven effects ---------- */
  const nav = $(".nav");
  const bar = $(".progress span");
  const fab = $(".yelp-fab");
  const parallax = $$("[data-parallax]");
  const stackCards = $$(".stack-card");
  stackCards.forEach((c, i) => c.style.setProperty("--i", i));
  const stepsLine = $(".steps-line");
  const steps = $(".steps");
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;

    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("scrolled", y > 30);
    if (!document.body.classList.contains("menu-open")) {
      nav.classList.toggle("hidden", y > lastY && y > 400);
    }
    fab.classList.toggle("show", y > vh * 0.8);

    if (!reduceMotion) {
      parallax.forEach((el) => {
        el.style.transform = `translate3d(0, ${y * +el.dataset.parallax}px, 0)`;
      });

      // Stacked cards: shrink & dim cards as the next one covers them
      stackCards.forEach((card, i) => {
        const next = stackCards[i + 1];
        if (!next) return;
        const r = next.getBoundingClientRect();
        const top = card.getBoundingClientRect().top;
        const overlap = Math.min(Math.max((top + card.offsetHeight - r.top) / card.offsetHeight, 0), 1);
        card.style.transform = `scale(${1 - overlap * 0.06})`;
        card.style.filter = `brightness(${1 - overlap * 0.35})`;
      });
    }

    // Process line progress
    const sr = steps.getBoundingClientRect();
    const p = Math.min(Math.max((vh * 0.75 - sr.top) / sr.height, 0), 1);
    stepsLine.style.setProperty("--p", p);

    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $(".nav-toggle");
  const menu = $(".mobile-menu");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", !open);
    nav.classList.remove("hidden");
  };
  toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------- Vaccine filters ---------- */
  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => {
        c.classList.toggle("active", c === chip);
        c.setAttribute("aria-selected", c === chip);
      });
      const f = chip.dataset.filter;
      $$(".vax-card").forEach((card) => {
        const match = f === "all" || card.dataset.cat.split(" ").includes(f);
        card.classList.toggle("filtered-out", !match);
      });
    });
  });

  /* ---------- Yelp star rating ---------- */
  const stars = $$(".star");
  const msg = $(".star-msg");
  const messages = {
    0: "Tap a star to start",
    1: "We're sorry — tell us how we can do better.",
    2: "Thanks — your feedback helps us improve.",
    3: "Thank you! Share your thoughts on Yelp.",
    4: "Wonderful! We'd love to hear more on Yelp.",
    5: "You made our day! Share the love on Yelp ✦",
  };
  let rating = 0;
  const paint = (n) => stars.forEach((s, i) => s.classList.toggle("on", i < n));
  stars.forEach((s) => {
    const v = +s.dataset.v;
    s.addEventListener("mouseenter", () => paint(v));
    s.addEventListener("focus", () => paint(v));
    s.addEventListener("click", () => {
      rating = v;
      paint(v);
      msg.textContent = messages[v] + " Opening Yelp…";
      stars.slice(0, v).forEach((st, i) => {
        st.classList.remove("pop");
        void st.offsetWidth;
        st.style.animationDelay = i * 60 + "ms";
        st.classList.add("pop");
      });
      setTimeout(() => window.open(CLINIC.yelpUrl, "_blank", "noopener"), 900);
    });
  });
  $(".stars").addEventListener("mouseleave", () => paint(rating));

  /* ---------- Hover-only flourishes ---------- */
  if (!canHover || reduceMotion) return;

  // Cursor glow
  const glow = $(".cursor-glow");
  let gx = 0, gy = 0, cx = 0, cy = 0;
  window.addEventListener("mousemove", (e) => { gx = e.clientX; gy = e.clientY; }, { passive: true });
  const loop = () => {
    cx += (gx - cx) * 0.12;
    cy += (gy - cy) * 0.12;
    glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();

  // Magnetic buttons
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });

  // 3D tilt + spotlight on pillars
  $$(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `rotateY(${(px - 0.5) * 8}deg) rotateX(${(0.5 - py) * 8}deg)`;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
})();
