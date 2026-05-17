(async function () {
  const isFileProtocol = window.location.protocol === 'file:';

  function getFallbackHtml(path) {
    switch (path) {
      case 'partials/sidebar.html':
        return `
<aside class="admin-sidebar" id="adminSidebar">
  <a href="index.html" class="admin-brand">
    <div class="brand-logo">
      <img src="../images/logo-BangkaGo.png" alt="BangkaGo Logo" onerror="this.style.display='none'">
    </div>
    <div class="brand-text">
      <h5>Bangka<span>Go</span></h5>
      <small>Admin Dashboard</small>
    </div>
  </a>

  <nav class="admin-nav mt-3" id="adminNav">
    <div class="nav-group-label">Core</div>
    <a href="index.html" data-page="index.html">
      <i class="bi bi-grid-1x2-fill"></i> Dashboard
    </a>

    <div class="nav-group-label">Management</div>
    <a href="users.html" data-page="users.html">
      <i class="bi bi-people-fill"></i> User Management
    </a>
    <a href="operators.html" data-page="operators.html">
      <i class="bi bi-person-check-fill"></i> Bangkeros
    </a>
    <a href="bookings.html" data-page="bookings.html">
      <i class="bi bi-journal-check"></i> Bookings
    </a>
    <a href="fleet-routes.html" data-page="fleet-routes.html">
      <i class="bi bi-boat"></i> Fleet & Routes
    </a>

    <div class="nav-group-label">Operations</div>
    <a href="tracking.html" data-page="tracking.html">
      <i class="bi bi-geo-alt-fill"></i> Tracking & Monitoring
    </a>
    <a href="payments.html" data-page="payments.html">
      <i class="bi bi-cash-coin"></i> Payments & Revenue
    </a>
    <a href="alerts.html" data-page="alerts.html">
      <i class="bi bi-exclamation-triangle-fill"></i> Safety & Alerts
    </a>
    <a href="reports.html" data-page="reports.html">
      <i class="bi bi-file-earmark-bar-graph-fill"></i> Reports & Logs
    </a>

    <div class="nav-group-label">Intelligence</div>
    <a href="analytics.html" data-page="analytics.html">
      <i class="bi bi-cpu-fill"></i> Analytics / ML Insights
    </a>

    <div class="nav-group-label">Comms</div>
    <a href="broadcast.html" data-page="broadcast.html">
      <i class="bi bi-megaphone-fill"></i> Broadcast
    </a>
  </nav>
</aside>`;
      case 'partials/topbar.html':
        return `
<header class="admin-topbar">
  <div class="d-flex align-items-center gap-2">
    <button id="sidebarMobileToggle" class="btn btn-light d-lg-none topbar-btn">
      <i class="bi bi-list fs-5"></i>
    </button>
    <button id="sidebarDesktopToggle" class="btn btn-light d-none d-lg-inline-flex topbar-btn" title="Collapse Sidebar">
      <i class="bi bi-layout-sidebar-inset"></i>
    </button>
    <div>
      <h4 class="mb-0" id="topbarTitle">Dashboard</h4>
      <small id="topbarSubtitle">Admin control panel</small>
    </div>
  </div>

  <div class="topbar-right">
    <button class="icon-btn"><i class="bi bi-bell"></i></button>
    <button class="icon-btn"><i class="bi bi-envelope"></i></button>
    <div class="admin-pill">
      <i class="bi bi-person-circle me-1"></i> BiniAiah
    </div>
  </div>
</header>`;
      default:
        return `<div>Unable to load ${path}</div>`;
    }
  }

  async function injectPartial(selector, path) {
    const mount = document.querySelector(selector);
    if (!mount) return;

    if (isFileProtocol) {
      mount.innerHTML = getFallbackHtml(path);
      return;
    }

    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      mount.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      mount.innerHTML = getFallbackHtml(path);
    }
  }

  // Inject shared partials
  await injectPartial('#sidebarMount', 'partials/sidebar.html');
  await injectPartial('#topbarMount', 'partials/topbar.html');

  // Topbar dynamic labels by page
  const page = document.body.getAttribute('data-page') || 'index';

  const topbarMeta = {
    index: { title: 'Dashboard Overview', subtitle: 'Monitor boats, users, bookings, and operations' },
    users: { title: 'User Management', subtitle: 'View users, profiles, status, and roles' },
    operators: { title: 'Bangkeros', subtitle: 'Review documents and approve/reject bangkeros' },
    bookings: { title: 'Bookings', subtitle: 'View bookings, details, statuses, and manifests' },
    'fleet-routes': { title: 'Fleet & Routes', subtitle: 'Manage bangka, routes, deactivation, and vessel history' },
    tracking: { title: 'Tracking & Monitoring', subtitle: 'Parcel tracking, speed, ETA boards, and live map' },
    payments: { title: 'Payments & Revenue', subtitle: 'Revenue insights and payment records' },
    alerts: { title: 'Safety & Alerts', subtitle: 'Weather, alerts, and resolution history' },
    reports: { title: 'Reports & Logs', subtitle: 'User reports, audit logs, and exports' },
    analytics: { title: 'Analytics / ML Insights', subtitle: 'Predictions, model info, and retraining' },
    broadcast: { title: 'Broadcast', subtitle: 'Send system-wide messages to selected audience' }
  };

  const titleEl = document.getElementById('topbarTitle');
  const subtitleEl = document.getElementById('topbarSubtitle');

  if (titleEl && subtitleEl && topbarMeta[page]) {
    titleEl.textContent = topbarMeta[page].title;
    subtitleEl.textContent = topbarMeta[page].subtitle;
  }

  // Init interactive behaviors after partials are rendered
  if (window.AdminTheme && typeof window.AdminTheme.init === 'function') {
    window.AdminTheme.init();
  }
})();