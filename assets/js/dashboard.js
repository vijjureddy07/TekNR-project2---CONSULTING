/* ============================== dashboard.js ============================== */

/* ============================== Dashboard-Only Scripts ============================== */
(function () {
  function isAdminDashboard() {
    return window.location.pathname.indexOf('/dashboard/admin/') !== -1;
  }

  /* ============================== Dashboard Navigation ============================== */
  function markCurrentDashboardLinks() {
    var currentPage = getCurrentDashboardPage();

    document.querySelectorAll('.dashboard-nav__link[href]').forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('/').pop();
      var isCurrent = href === currentPage;

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

    sidebar.querySelectorAll('.dashboard-nav__link[href]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var targetUrl = new URL(link.getAttribute('href'), window.location.href);

        if (isModifiedClick(event, link)) {
          return;
        }

        if (targetUrl.pathname === window.location.pathname &&
            targetUrl.search === window.location.search &&
            targetUrl.hash === window.location.hash) {
          event.preventDefault();
          closeSidebar(false);
          return;
        }

        if (usesOverlaySidebar()) {
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
