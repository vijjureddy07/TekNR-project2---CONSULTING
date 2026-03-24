/* ============================== dashboard.js ============================== */

/* ============================== Dashboard-Only Scripts ============================== */
(function () {
  function isAdminDashboard() {
    return window.location.pathname.indexOf('/dashboard/admin/') !== -1;
  }

  /* ============================== Dashboard Navigation ============================== */
  function markCurrentDashboardLinks() {
    document.querySelectorAll('.dashboard-nav__link').forEach(function (link) {
      if (link.classList.contains('is-current')) {
        link.setAttribute('aria-current', 'page');
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

  /* ============================== Dashboard Sidebar ============================== */
  function initDashboardSidebar() {
    var sidebar = document.querySelector('.dashboard-sidebar');
    var utilityActions = document.querySelector('.utility-bar__actions');

    if (!sidebar || !utilityActions) {
      return;
    }

    sidebar.removeAttribute('data-reveal');
    sidebar.classList.add('is-visible');

    if (!sidebar.id) {
      sidebar.id = 'dashboard-sidebar-panel';
    }

    var exitLink = utilityActions.querySelector('a.button--ghost[href]');

    if (exitLink) {
      exitLink.classList.add('dashboard-sidebar__exit');
      exitLink.textContent = 'Exit dashboard';
      sidebar.appendChild(exitLink);
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

    var backdrop = document.querySelector('[data-dashboard-sidebar-backdrop]');

    if (!backdrop) {
      backdrop = document.createElement('button');
      backdrop.type = 'button';
      backdrop.className = 'dashboard-sidebar-backdrop';
      backdrop.hidden = true;
      backdrop.setAttribute('data-dashboard-sidebar-backdrop', '');
      backdrop.setAttribute('aria-label', 'Close dashboard menu');
      document.body.appendChild(backdrop);
    }

    function usesOverlaySidebar() {
      return window.innerWidth <= 1024;
    }

    function closeSidebar(returnFocus) {
      document.body.classList.remove('dashboard-sidebar-open');
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-active');
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.setAttribute('aria-label', 'Open dashboard menu');
      backdrop.hidden = true;

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
      backdrop.classList.add('is-active');
      toggleButton.setAttribute('aria-expanded', 'true');
      toggleButton.setAttribute('aria-label', 'Close dashboard menu');
      sidebar.setAttribute('aria-hidden', 'false');
      backdrop.hidden = false;
      closeButton.focus();
    }

    function syncSidebarState() {
      if (!usesOverlaySidebar()) {
        closeSidebar(false);
        sidebar.removeAttribute('aria-hidden');
        return;
      }

      if (!document.body.classList.contains('dashboard-sidebar-open')) {
        sidebar.classList.remove('is-open');
        backdrop.classList.remove('is-active');
        sidebar.setAttribute('aria-hidden', 'true');
        backdrop.hidden = true;
      }
    }

    toggleButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (document.body.classList.contains('dashboard-sidebar-open')) {
        closeSidebar(true);
      } else {
        openSidebar();
      }
    });

    closeButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeSidebar(true);
    });

    backdrop.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeSidebar(true);
    });

    sidebar.querySelectorAll('.dashboard-nav__link, .dashboard-sidebar__exit').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href') || '';

        if (!usesOverlaySidebar()) {
          return;
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.getAttribute('target') === '_blank') {
          return;
        }
        event.stopPropagation();

        if (!href || href.charAt(0) === '#') {
          event.preventDefault();
          closeSidebar(false);
          return;
        }

        if (link.pathname === window.location.pathname && link.search === window.location.search && link.hash === window.location.hash) {
          event.preventDefault();
          closeSidebar(false);
        }
      });
    });

    window.addEventListener('resize', syncSidebarState);
    document.addEventListener('northline:directionchange', syncSidebarState);

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
    markCurrentDashboardLinks();
    initDashboardSidebar();
    initBookingSelection();
  };
})();
