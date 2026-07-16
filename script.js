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
          // Get product details from card
const card = this.closest('.af-card');
const name = card.querySelector('h4').innerText;
const price = parseInt(
  card.querySelector('.af-card__price b').innerText.replace('₹', '')
);

// Save item in cart array
cart.push({
  name,
  price,
  qty: 1
});

localStorage.setItem('gmart-cart', JSON.stringify(cart));

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

// Global cart storage
let cart = JSON.parse(localStorage.getItem("gmart-cart")) || [];
const cartBtn = document.getElementById("cartBtn");

const cartSidebar = document.getElementById("cartSidebar");

const closeCart = document.getElementById("closeCart");

cartBtn.addEventListener("click", () => {

    cartSidebar.classList.add("active");

    showCart();

});

closeCart.addEventListener("click", () => {

    cartSidebar.classList.remove("active");

});

function showCart() {

    const cartItems = document.getElementById("cartItems");
    const total = document.getElementById("cartTotal");

    if (!cartItems || !total) return;

    cartItems.innerHTML = "";

    let amount = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        total.innerHTML = "0";
        return;
    }

    cart.forEach((item, index) => {
        amount += item.price * item.qty;

        cartItems.innerHTML += `
        <div class="cart-item">
            <div>
                <b>${item.name}</b><br>
                ₹${item.price} × ${item.qty}
            </div>
            <button onclick="removeCartItem(${index})">Remove</button>
        </div>`;
    });

    total.innerHTML = amount;
}

const accountBtn=document.getElementById("accountBtn");
const loginModal=document.getElementById("loginModal");
const closeLogin=document.getElementById("closeLogin");

const sendOtpBtn=document.getElementById("sendOtpBtn");
const otpArea=document.getElementById("otpArea");

let generatedOtp="";

accountBtn.onclick=()=>{

    loginModal.classList.add("show");

}

closeLogin.onclick=()=>{

    loginModal.classList.remove("show");

}

sendOtpBtn.onclick=()=>{

    const phone=document.getElementById("phone").value;

    if(phone.length!=10){

        alert("Enter valid mobile number");

        return;

    }

    generatedOtp=Math.floor(100000+Math.random()*900000).toString();

    alert("Demo OTP : "+generatedOtp);

    otpArea.style.display="block";

}

document.getElementById("verifyOtp").onclick=()=>{

    const otp=document.getElementById("otp").value;

    if(otp===generatedOtp){

        alert("Login Successful");

        loginModal.classList.remove("show");

    }else{

        alert("Invalid OTP");

    }

}

const categories=document.querySelectorAll(".category");
const lists=document.querySelectorAll(".sub-list");

categories.forEach(cat=>{

    cat.addEventListener("mouseenter",()=>{

        categories.forEach(c=>c.classList.remove("active"));

        lists.forEach(l=>l.classList.remove("active"));

        cat.classList.add("active");

        document
            .getElementById(cat.dataset.target)
            .classList.add("active");

    });

});

const slides = document.querySelectorAll(".slide");

const next = document.querySelector(".next");

const prev = document.querySelector(".prev");

let index = 0;

function showSlide(i){

    slides.forEach(slide=>slide.classList.remove("active"));

    slides[i].classList.add("active");

}

next.onclick = ()=>{

    index++;

    if(index>=slides.length){

        index=0;

    }

    showSlide(index);

}

prev.onclick = ()=>{

    index--;

    if(index<0){

        index=slides.length-1;

    }

    showSlide(index);

}

// Auto Slide Every 5 Seconds

setInterval(()=>{

    index++;

    if(index>=slides.length){

        index=0;

    }

    showSlide(index);

},5000);

function removeCartItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('gmart-cart', JSON.stringify(cart));
    showCart();
}

const track = document.querySelector(".deals-track");
const cards = document.querySelectorAll(".deal-card");

const nextBtn = document.querySelector(".deal-next");
const prevBtn = document.querySelector(".deal-prev");

let current = 0;
const visible = 4;

function moveSlider(){

    track.style.transform =
        `translateX(-${current*(100/visible)}%)`;

}

nextBtn.onclick = function(){

    if(current < cards.length-visible){

        current++;

    }else{

        current=0;

    }

    moveSlider();

}

prevBtn.onclick = function(){

    if(current>0){

        current--;

    }else{

        current=cards.length-visible;

    }

    moveSlider();

}

// Auto Slide Every 5 Seconds
setInterval(function(){

    if(current < cards.length-visible){

        current++;

    }else{

        current=0;

    }

    moveSlider();

},5000);