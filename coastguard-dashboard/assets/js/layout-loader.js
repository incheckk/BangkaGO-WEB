(async function () {
  const isFileProtocol = window.location.protocol === 'file:';
  const sidebarMount = document.getElementById('sidebarMount');
  const topbarMount = document.getElementById('topbarMount');

  function getFallbackHtml(path) {
    switch (path) {
      case 'partials/sidebar.html':
        return `
<aside class="cg-sidebar" id="cgSidebar">
  <a href="index.html" class="cg-brand">
    <div class="brand-logo">
      <img src="../images/logo-BangkaGo.png" alt="BangkaGo Logo" onerror="this.style.display='none'">
    </div>
    <div class="brand-text">
      <h5>Coast<span>Guard</span></h5>
      <small>Monitoring Dashboard</small>
    </div>
  </a>

  <nav class="cg-nav mt-3" id="cgNav">
    <div class="nav-group-label">Monitoring</div>
    <a href="index.html" data-page="index.html"><i class="bi bi-speedometer2"></i> Dashboard</a>
    <a href="tracking.html" data-page="tracking.html"><i class="bi bi-geo-alt-fill"></i> View Live Route</a>
    <a href="alerts.html" data-page="alerts.html"><i class="bi bi-exclamation-triangle-fill"></i> View Active Alerts</a>
    <a href="reports.html" data-page="reports.html"><i class="bi bi-people-fill"></i> View Operator Records</a>

    <div class="nav-group-label">Lookup</div>
    <a href="search-vessel.html" data-page="search-vessel.html"><i class="bi bi-search"></i> Search Vessel</a>
    <a href="search-manifest.html" data-page="search-manifest.html"><i class="bi bi-journal-text"></i> Search Manifest</a>
    <a href="port-history.html" data-page="port-history.html"><i class="bi bi-clock-history"></i> View Port History</a>
    <a href="verify-departure.html" data-page="verify-departure.html"><i class="bi bi-check2-circle"></i> Verify Departure</a>

    <div class="nav-group-label">Reports</div>
    <a href="export-manifest.html" data-page="export-manifest.html"><i class="bi bi-download"></i> Export Manifest</a>

    <div class="nav-group-label">Access</div>
    <a href="#" class="disabled-link"><i class="bi bi-lock-fill"></i> Read Only Access</a>
  </nav>
</aside>`;
      case 'partials/topbar.html':
        return `
<header class="cg-topbar">
  <div class="d-flex align-items-center gap-2">
    <button class="btn topbar-btn d-lg-none" id="sidebarMobileToggle" type="button">
      <i class="bi bi-list"></i>
    </button>
    <button class="btn topbar-btn d-none d-lg-inline-flex" id="sidebarDesktopToggle" type="button">
      <i class="bi bi-layout-sidebar-inset"></i>
    </button>

    <div>
      <h4 id="topbarTitle" class="mb-0">Overview</h4>
      <small id="topbarSubtitle">Coast Guard read-only monitoring dashboard</small>
    </div>
  </div>

  <div class="topbar-right">
    <span class="readonly-pill"><i class="bi bi-eye-fill"></i> Read Only</span>
    <button class="icon-btn" type="button" title="Notifications"><i class="bi bi-bell-fill"></i></button>
  </div>
</header>`;
      default:
        return `<div>Unable to load ${path}</div>`;
    }
  }

  async function loadPartial(path, mountEl) {
    if (!mountEl) return;

    if (isFileProtocol) {
      mountEl.innerHTML = getFallbackHtml(path);
      return;
    }

    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      mountEl.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      mountEl.innerHTML = getFallbackHtml(path);
    }
  }

  await Promise.all([
    loadPartial('partials/sidebar.html', sidebarMount),
    loadPartial('partials/topbar.html', topbarMount),
  ]);

  const topbarMeta = {
    'index': { title: 'Dashboard', subtitle: 'Read-only maritime monitoring overview' },
    'tracking': { title: 'View Live Route', subtitle: 'Live vessel route and movement view' },
    'alerts': { title: 'View Active Alerts', subtitle: 'Safety and maritime warnings timeline' },
    'reports': { title: 'View Operator Records', subtitle: 'Read-only operator and activity records' },
    'search-vessel': { title: 'Search Vessel', subtitle: 'Lookup vessel profile and latest status' },
    'search-manifest': { title: 'Search Manifest', subtitle: 'Lookup manifests and passenger load' },
    'port-history': { title: 'View Port History', subtitle: 'Port arrivals/departures history' },
    'verify-departure': { title: 'Verify Departure', subtitle: 'Read-only departure verification log' },
    'export-manifest': { title: 'Export Manifest', subtitle: 'Download manifest snapshots (read-only)' }
  };

  const page = document.body.dataset.page || 'index';
  const titleEl = document.getElementById('topbarTitle');
  const subtitleEl = document.getElementById('topbarSubtitle');

  if (topbarMeta[page]) {
    if (titleEl) titleEl.textContent = topbarMeta[page].title;
    if (subtitleEl) subtitleEl.textContent = topbarMeta[page].subtitle;
  }

  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#cgNav a[data-page]').forEach(a => {
    if (a.dataset.page === currentFile) a.classList.add('active');
  });

  const script = document.createElement('script');
  script.src = 'assets/js/coastguard-theme.js';
  script.defer = true;
  document.body.appendChild(script);
})();