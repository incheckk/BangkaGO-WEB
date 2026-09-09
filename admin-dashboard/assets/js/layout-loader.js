(async function () {
  const sidebarMount = document.getElementById('sidebarMount');
  const topbarMount = document.getElementById('topbarMount');

  async function loadPartial(path, mountEl) {
    const res = await fetch(path);
    const html = await res.text();
    mountEl.innerHTML = html;
  }

  await Promise.all([
    loadPartial('partials/sidebar.html', sidebarMount),
    loadPartial('partials/topbar.html', topbarMount),
  ]);

  // Topbar titles/subtitles aligned to renamed admin files
  const topbarMeta = {
    'admin-dashboard': {
      title: 'Dashboard',
      subtitle: 'Admin operations overview and live system snapshot'
    },
    'manage-users': {
      title: 'Manage Users',
      subtitle: 'Create, update, and monitor user access'
    },
    'manage-bangkeros': {
      title: 'Manage Bangkeros',
      subtitle: 'Maintain bangkero records and status'
    },
    'manage-bangka': {
      title: 'Manage Bangka',
      subtitle: 'Maintain vessel master list and availability'
    },
    'manage-routes': {
      title: 'Manage Routes',
      subtitle: 'Configure official routes and travel corridors'
    },
    'manage-bookings': {
      title: 'Manage Bookings',
      subtitle: 'Review booking flow, assignments, and status'
    },
    'track-vessel': {
      title: 'Track Vessel',
      subtitle: 'Merged fleet monitoring and real-time vessel tracking'
    },
    'manage-payments': {
      title: 'Manage Payments',
      subtitle: 'Track transactions, verification, and settlements'
    },
    'manage-alerts': {
      title: 'Manage Alerts',
      subtitle: 'Create and monitor operational alert rules'
    },
    'view-reports': {
      title: 'View Reports',
      subtitle: 'Operations, compliance, and system reports'
    },
    'analyze-demand': {
      title: 'Analyze Demand',
      subtitle: 'Demand trends, peak windows, and forecast insights'
    },
    'view-manifests': {
      title: 'View Manifests',
      subtitle: 'Search manifests, view passenger list, and export'
    },
    'view-weather': {
      title: 'View Weather',
      subtitle: 'Weather data and route safety status'
    },
    'report-compliance': {
      title: 'Report Compliance Issue',
      subtitle: 'File compliance incidents with evidence'
    }
  };

  const currentFile = location.pathname.split('/').pop() || 'admin-dashboard.html';
  const currentKey = currentFile.replace('.html', '');

  const titleEl = document.getElementById('topbarTitle');
  const subtitleEl = document.getElementById('topbarSubtitle');
  const meta = topbarMeta[currentKey] || topbarMeta['admin-dashboard'];

  if (titleEl) titleEl.textContent = meta.title;
  if (subtitleEl) subtitleEl.textContent = meta.subtitle;

  document.querySelectorAll('#cgNav a[data-page]').forEach(a => {
    if (a.dataset.page === currentFile) a.classList.add('active');
  });

  // Ensure theme JS is present
  if (!document.querySelector('script[src="assets/js/coastguard-theme.js"]')) {
    const script = document.createElement('script');
    script.src = 'assets/js/coastguard-theme.js';
    script.defer = true;
    document.body.appendChild(script);
  }
})();