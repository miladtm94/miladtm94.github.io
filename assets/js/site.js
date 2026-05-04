const largeBreakpoint = 925;
const mastheadOffset = 70;

function setTheme(theme) {
  const browserPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const useTheme = theme || savedTheme || (browserPrefersDark ? "dark" : "light");
  const icon = document.getElementById("theme-icon");

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
  localStorage.setItem("theme", newTheme);
  setTheme(newTheme);
}

function setupNavigation() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const button = nav.querySelector("button");
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
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      const samePath = url.pathname === window.location.pathname;

      if (samePath && url.hash) {
        const target = document.querySelector(url.hash);
        if (target) {
          event.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - mastheadOffset;
          window.scrollTo({ top, behavior: "smooth" });
          history.pushState(null, "", url.hash);
        }
      } else if (samePath && !url.hash) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
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

document.addEventListener("DOMContentLoaded", () => {
  setTheme();
  setupNavigation();
  setupAuthorLinks();
  setupSmoothScroll();
  setupStickyFooter();

  document.getElementById("theme-toggle")?.querySelector("a")?.addEventListener("click", toggleTheme);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) setTheme(event.matches ? "dark" : "light");
  });
});
