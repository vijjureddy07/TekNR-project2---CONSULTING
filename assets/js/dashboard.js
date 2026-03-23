/* ============================== dashboard.js ============================== */

/* ============================== Dashboard-Only Scripts ============================== */
(function () {
  /* ============================== Dashboard Navigation ============================== */
  function markCurrentDashboardLinks() {
    document.querySelectorAll('.dashboard-nav__link').forEach(function (link) {
      if (link.classList.contains('is-current')) {
        link.setAttribute('aria-current', 'page');
      }
    });
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
    markCurrentDashboardLinks();
    initBookingSelection();
  };
})();
