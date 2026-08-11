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

  // Topbar titles/subtitles aligned to your final 8-file setup
  const topbarMeta = {
    'index': {
      title: 'Dashboard',
      subtitle: 'LGU / Coast Guard monitoring overview'
    },
    'track-vessel': {
      title: 'Track Vessel',
      subtitle: 'Live fleet movement, route watch, and position history'
    },
    'view-manifests': {
      title: 'View Manifests',
      subtitle: 'Read-only passenger/cargo manifests with quick export'
    },
    'view-weather': {
      title: 'View Weather',
      subtitle: 'Marine weather, sea conditions, and advisories'
    },
    'view-bangkeros': {
      title: 'View Bangkeros',
      subtitle: 'Read-only list of registered bangkero records'
    },
    'report-compliance': {
      title: 'Report Compliance Issue',
      subtitle: 'Submit compliance concerns for admin review'
    },
    'alerts': {
      title: 'View Active Alerts',
      subtitle: 'Alert feed with vessel, severity, and response status'
    },
    'reports': {
      title: 'View Operator Records',
      subtitle: 'Operator activity logs and compliance-related records'
    }
  };

  // derive current file and page key
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const currentKey = currentFile.replace('.html', '');

  // set topbar content
  const titleEl = document.getElementById('topbarTitle');
  const subtitleEl = document.getElementById('topbarSubtitle');
  const meta = topbarMeta[currentKey] || topbarMeta['index'];

  if (titleEl) titleEl.textContent = meta.title;
  if (subtitleEl) subtitleEl.textContent = meta.subtitle;

  // mark active sidebar link
  document.querySelectorAll('#cgNav a[data-page]').forEach(a => {
    if (a.dataset.page === currentFile) a.classList.add('active');
  });

  // ensure theme behavior script is available
  if (!document.querySelector('script[src="assets/js/coastguard-theme.js"]')) {
    const script = document.createElement('script');
    script.src = 'assets/js/coastguard-theme.js';
    script.defer = true;
    document.body.appendChild(script);
  }
})();