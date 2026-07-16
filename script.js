/**
 * G Mart Storefront Core Interactions
 * Handles: Infinite Marquee, Cart State, Sticky Header, and Search
 */
document.addEventListener('DOMContentLoaded', function () {
  
  // ==========================================
  // 1. INFINITE MARQUEE TICKER TUNEUP
  // ==========================================
  (function initMarquee() {
    const track = document.getElementById('afMarqueeTrack');
    const marquee = document.getElementById('afMarquee');
    if (!track || !marquee) return;

    function tuneSpeed() {
      const pxPerSecond = 70; // Consistent velocity (pixels per second)
      const duration = (track.scrollWidth / 2) / pxPerSecond;
      track.style.animationDuration = duration + 's';
    }

    tuneSpeed();
    window.addEventListener('resize', tuneSpeed);

    let isPaused = false;
    marquee.addEventListener('click', function () {
      isPaused = !isPaused;
      track.style.animationPlayState = isPaused ? 'paused' : 'running';
    });
  })();

  // ==========================================
  // 2. LIVE STOREFRONT CART LOGIC
  // ==========================================
  (function initCartManager() {
    // Current total unique item count from your badge fallback (3)
    let totalCartCount = 3;
    const cartBadge = document.querySelector('.af-cart__count');
    const addButtons = document.querySelectorAll('.af-addbtn');

    addButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        
        // If the item hasn't been transformed into a quantity selector yet
        if (!this.classList.contains('is-selected')) {
          this.classList.add('is-selected');
          
          // Inject a native step counter [- 1 +] inside the button wrapper
          this.innerHTML = `
            <span class="af-qty-btn count-down" data-action="decrease">−</span>
            <span class="af-qty-val">1</span>
            <span class="af-qty-btn count-up" data-action="increase">+</span>
          `;
          
          totalCartCount++;
          updateCartBadge();
        }
      });
    });

    // Event delegation handling clicks inside the active quantity selectors
    document.addEventListener('click', function (e) {
      const qtyBtn = e.target.closest('.af-qty-btn');
      if (!qtyBtn) return;

      e.stopPropagation();
      e.preventDefault();

      const action = qtyBtn.getAttribute('data-action');
      const cardRow = qtyBtn.closest('.af-card__row');
      const nativeBtn = cardRow.querySelector('.af-addbtn');
      const qtyValNode = cardRow.querySelector('.af-qty-val');
      
      let currentQty = parseInt(qtyValNode.textContent, 10);

      if (action === 'increase') {
        currentQty++;
        qtyValNode.textContent = currentQty;
      } else if (action === 'decrease') {
        currentQty--;
        if (currentQty < 1) {
          // Revert component back to its default clean "Add" state
          nativeBtn.classList.remove('is-selected');
          nativeBtn.innerHTML = 'Add';
          totalCartCount = Math.max(0, totalCartCount - 1);
        } else {
          qtyValNode.textContent = currentQty;
        }
      }
      
      updateCartBadge();
    });

    function updateCartBadge() {
      if (cartBadge) {
        cartBadge.textContent = totalCartCount;
        // Visual pop effect for cart feedback
        cartBadge.style.transform = 'scale(1.2)';
        setTimeout(() => cartBadge.style.transform = 'scale(1)', 150);
      }
    }
  })();

  // ==========================================
  // 3. STICKY NAVIGATION STAGE
  // ==========================================
  (function initStickyHeader() {
    const header = document.querySelector('.af-header');
    if (!header) return;

    const stickyThreshold = header.offsetTop + header.offsetHeight;

    window.addEventListener('scroll', function () {
      if (window.scrollY > stickyThreshold) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
    }, { passive: true });
  })();

  // ==========================================
  // 4. SEARCH SUBMISSION CAPTURE
  // ==========================================
  (function initSearch() {
    const searchForm = document.querySelector('.af-search');
    if (!searchForm) return;

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input');
      if (input && input.value.trim() !== "") {
        console.log(`Searching G Mart catalogs for: "${input.value.trim()}"`);
        // Handle your application search routing or analytics integration here
      }
    });
  })();

});