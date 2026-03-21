const tabs = ["software", "performing-arts", "hobby"];
const defaultTab = "software";

const contactInfo = [
  { label: "Email", href: "mailto:jnater@salmon.net", text: "jnater@salmon.net" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jnater", text: "linkedin.com/in/jnater" },
  { label: "Phone", href: "tel:+14084646915", text: "(408) 464-6915" },
  { label: "Location", href: "https://maps.google.com/?q=San+Luis+Obispo,+CA", text: "San Luis Obispo, CA" }
];

const markdownContentEl = document.getElementById("markdown-content");
const statusEl = document.getElementById("status");
const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
const contactListEl = document.getElementById("contact-list");

const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
  const src = resolveImagePath(href || "");
  const safeAlt = text || "";
  const safeTitle = title ? ` title="${escapeHtml(title)}"` : "";
  return `<img src="${src}" alt="${escapeHtml(safeAlt)}"${safeTitle} loading="lazy" />`;
};

marked.use({ renderer });

function resolveImagePath(rawHref) {
  if (!rawHref) return "";
  if (/^(https?:|data:|\/)/i.test(rawHref)) return rawHref;

  let clean = rawHref.replace(/^\.\//, "");
  if (clean.startsWith("images/")) {
    clean = `content/${clean}`;
  } else if (!clean.startsWith("content/")) {
    clean = `content/${clean}`;
  }

  return clean;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setStatus(message, isError = false) {
  statusEl.textContent = isError ? message : "";
}

function renderContacts() {
  contactInfo.forEach((item) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${item.label}: `;

    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.text;
    if (item.href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    li.appendChild(strong);
    li.appendChild(link);
    contactListEl.appendChild(li);
  });
}

function setActiveTab(tab) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function attachImageFallbacks() {
  markdownContentEl.querySelectorAll("img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        const p = document.createElement("p");
        p.className = "status error";
        p.textContent = `Image failed to load: ${img.getAttribute("src") || "unknown source"}`;
        img.insertAdjacentElement("afterend", p);
        img.remove();
      },
      { once: true }
    );
  });
}

async function loadTab(tab) {
  if (!tabs.includes(tab)) return;

  setActiveTab(tab);
  setStatus("");

  try {
    const response = await fetch(`content/${tab}.md`);
    if (!response.ok) {
      throw new Error(`Could not load content/${tab}.md (${response.status})`);
    }

    const markdown = await response.text();
    const parsed = marked.parse(markdown);
    const sanitized = DOMPurify.sanitize(parsed, {
      USE_PROFILES: { html: true }
    });

    markdownContentEl.innerHTML = sanitized;
    attachImageFallbacks();
  } catch (error) {
    markdownContentEl.innerHTML = "";
    setStatus(error.message || "Unable to load this section.", true);
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    loadTab(button.dataset.tab);
  });
});

renderContacts();
loadTab(defaultTab);
