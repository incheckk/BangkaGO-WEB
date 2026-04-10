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