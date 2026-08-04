/**
 * G Mart Storefront Core Interactions
 * Handles: Marquee, Cart (with localStorage), Sticky Header, Search,
 * Mega Menu, Banner Slider, Deals Carousel, and OTP Login Modal.
 */

// ==========================================
// CART STATE (single source of truth)
// ==========================================
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem('gmart-cart')) || [];
} catch (err) {
  cart = [];
}

function saveCart() {
  localStorage.setItem('gmart-cart', JSON.stringify(cart));
}

function cartItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function findCartItem(name) {
  return cart.find(item => item.name === name);
}

function addToCart(name, price) {
  const existing = findCartItem(name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  updateCartBadge();
}

function setCartQty(name, qty) {
  const existing = findCartItem(name);
  if (!existing) return;
  if (qty <= 0) {
    cart = cart.filter(item => item.name !== name);
  } else {
    existing.qty = qty;
  }
  saveCart();
  updateCartBadge();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  showCart();
}

function updateCartBadge() {
  const cartBadge = document.querySelector('.af-cart__count');
  if (!cartBadge) return;
  cartBadge.textContent = cartItemCount();
  cartBadge.style.transform = 'scale(1.2)';
  setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 150);
}

function showCart() {
  const cartItems = document.getElementById('cartItems');
  const total = document.getElementById('cartTotal');
  if (!cartItems || !total) return;

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    total.innerHTML = '0';
    return;
  }

  let amount = 0;
  cart.forEach((item, index) => {
    amount += item.price * item.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <b>${item.name}</b><br>
          &#8377;${item.price} &times; ${item.qty}
        </div>
        <button onclick="removeCartItem(${index})">Remove</button>
      </div>`;
  });

  total.innerHTML = amount;
}

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================
  // 1. INFINITE MARQUEE TICKER
  // ==========================================
  (function initMarquee() {
    const track = document.getElementById('afMarqueeTrack');
    const marquee = document.getElementById('afMarquee');
    if (!track || !marquee) return;

    function tuneSpeed() {
      const pxPerSecond = 70;
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
  // 2. PRODUCT CARD ADD-TO-CART CONTROLS
  // ==========================================
  (function initCartManager() {
    const addButtons = document.querySelectorAll('.af-addbtn');

    addButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.classList.contains('is-selected')) return;

        const card = this.closest('.af-card');
        const name = card.querySelector('h4').innerText;
        const price = parseInt(
          card.querySelector('.af-card__price b').innerText.replace('₹', ''),
          10
        );

        this.classList.add('is-selected');
        this.innerHTML = `
          <span class="af-qty-btn count-down" data-action="decrease">&minus;</span>
          <span class="af-qty-val">1</span>
          <span class="af-qty-btn count-up" data-action="increase">+</span>
        `;

        addToCart(name, price);
      });
    });

    document.addEventListener('click', function (e) {
      const qtyBtn = e.target.closest('.af-qty-btn');
      if (!qtyBtn) return;

      e.stopPropagation();
      e.preventDefault();

      const action = qtyBtn.getAttribute('data-action');
      const cardRow = qtyBtn.closest('.af-card__row');
      const card = qtyBtn.closest('.af-card');
      const nativeBtn = cardRow.querySelector('.af-addbtn');
      const qtyValNode = cardRow.querySelector('.af-qty-val');
      const name = card.querySelector('h4').innerText;

      let currentQty = parseInt(qtyValNode.textContent, 10);

      if (action === 'increase') {
        currentQty++;
        qtyValNode.textContent = currentQty;
        setCartQty(name, currentQty);
      } else if (action === 'decrease') {
        currentQty--;
        if (currentQty < 1) {
          nativeBtn.classList.remove('is-selected');
          nativeBtn.innerHTML = 'Add';
          setCartQty(name, 0);
        } else {
          qtyValNode.textContent = currentQty;
          setCartQty(name, currentQty);
        }
      }
    });

    // Sync badge with whatever was already in localStorage on page load
    updateCartBadge();
  })();

  // ==========================================
  // 3. STICKY NAVIGATION
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
  // 4. SEARCH SUBMISSION
  // ==========================================
  (function initSearch() {
    const searchForm = document.querySelector('.af-search');
    if (!searchForm) return;

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input');
      if (input && input.value.trim() !== '') {
        console.log(`Searching G Mart catalogs for: "${input.value.trim()}"`);
      }
    });
  })();

  // ==========================================
  // 5. CART SIDEBAR
  // ==========================================
  (function initCartSidebar() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    if (!cartBtn || !cartSidebar || !closeCart) return;

    cartBtn.addEventListener('click', () => {
      cartSidebar.classList.add('active');
      showCart();
    });

    closeCart.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
    });
  })();

  // ==========================================
  // 6. LOGIN / OTP MODAL
  // ==========================================
  (function initLogin() {
    const accountBtn = document.getElementById('accountBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const otpArea = document.getElementById('otpArea');
    if (!accountBtn || !loginModal) return;

    let generatedOtp = '';

    accountBtn.onclick = () => loginModal.classList.add('show');
    if (closeLogin) closeLogin.onclick = () => loginModal.classList.remove('show');

    if (sendOtpBtn) {
      sendOtpBtn.onclick = () => {
        const phone = document.getElementById('phone').value.trim();

        if (!/^[6-9]\d{9}$/.test(phone)) {
          alert('Enter a valid 10-digit mobile number');
          return;
        }

        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        alert('Demo OTP : ' + generatedOtp);
        otpArea.style.display = 'block';
      };
    }

    const verifyOtpBtn = document.getElementById('verifyOtp');
    if (verifyOtpBtn) {
      verifyOtpBtn.onclick = () => {
        const otp = document.getElementById('otp').value;
        if (otp === generatedOtp && generatedOtp !== '') {
          alert('Login Successful');
          loginModal.classList.remove('show');
        } else {
          alert('Invalid OTP');
        }
      };
    }
  })();

  // ==========================================
  // 7. MEGA MENU CATEGORY SWITCHER
  // ==========================================
  (function initMegaMenu() {
    const categories = document.querySelectorAll('.category');
    const lists = document.querySelectorAll('.sub-list');
    if (!categories.length) return;

    categories.forEach(cat => {
      cat.addEventListener('mouseenter', () => {
        categories.forEach(c => c.classList.remove('active'));
        lists.forEach(l => l.classList.remove('active'));

        cat.classList.add('active');
        const target = document.getElementById(cat.dataset.target);
        if (target) target.classList.add('active');
      });
    });
  })();

  // ==========================================
  // 8. HERO BANNER SLIDER
  // ==========================================
  (function initBannerSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider__dots span');
    const next = document.querySelector('.next');
    const prev = document.querySelector('.prev');
    const slidesTrack = document.querySelector('.slides');
    if (!slides.length || !slidesTrack) return;

    let index = 0;

    function showSlide(i) {
      index = (i + slides.length) % slides.length;
      slidesTrack.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
    }

    if (next) next.onclick = () => showSlide(index + 1);
    if (prev) prev.onclick = () => showSlide(index - 1);
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

    setInterval(() => showSlide(index + 1), 6000);
  })();

  // ==========================================
  // 9. DEALS CAROUSEL
  // ==========================================
  (function initDealsCarousel() {
    const track = document.querySelector('.deals-track');
    const cards = document.querySelectorAll('.deal-card');
    const nextBtn = document.querySelector('.deal-next');
    const prevBtn = document.querySelector('.deal-prev');
    if (!track || !cards.length) return;

    function getVisible() {
      if (window.innerWidth <= 600) return 2;
      if (window.innerWidth <= 980) return 3;
      return 4;
    }

    let current = 0;

    function moveSlider() {
      const visible = getVisible();
      const maxIndex = Math.max(0, cards.length - visible);
      if (current > maxIndex) current = maxIndex;
      track.style.transform = `translateX(-${current * (100 / cards.length)}%)`;
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        const visible = getVisible();
        const maxIndex = Math.max(0, cards.length - visible);
        current = current < maxIndex ? current + 1 : 0;
        moveSlider();
      };
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        const visible = getVisible();
        const maxIndex = Math.max(0, cards.length - visible);
        current = current > 0 ? current - 1 : maxIndex;
        moveSlider();
      };
    }

    window.addEventListener('resize', moveSlider);

    setInterval(() => {
      const visible = getVisible();
      const maxIndex = Math.max(0, cards.length - visible);
      current = current < maxIndex ? current + 1 : 0;
      moveSlider();
    }, 5000);
  })();

});