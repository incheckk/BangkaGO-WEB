window.AdminTheme = (function () {
  const SIDEBAR_STATE_KEY = 'bangkago_admin_sidebar_collapsed';

  function init() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.getElementById('adminMain');
    const mobileToggle = document.getElementById('sidebarMobileToggle');
    const desktopToggle = document.getElementById('sidebarDesktopToggle');
    const nav = document.getElementById('adminNav');

    if (!sidebar || !main) return;

    // Prevent duplicate init if called again
    if (sidebar.dataset.initialized === '1') return;
    sidebar.dataset.initialized = '1';

    function setActiveLink() {
      if (!nav) return;
      const current = window.location.pathname.split('/').pop() || 'index.html';
      nav.querySelectorAll('a[data-page]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === current);
      });
    }

    function applyDesktopCollapsed(collapsed) {
      if (window.innerWidth < 992) return;
      sidebar.classList.toggle('collapsed', collapsed);
      main.classList.toggle('expanded', collapsed);
      localStorage.setItem(SIDEBAR_STATE_KEY, collapsed ? '1' : '0');
    }

    function initDesktopState() {
      if (window.innerWidth < 992) return;
      const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
      applyDesktopCollapsed(saved === '1');
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (window.innerWidth < 992) {
          sidebar.classList.toggle('show');
        }
      });
    }

    if (desktopToggle) {
      desktopToggle.addEventListener('click', function () {
        applyDesktopCollapsed(!sidebar.classList.contains('collapsed'));
      });
    }

    document.addEventListener('click', function (e) {
      if (window.innerWidth >= 992) return;

      const clickedInsideSidebar = sidebar.contains(e.target);
      const clickedToggle = mobileToggle && mobileToggle.contains(e.target);

      if (!clickedInsideSidebar && !clickedToggle) {
        sidebar.classList.remove('show');
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992) {
        sidebar.classList.remove('show');
        initDesktopState();
      } else {
        sidebar.classList.remove('collapsed');
        main.classList.remove('expanded');
      }
    });

    setActiveLink();
    initDesktopState();
  }

  return { init };
})();