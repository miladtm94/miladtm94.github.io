const largeBreakpoint = 925;


function setTheme(theme) {
  const browserPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let savedTheme;
  try { savedTheme = localStorage.getItem("theme"); } catch (_) {}
  const useTheme = theme || savedTheme || (browserPrefersDark ? "dark" : "light");
  const icon = document.getElementById("theme-icon");

  document.querySelector(".theme-button")?.setAttribute("aria-pressed", String(useTheme === "dark"));

  if (useTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    icon?.classList.remove("fa-sun");
    icon?.classList.add("fa-moon");
  } else {
    document.documentElement.removeAttribute("data-theme");
    icon?.classList.remove("fa-moon");
    icon?.classList.add("fa-sun");
  }
}

function toggleTheme(event) {
  event.preventDefault();
  const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", newTheme); } catch (_) {}
  setTheme(newTheme);
}

function setupNavigation() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const button = nav.querySelector("button[aria-controls]");
  const visibleLinks = nav.querySelector(".visible-links");
  const hiddenLinks = nav.querySelector(".hidden-links");
  const persistTail = visibleLinks?.querySelector(".persist.tail");
  if (!button || !visibleLinks || !hiddenLinks) return;

  function moveHiddenBack() {
    while (hiddenLinks.firstElementChild) {
      visibleLinks.insertBefore(hiddenLinks.firstElementChild, persistTail || null);
    }
  }

  function updateNav() {
    moveHiddenBack();
    button.classList.remove("hidden");

    const available = nav.offsetWidth - button.offsetWidth - 30;
    let guard = 0;
    while (visibleLinks.offsetWidth > available && guard < 20) {
      const movable = Array.from(visibleLinks.children)
        .filter((item) => !item.classList.contains("persist"))
        .pop();
      if (!movable) break;
      hiddenLinks.prepend(movable);
      guard += 1;
    }

    const hasHiddenLinks = hiddenLinks.children.length > 0;
    button.classList.toggle("hidden", !hasHiddenLinks);
    if (!hasHiddenLinks) {
      button.classList.remove("close");
      hiddenLinks.classList.add("hidden");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
    }
  }

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    button.setAttribute("aria-label", expanded ? "Open navigation menu" : "Close navigation menu");
    button.classList.toggle("close", !expanded);
    hiddenLinks.classList.toggle("hidden", expanded);
  });

  function closeMenu() {
    hiddenLinks.classList.add("hidden");
    button.classList.remove("close");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open navigation menu");
  }
  nav.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeMenu(); button.focus(); }
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) closeMenu();
  });
  hiddenLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  window.addEventListener("resize", updateNav, { passive: true });
  updateNav();
}

function setupAuthorLinks() {
  const button = document.querySelector(".author__urls-wrapper button");
  const links = document.getElementById("author-connect-links");
  if (!button || !links) return;

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    button.classList.toggle("open", !expanded);
    links.style.display = expanded ? "none" : "block";
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= largeBreakpoint) {
      links.style.display = "block";
      button.setAttribute("aria-expanded", "false");
      button.classList.remove("open");
    } else if (!button.classList.contains("open")) {
      links.style.display = "none";
    }
  }, { passive: true });
}

function setupSmoothScroll() {
  const masthead = document.querySelector(".masthead");
  const quicknav = document.querySelector(".sticky-quicknav");
  function measureOffsets() {
    const headerHeight = masthead?.offsetHeight || 70;
    document.documentElement.style.setProperty("--masthead-h", `${headerHeight}px`);
    document.documentElement.style.setProperty("--anchor-offset", `${headerHeight + (quicknav?.offsetHeight || 0) + 20}px`);
  }
  measureOffsets();
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(measureOffsets);
    if (masthead) observer.observe(masthead);
    if (quicknav) observer.observe(quicknav);
  }
  window.addEventListener("resize", measureOffsets, { passive: true });
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch (_) { return; }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.pushState(null, "", url.hash);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
  const links = Array.from(document.querySelectorAll('.sticky-quicknav a[href^="#"]'));
  if (links.length && window.IntersectionObserver) {
    const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      links.forEach(link => {
        if (link.hash === `#${visible[0].target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
}

function setupStickyFooter() {
  const footer = document.querySelector(".page__footer");
  if (!footer) return;

  function updateFooterSpace() {
    document.body.style.paddingBottom = "0";
    document.body.style.marginBottom = `${footer.offsetHeight}px`;
  }

  window.addEventListener("resize", updateFooterSpace, { passive: true });
  updateFooterSpace();
}

function initializeSite() {
  setTheme();
  setupNavigation();
  setupAuthorLinks();
  setupSmoothScroll();
  setupStickyFooter();

  document.getElementById("theme-toggle")?.querySelector("button")?.addEventListener("click", toggleTheme);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    try { if (localStorage.getItem("theme")) return; } catch (_) {}
    setTheme(event.matches ? "dark" : "light");
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeSite);
else initializeSite();
