const USERNAME = "pirs5";
const REPO_API = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;

const fallbackServices = [
  {
    name: "p5-digital-business-card",
    html_url: "https://github.com/pirs5/p5-digital-business-card",
    homepage: "https://pirs5.github.io/p5-digital-business-card/",
    has_pages: true,
    description: "Digital business card."
  },
  {
    name: "p5_pdf-compressor-desktop",
    html_url: "https://github.com/pirs5/p5_pdf-compressor-desktop",
    homepage: "",
    has_pages: false,
    description: "Desktop PDF compression service."
  },
  {
    name: "p5_pdf_compressor",
    html_url: "https://github.com/pirs5/p5_pdf_compressor",
    homepage: "",
    has_pages: false,
    description: "Web PDF compression service."
  },
  {
    name: "pier5-bd-card",
    html_url: "https://github.com/pirs5/pier5-bd-card",
    homepage: "https://pirs5.github.io/pier5-bd-card/",
    has_pages: true,
    description: "Business card service."
  },
  {
    name: "pier5-office-simulator",
    html_url: "https://github.com/pirs5/pier5-office-simulator",
    homepage: "https://pirs5.github.io/pier5-office-simulator/",
    has_pages: true,
    description: "Office simulator service."
  }
];

const grid = document.getElementById("services-grid");
const count = document.getElementById("service-count");
const cardTemplate = document.getElementById("card-template");

function prettifyName(name) {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

function isServiceRepo(repo) {
  if (!repo || !repo.name) return false;
  const blocked = ["pirs5-hub"];
  if (blocked.includes(repo.name.toLowerCase())) return false;
  return true;
}

function getRepoLink(repo) {
  if (repo.has_pages && repo.homepage) {
    return {
      url: repo.homepage,
      label: "Open Live Service",
      kind: "Live"
    };
  }

  return {
    url: repo.html_url,
    label: "View on GitHub",
    kind: "Repo"
  };
}

function renderServices(repos) {
  grid.innerHTML = "";

  if (!repos.length) {
    count.textContent = "No public services found.";
    return;
  }

  count.textContent = `${repos.length} linked service${repos.length === 1 ? "" : "s"}`;

  repos.forEach((repo, index) => {
    const node = cardTemplate.content.cloneNode(true);
    const card = node.querySelector(".service-card");
    node.querySelector(".service-name").textContent = prettifyName(repo.name);
    node.querySelector(".service-description").textContent =
      repo.description || "Service repository on GitHub.";
    const link = node.querySelector(".service-link");
    const linkText = node.querySelector(".service-link-text");
    const kind = node.querySelector(".service-kind");
    const repoLink = getRepoLink(repo);
    kind.textContent = repoLink.kind;
    link.href = repoLink.url;
    linkText.textContent = repoLink.label;
    card.style.animationDelay = `${index * 70}ms`;
    grid.appendChild(node);
  });
}

async function loadServices() {
  try {
    const response = await fetch(REPO_API);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const repos = await response.json();
    const services = repos
      .filter(isServiceRepo)
      .sort((a, b) => a.name.localeCompare(b.name));
    renderServices(services);
  } catch (error) {
    renderServices(fallbackServices);
  }
}

loadServices();
