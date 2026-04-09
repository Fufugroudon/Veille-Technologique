(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // --- Block modal: full ITEC content panel, triggered by the hero entry row ---
    var entryTrigger      = document.getElementById('itec-entry-trigger');
    var blockModalOverlay = document.getElementById('itec-block-modal-overlay');
    var blockModalClose   = document.getElementById('itec-block-modal-close');

    if (entryTrigger && blockModalOverlay && blockModalClose) {

      // Slide the block modal in from the left; lock body scroll
      function openBlockModal() {
        blockModalOverlay.classList.remove('is-closing');
        blockModalOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        // Reset hero zoom animation so it replays on every modal open
        var hero = blockModalOverlay.querySelector('.itec-hero');
        if (hero) {
          hero.style.animation = 'none';
          void hero.offsetHeight;
          hero.style.animation = '';
        }
      }

      // Slide the block modal out to the right, then hide after the transition ends; restore body scroll
      function closeBlockModal() {
        blockModalOverlay.classList.add('is-closing');
        setTimeout(function () {
          blockModalOverlay.classList.remove('is-open');
          blockModalOverlay.classList.remove('is-closing');
          document.body.style.overflow = '';
        }, 350);
      }

      entryTrigger.addEventListener('click', openBlockModal);
      blockModalClose.addEventListener('click', closeBlockModal);

      // Clicking the dimmed backdrop closes the block modal; clicks inside the panel do not
      blockModalOverlay.addEventListener('click', function (e) {
        if (e.target === blockModalOverlay) { closeBlockModal(); }
      });
    }

    // --- Modal: centered overlay panel triggered by the "En savoir plus" button ---
    var modalBtn     = document.getElementById('itec-modal-btn');
    var modalOverlay = document.getElementById('itec-modal-overlay');
    var modalClose   = document.getElementById('itec-modal-close');

    // Guard: modal elements may be absent when block is not inlined
    if (!modalBtn || !modalOverlay || !modalClose) { return; }

    // Zoom the modal in, show the overlay, lock body scroll
    function openModal() {
      modalOverlay.classList.remove('is-closing');
      modalOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    // Apply closing state first so the zoom-out animation plays, then hide after it completes
    function closeModal() {
      modalOverlay.classList.remove('is-open');
      modalOverlay.classList.add('is-closing');
      setTimeout(function () {
        modalOverlay.classList.remove('is-closing');
        document.body.style.overflow = '';
      }, 260);
    }

    modalBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);

    // Clicking the dimmed backdrop closes the modal; clicks inside the panel do not
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) { closeModal(); }
    });
  });
}());
