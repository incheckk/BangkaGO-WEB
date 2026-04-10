(async function () {
  async function injectPartial(selector, path) {
    const mount = document.querySelector(selector);
    if (!mount) return;

    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      mount.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      mount.innerHTML = `
        <div style="padding:12px;background:#fff3cd;border:1px solid #ffe69c;border-radius:8px;margin:12px;">
          Failed to load partial: <strong>${path}</strong>
        </div>
      `;
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