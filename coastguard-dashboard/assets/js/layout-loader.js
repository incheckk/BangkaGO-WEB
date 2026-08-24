(async function () {
  "use strict";

  // Wait until the HTML document is ready
  if (document.readyState === "loading") {
    await new Promise(resolve => {
      document.addEventListener("DOMContentLoaded", resolve, { once: true });
    });
  }

  const sidebarMount = document.getElementById("sidebarMount");
  const topbarMount = document.getElementById("topbarMount");

  // --------------------------------------------------
  // Load HTML partial
  // --------------------------------------------------
  async function loadPartial(path, mountEl) {
    if (!mountEl) {
      console.warn(`Mount element not found for: ${path}`);
      return;
    }

    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(
          `Failed to load ${path}: ${response.status} ${response.statusText}`
        );
      }

      const html = await response.text();
      mountEl.innerHTML = html;

    } catch (error) {
      console.error(error);

      mountEl.innerHTML = `
                <div class="alert alert-danger m-3">
                    <strong>Unable to load layout.</strong><br>
                    ${path}
                </div>
            `;
    }
  }

  // --------------------------------------------------
  // Load Sidebar + Topbar
  // --------------------------------------------------
  await Promise.all([
    loadPartial("partials/sidebar.html", sidebarMount),
    loadPartial("partials/topbar.html", topbarMount)
  ]);

  // --------------------------------------------------
  // Topbar titles and subtitles
  // --------------------------------------------------
  const topbarMeta = {
    "index": {
      title: "Dashboard",
      subtitle: "LGU / Coast Guard monitoring overview"
    },

    "track-vessel": {
      title: "Track Vessel",
      subtitle: "Live fleet movement, route watch, and position history"
    },

    "view-manifests": {
      title: "View Manifests",
      subtitle: "Read-only passenger/cargo manifests with quick export"
    },

    "view-weather": {
      title: "View Weather",
      subtitle: "Marine weather, sea conditions, and advisories"
    },

    "view-bangkeros": {
      title: "View Bangkeros",
      subtitle: "Read-only list of registered bangkero records"
    },

    "report-compliance": {
      title: "Report Compliance Issue",
      subtitle: "Submit compliance concerns for admin review"
    },

    "alerts": {
      title: "View Active Alerts",
      subtitle: "Alert feed with vessel, severity, and response status"
    },

    "reports": {
      title: "View Operator Records",
      subtitle: "Operator activity logs and compliance-related records"
    }
  };

  // --------------------------------------------------
  // Detect current page
  // --------------------------------------------------
  const currentFile =
    window.location.pathname.split("/").pop() || "index.html";

  const currentKey =
    currentFile.replace(/\.html$/, "");

  // --------------------------------------------------
  // Set Topbar title/subtitle
  // --------------------------------------------------
  const titleEl = document.getElementById("topbarTitle");
  const subtitleEl = document.getElementById("topbarSubtitle");

  const meta =
    topbarMeta[currentKey] || topbarMeta["index"];

  if (titleEl) {
    titleEl.textContent = meta.title;
  }

  if (subtitleEl) {
    subtitleEl.textContent = meta.subtitle;
  }

  // --------------------------------------------------
  // Mark active sidebar link
  // --------------------------------------------------
  document
    .querySelectorAll("#cgNav a[data-page]")
    .forEach(link => {

      const page = link.dataset.page;

      if (
        page === currentFile ||
        page === currentKey
      ) {
        link.classList.add("active");
      }
    });

  // --------------------------------------------------
  // Sidebar toggle
  // --------------------------------------------------
  const sidebarToggle = document.getElementById("sidebarToggle");
  const cgMain = document.getElementById("cgMain");

  if (sidebarToggle && cgMain) {
    sidebarToggle.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
    });
  }

})();