/* ============================== dashboard.js ============================== */

/* ============================== Dashboard-Only Scripts ============================== */
(function () {
  function isAdminDashboard() {
    return window.location.pathname.indexOf('/dashboard/admin/') !== -1;
  }

  function getDashboardRouter() {
    return document.querySelector('[data-dashboard-router]');
  }

  function getDashboardRouteConfig() {
    var root = getDashboardRouter();
    var panels;

    if (!root) {
      return null;
    }

    panels = Array.from(root.querySelectorAll('[data-dashboard-panel]'));

    if (!panels.length) {
      return null;
    }

    return {
      root: root,
      panels: panels,
      defaultPanel: root.getAttribute('data-dashboard-default') || panels[0].getAttribute('data-dashboard-panel')
    };
  }

  function normalizeDashboardRoute(route, config) {
    var value = (route || '').replace(/^#/, '').trim();
    var exists = config.panels.some(function (panel) {
      return panel.getAttribute('data-dashboard-panel') === value;
    });

    return exists ? value : config.defaultPanel;
  }

  function getCurrentDashboardRoute() {
    var config = getDashboardRouteConfig();

    if (!config) {
      return '';
    }

    return normalizeDashboardRoute(window.location.hash, config);
  }

  function getDashboardLinkMeta(link) {
    var routeTarget = (link.getAttribute('data-dashboard-target') || '').trim();
    var href = link.getAttribute('href') || '';
    var targetUrl;
    var route;
    var page;

    if (routeTarget) {
      return {
        type: 'panel',
        route: routeTarget
      };
    }

    if (!href) {
      return null;
    }

    if (href.charAt(0) === '#') {
      return {
        type: 'panel',
        route: href.slice(1)
      };
    }

    targetUrl = new URL(href, window.location.href);
    route = targetUrl.hash.replace(/^#/, '').trim();
    page = targetUrl.pathname.split('/').pop() || '';

    if ((page === 'client-dashboard.html' || page === 'admin-dashboard.html') && route) {
      return {
        type: 'panel',
        route: route
      };
    }

    if (page === 'course-player.html') {
      page = 'my-courses.html';
    }

    return {
      type: 'page',
      page: page
    };
  }

  /* ============================== Dashboard Navigation ============================== */
  function markCurrentDashboardLinks(activeRouteOverride) {
    var routerConfig = getDashboardRouteConfig();
    var currentRoute = routerConfig ? normalizeDashboardRoute(activeRouteOverride || window.location.hash, routerConfig) : '';
    var currentPage = getCurrentDashboardPage();

    document.querySelectorAll('.dashboard-nav__link').forEach(function (link) {
      var linkMeta = getDashboardLinkMeta(link);
      var isCurrent = false;

      if (!linkMeta) {
        return;
      }

      if (routerConfig && linkMeta.type === 'panel') {
        isCurrent = linkMeta.route === currentRoute;
      } else if (!routerConfig && linkMeta.type === 'page') {
        isCurrent = linkMeta.page === currentPage;
      } else if (!routerConfig && currentPage === 'my-courses.html' && linkMeta.type === 'panel') {
        isCurrent = linkMeta.route === 'courses';
      }

      link.classList.toggle('is-current', isCurrent);

      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ============================== Dashboard Identity ============================== */
  function normalizeDashboardLabels() {
    var sidebar = document.querySelector('.dashboard-sidebar');

    if (!sidebar) {
      return;
    }

    var eyebrow = sidebar.querySelector('.eyebrow');
    var heading = sidebar.querySelector('h2');
    var description = sidebar.querySelector('p');

    if (isAdminDashboard()) {
      if (eyebrow) {
        eyebrow.textContent = 'Admin area';
      }

      if (heading) {
        heading.textContent = 'Admin Panel';
      }

      if (description) {
        description.textContent = 'Manage clients, content, bookings, and reporting.';
      }

      return;
    }

    if (eyebrow) {
      eyebrow.textContent = 'User area';
    }

    if (heading) {
      heading.textContent = 'Dashboard';
    }

    if (description) {
      description.textContent = 'Track progress, book calls, and continue your plan.';
    }
  }

  function getCurrentDashboardPage() {
    var currentPage = window.location.pathname.split('/').pop() || '';

    if (currentPage === 'course-player.html') {
      return 'my-courses.html';
    }

    return currentPage;
  }

  /* ============================== Dashboard Panels ============================== */
  function initDashboardRouter() {
    var config = getDashboardRouteConfig();
    var descriptionMeta = document.querySelector('meta[name="description"]');
    var isSyncingHash = false;

    function updateHash(route) {
      if (window.location.hash.replace(/^#/, '') === route) {
        return;
      }

      isSyncingHash = true;
      window.location.hash = route;

      window.setTimeout(function () {
        isSyncingHash = false;
      }, 0);
    }

    function syncRoute(options) {
      var activeRoute = normalizeDashboardRoute(
        options && options.route ? options.route : window.location.hash,
        config
      );
      var activePanel;

      config.panels.forEach(function (panel) {
        var isActive = panel.getAttribute('data-dashboard-panel') === activeRoute;

        panel.hidden = !isActive;
        panel.classList.toggle('is-active', isActive);

        if (isActive) {
          activePanel = panel;
        }
      });

      config.root.classList.add('dashboard-router-ready');

      markCurrentDashboardLinks(activeRoute);

      if (activePanel) {
        document.title = activePanel.getAttribute('data-dashboard-title') || document.title;

        if (descriptionMeta && activePanel.getAttribute('data-dashboard-description')) {
          descriptionMeta.setAttribute('content', activePanel.getAttribute('data-dashboard-description'));
        }
      }

      if (options && options.scrollToTop) {
        window.scrollTo(0, 0);
      }

      if (!options || options.updateHash !== false) {
        updateHash(activeRoute);
      }

      document.dispatchEvent(new CustomEvent('northline:dashboardroutechange', {
        detail: { route: activeRoute }
      }));
    }

    if (!config) {
      return;
    }

    document.querySelectorAll('[data-dashboard-target]').forEach(function (control) {
      control.addEventListener('click', function (event) {
        var targetRoute = normalizeDashboardRoute(control.getAttribute('data-dashboard-target'), config);

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        event.preventDefault();

        if (window.location.hash.replace(/^#/, '') === targetRoute) {
          syncRoute({ route: targetRoute, scrollToTop: true, updateHash: false });
          return;
        }

        syncRoute({ route: targetRoute, scrollToTop: true });
      });
    });

    window.addEventListener('hashchange', function () {
      if (isSyncingHash) {
        return;
      }

      syncRoute({ scrollToTop: true, updateHash: false });
    });

    syncRoute({ scrollToTop: false, updateHash: false });
  }

  /* ============================== Dashboard Sidebar ============================== */
  function initDashboardSidebar() {
    var sidebar = document.querySelector('.dashboard-sidebar');
    var utilityActions = document.querySelector('.utility-bar__actions');

    if (!sidebar || !utilityActions) {
      return;
    }

    function isModifiedClick(event, link) {
      return event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.getAttribute('target') === '_blank' ||
        link.hasAttribute('download');
    }

    sidebar.removeAttribute('data-reveal');
    sidebar.classList.add('is-visible');

    if (!sidebar.id) {
      sidebar.id = 'dashboard-sidebar-panel';
    }

    var toggleButton = utilityActions.querySelector('[data-dashboard-sidebar-toggle]');

    if (!toggleButton) {
      toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'icon-toggle dashboard-sidebar-toggle';
      toggleButton.setAttribute('data-dashboard-sidebar-toggle', '');
      toggleButton.setAttribute('aria-controls', sidebar.id);
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.setAttribute('aria-label', 'Open dashboard menu');
      toggleButton.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">menu</span>';
      utilityActions.appendChild(toggleButton);
    }

    var closeButton = sidebar.querySelector('[data-dashboard-sidebar-close]');

    if (!closeButton) {
      closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'icon-toggle dashboard-sidebar__close';
      closeButton.setAttribute('data-dashboard-sidebar-close', '');
      closeButton.setAttribute('aria-label', 'Close dashboard menu');
      closeButton.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">close</span>';
      sidebar.insertBefore(closeButton, sidebar.firstChild);
    }

    var controlsHost = sidebar.querySelector('[data-dashboard-mobile-controls]');

    if (!controlsHost) {
      controlsHost = document.createElement('div');
      controlsHost.className = 'dashboard-sidebar__controls';
      controlsHost.setAttribute('data-dashboard-mobile-controls', '');
      sidebar.insertBefore(controlsHost, closeButton.nextSibling);
    }

    var sidebarShell = sidebar.closest('.dashboard-app') || sidebar.parentElement || document.body;
    var backdrop = document.querySelector('[data-dashboard-sidebar-backdrop]');

    if (!backdrop) {
      backdrop = document.createElement('button');
      backdrop.type = 'button';
      backdrop.className = 'dashboard-sidebar-backdrop';
      backdrop.hidden = true;
      backdrop.setAttribute('data-dashboard-sidebar-backdrop', '');
      backdrop.setAttribute('aria-label', 'Close dashboard menu');
    }

    if (backdrop.parentElement !== sidebarShell) {
      sidebarShell.appendChild(backdrop);
    }

    function usesOverlaySidebar() {
      return window.innerWidth <= 1024;
    }

    function moveControlsToSidebar() {
      utilityActions.querySelectorAll('[data-theme-toggle], [data-rtl-toggle]').forEach(function (button) {
        controlsHost.appendChild(button);
      });
    }

    function moveControlsToToolbar() {
      Array.from(controlsHost.querySelectorAll('[data-theme-toggle], [data-rtl-toggle]')).forEach(function (button) {
        utilityActions.insertBefore(button, toggleButton);
      });
    }

    function closeSidebar(returnFocus) {
      document.body.classList.remove('dashboard-sidebar-open');
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-active');
      backdrop.hidden = true;
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.setAttribute('aria-label', 'Open dashboard menu');

      if (usesOverlaySidebar()) {
        sidebar.setAttribute('aria-hidden', 'true');
      } else {
        sidebar.removeAttribute('aria-hidden');
      }

      if (returnFocus) {
        toggleButton.focus();
      }
    }

    function openSidebar() {
      if (!usesOverlaySidebar()) {
        return;
      }

      document.body.classList.add('dashboard-sidebar-open');
      sidebar.classList.add('is-open');
      sidebar.setAttribute('aria-hidden', 'false');
      backdrop.hidden = false;
      backdrop.classList.add('is-active');
      toggleButton.setAttribute('aria-expanded', 'true');
      toggleButton.setAttribute('aria-label', 'Close dashboard menu');
      closeButton.focus();
    }

    function syncSidebarState() {
      if (usesOverlaySidebar()) {
        moveControlsToSidebar();

        if (!document.body.classList.contains('dashboard-sidebar-open')) {
          sidebar.classList.remove('is-open');
          sidebar.setAttribute('aria-hidden', 'true');
          backdrop.classList.remove('is-active');
          backdrop.hidden = true;
          toggleButton.setAttribute('aria-expanded', 'false');
          toggleButton.setAttribute('aria-label', 'Open dashboard menu');
        }

        return;
      }

      moveControlsToToolbar();
      closeSidebar(false);
      sidebar.removeAttribute('aria-hidden');
    }

    toggleButton.addEventListener('click', function (event) {
      event.preventDefault();

      if (document.body.classList.contains('dashboard-sidebar-open')) {
        closeSidebar(true);
      } else {
        openSidebar();
      }
    });

    closeButton.addEventListener('click', function (event) {
      event.preventDefault();
      closeSidebar(true);
    });

    backdrop.addEventListener('click', function (event) {
      event.preventDefault();
      closeSidebar(true);
    });

    sidebar.addEventListener('click', function (event) {
      var link = event.target.closest('.dashboard-nav__link');
      var targetUrl;

      if (!link || !sidebar.contains(link)) {
        return;
      }

      if (link.hasAttribute('data-dashboard-target')) {
        if (usesOverlaySidebar()) {
          window.setTimeout(function () {
            closeSidebar(false);
          }, 0);
        }

        return;
      }

      if (!link.hasAttribute('href') || isModifiedClick(event, link)) {
        return;
      }

      targetUrl = new URL(link.getAttribute('href'), window.location.href);

      if (targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search &&
          targetUrl.hash === window.location.hash) {
        event.preventDefault();
        closeSidebar(false);
        return;
      }

      if (usesOverlaySidebar()) {
        event.preventDefault();
        closeSidebar(false);

        window.setTimeout(function () {
          window.location.href = targetUrl.href;
        }, 0);
      }
    });

    window.addEventListener('resize', syncSidebarState);
    document.addEventListener('northline:directionchange', syncSidebarState);
    document.addEventListener('northline:dashboardroutechange', function () {
      if (usesOverlaySidebar()) {
        closeSidebar(false);
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('dashboard-sidebar-open')) {
        closeSidebar(true);
      }
    });

    syncSidebarState();
  }

  /* ============================== Dashboard Booking Page ============================== */
  function initBookingSelection() {
    var slots = document.querySelectorAll('[data-slot]');
    var message = document.querySelector('[data-slot-message]');

    if (!slots.length) {
      return;
    }

    slots.forEach(function (slot) {
      slot.setAttribute('aria-pressed', 'false');

      slot.addEventListener('click', function () {
        slots.forEach(function (item) {
          item.classList.remove('is-selected');
          item.setAttribute('aria-pressed', 'false');
        });

        slot.classList.add('is-selected');
        slot.setAttribute('aria-pressed', 'true');

        if (message) {
          message.textContent = slot.textContent.trim() + ' selected.';
          message.classList.remove('is-error');
          message.classList.add('is-success');
        }
      });
    });
  }

  /* ============================== Dashboard Bootstrap ============================== */
  window.initDashboard = function initDashboard() {
    normalizeDashboardLabels();
    initDashboardRouter();
    markCurrentDashboardLinks();
    initDashboardSidebar();
    initBookingSelection();
  };
})();
