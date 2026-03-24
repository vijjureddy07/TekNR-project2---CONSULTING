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
      eyebrow.textContent = 'Client area';
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
        sidebar.setAttribute('aria-hidden', 'true');
        backdrop.hidden = true;
      }
    }

    toggleButton.addEventListener('click', function () {
      if (document.body.classList.contains('dashboard-sidebar-open')) {
        closeSidebar(true);
      } else {
        openSidebar();
      }
    });

    closeButton.addEventListener('click', function () {
      closeSidebar(true);
    });

    backdrop.addEventListener('click', function () {
      closeSidebar(true);
    });

    sidebar.querySelectorAll('.dashboard-nav__link, .dashboard-sidebar__exit').forEach(function (link) {
      link.addEventListener('click', function () {
        if (usesOverlaySidebar()) {
          closeSidebar(false);
        }
      });
    });

    window.addEventListener('resize', syncSidebarState);

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
