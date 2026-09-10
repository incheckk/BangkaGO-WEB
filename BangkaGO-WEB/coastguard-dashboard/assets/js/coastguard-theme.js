(function () {
  const SIDEBAR_STATE_KEY = 'bangkago_cg_sidebar_collapsed';
  function init(){
    const sidebar = document.getElementById('cgSidebar');
    const main = document.getElementById('cgMain');
    const mobileToggle = document.getElementById('sidebarMobileToggle');
    const desktopToggle = document.getElementById('sidebarDesktopToggle');
    if (!sidebar || !main) return;
    if (sidebar.dataset.initialized === '1') return;
    sidebar.dataset.initialized = '1';

    function applyDesktopCollapsed(collapsed){
      if (window.innerWidth < 992) return;
      sidebar.classList.toggle('collapsed', collapsed);
      main.classList.toggle('expanded', collapsed);
      try{ localStorage.setItem(SIDEBAR_STATE_KEY, collapsed ? '1' : '0'); }catch(e){}
    }
    function initDesktopState(){
      if (window.innerWidth < 992) return;
      try{
        const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
        if (saved === '1') applyDesktopCollapsed(true);
      }catch(e){}
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', function(e){
        e.stopPropagation();
        sidebar.classList.toggle('show');
      });
    }
    if (desktopToggle) {
      desktopToggle.addEventListener('click', function(){
        const willCollapse = !sidebar.classList.contains('collapsed');
        applyDesktopCollapsed(willCollapse);
      });
    }
    document.addEventListener('click', function(e){
      if (!window.matchMedia('(max-width: 991.98px)').matches) return;
      if (!sidebar.classList.contains('show')) return;
      const inside = sidebar.contains(e.target);
      const toggle = mobileToggle && mobileToggle.contains(e.target);
      if (!inside && !toggle) sidebar.classList.remove('show');
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth >= 992){
        sidebar.classList.remove('show');
        initDesktopState();
      } else {
        sidebar.classList.remove('collapsed');
        main.classList.remove('expanded');
      }
    });
    initDesktopState();
    setupNavScroll();
  }
  const NAV_SCROLL_KEY = 'bangkago_cg_nav_scroll';
  function setupNavScroll(){
    const nav = document.getElementById('cgNav');
    if(!nav) return;
    if(nav.dataset.scrollInit === '1') return;
    nav.dataset.scrollInit = '1';
    try{
      const saved = sessionStorage.getItem(NAV_SCROLL_KEY);
      if(saved !== null){
        const top = parseInt(saved,10);
        if(!isNaN(top)) nav.scrollTop = top;
      }
      const active = nav.querySelector('a.active');
      if(active){
        const r = active.getBoundingClientRect();
        const nr = nav.getBoundingClientRect();
        if(r.top < nr.top || r.bottom > nr.bottom) active.scrollIntoView({ block:'nearest', inline:'nearest' });
      }
    }catch(e){}
    let raf=false; let hideTimer=null;
    function persist(){ try{ sessionStorage.setItem(NAV_SCROLL_KEY, String(nav.scrollTop)); }catch(e){} }
    function showWhileScrolling(){
      nav.classList.add('is-scrolling');
      clearTimeout(hideTimer);
      hideTimer=setTimeout(function(){ nav.classList.remove('is-scrolling'); },900);
    }
    nav.addEventListener('scroll', function(){
      if(raf) return;
      raf=true;
      requestAnimationFrame(function(){ persist(); showWhileScrolling(); raf=false; });
    }, { passive:true });
    nav.addEventListener('wheel', function(){ showWhileScrolling(); }, { passive:true });
    nav.addEventListener('touchmove', function(){ showWhileScrolling(); }, { passive:true });
    nav.querySelectorAll('a[data-page]').forEach(function(a){
      a.addEventListener('click', function(){ persist(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 0);
  window.CoastguardTheme = { init: init };
})();
