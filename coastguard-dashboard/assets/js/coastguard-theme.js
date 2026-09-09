(function () {
  const sidebar = document.getElementById('cgSidebar');
  const main = document.getElementById('cgMain');
  const mobileToggle = document.getElementById('sidebarMobileToggle');
  const desktopToggle = document.getElementById('sidebarDesktopToggle');

  if (!sidebar || !main) return;

  // Mobile toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  // Desktop collapse toggle
  if (desktopToggle) {
    desktopToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('expanded');
    });
  }

  // Close mobile sidebar when clicking outside
  document.addEventListener('click', (e) => {
    const isMobile = window.matchMedia('(max-width: 991.98px)').matches;
    if (!isMobile) return;
    if (!sidebar.classList.contains('show')) return;

    const clickedInsideSidebar = sidebar.contains(e.target);
    const clickedToggle = mobileToggle && mobileToggle.contains(e.target);

    if (!clickedInsideSidebar && !clickedToggle) {
      sidebar.classList.remove('show');
    }
  });
})();