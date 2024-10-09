// Mock product data
const products = [
  { id: 1, name: 'College Hoodie', price: 240, image: 'ashoka maroon.png' },
  { id: 2, name: 'Shot Glass', price: 420, image: 'download (7).jpg' },
  { id: 3, name: 'Laptop Backpack', price: 49.99, image: 'ashoka maroon.png' },
  { id: 4, name: 'Scientific Calculator', price: 19.99, image: 'ashoka maroon.png' },
  { id: 5, name: 'Campus Map Poster', price: 9.99, image: 'ashoka maroon.png' },
  { id: 6, name: 'Reusable Water Bottle', price: 14.99, image: 'ashoka maroon.png' }
];

let cartItems = [];

function displayProducts(productsList) {
  const productListEl = document.getElementById('products-list');
  productListEl.innerHTML = '';
  productsList.forEach(product => {
    const productEl = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>₹${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productListEl.innerHTML += productEl;
  });
  // Add event listeners to the newly created buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });
}

function addToCart(event) {
  const button = event.target;
  const productId = parseInt(button.getAttribute('data-product-id'));
  const product = products.find(p => p.id === productId);
  
  if (product) {
    const card = button.closest('.product-card');
    const img = card.querySelector('img');
    
    // Create flying image
    const flyingImg = img.cloneNode();
    flyingImg.classList.add('flying-image');
    flyingImg.style.width = '50px';
    flyingImg.style.height = '50px';
    flyingImg.style.position = 'fixed';
    
    // Set initial position
    const rect = img.getBoundingClientRect();
    flyingImg.style.left = rect.left + 'px';
    flyingImg.style.top = rect.top + 'px';
    
    document.body.appendChild(flyingImg);
    
    // Get cart button position
    const cartBtn = document.querySelector('.cart-btn');
    const cartRect = cartBtn.getBoundingClientRect();
    
    // Animate to cart
    flyingImg.style.transition = 'all 1s ease-in-out';
    flyingImg.style.left = `${cartRect.left + cartRect.width / 2 - 25}px`;
    flyingImg.style.top = `${cartRect.top + cartRect.height / 2 - 25}px`;
    flyingImg.style.opacity = '0';
    flyingImg.style.transform = 'scale(0.1)';
    
    // Trigger cart burst animation
    setTimeout(() => {
      cartBtn.classList.add('burst');
      setTimeout(() => cartBtn.classList.remove('burst'), 500);
    }, 800);
    
    // Remove flying image and update cart after animation
    setTimeout(() => {
      flyingImg.remove();
      updateCart(product);
    }, 1000);
  }
}

function updateCart(product) {
  cartItems.push(product);
  const cartCount = document.getElementById('cart-count');
  cartCount.textContent = cartItems.length;
  
  // Hide cart items after adding to cart
  const cartPreview = document.getElementById('cart-preview');
  cartPreview.innerHTML = '';
}

function searchProducts() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query)
  );
  displayProducts(filteredProducts);
}

function filterProducts() {
  const filter = document.getElementById('price-filter').value;
  let filteredProducts = products;
  if (filter === 'under50') {
    filteredProducts = products.filter(product => product.price < 50);
  } else if (filter === 'above50') {
    filteredProducts = products.filter(product => product.price >= 50);
  }
  displayProducts(filteredProducts);
}

document.addEventListener('DOMContentLoaded', () => {
  displayProducts(products);
  
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', searchProducts);
  
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    priceFilter.addEventListener('change', filterProducts);
  }
  
  // Create cart preview container
  const cartBtn = document.querySelector('.cart-btn');
  const cartPreview = document.createElement('div');
  cartPreview.id = 'cart-preview';
  cartBtn.appendChild(cartPreview);
});