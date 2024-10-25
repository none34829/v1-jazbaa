// mock data
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
          <button class="view-product" data-product-id="${product.id}">View Product</button>
        </div>
      </div>
    `;
    productListEl.innerHTML += productEl;
  });
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });
  document.querySelectorAll('.view-product').forEach(button => {
    button.addEventListener('click', viewProduct);
  });
}

function addToCart(event) {
  const button = event.target;
  const productId = parseInt(button.getAttribute('data-product-id'));
  const product = products.find(p => p.id === productId);
  
  if (product) {
    button.classList.add('tapped');
    setTimeout(() => {
      button.classList.remove('tapped');
    }, 100);

    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    const card = button.closest('.product-card');
    const img = card.querySelector('img');

    const flyingImg = img.cloneNode();
    flyingImg.classList.add('flying-image');
    flyingImg.style.width = '50px';
    flyingImg.style.height = '50px';
    flyingImg.style.position = 'fixed';
    

    const rect = img.getBoundingClientRect();
    flyingImg.style.left = rect.left + 'px';
    flyingImg.style.top = rect.top + 'px';
    
    document.body.appendChild(flyingImg);
    

    const cartBtn = document.querySelector('.cart-btn');
    const cartRect = cartBtn.getBoundingClientRect();
    
    // straight outta airport
    flyingImg.style.transition = 'all 1s ease-in-out';
    flyingImg.style.left = `${cartRect.left + cartRect.width / 2 - 25}px`;
    flyingImg.style.top = `${cartRect.top + cartRect.height / 2 - 25}px`;
    flyingImg.style.opacity = '0';
    flyingImg.style.transform = 'scale(0.1)';
    
    //burst anim
    setTimeout(() => {
      cartBtn.classList.add('burst');
      setTimeout(() => cartBtn.classList.remove('burst'), 500);
    }, 800);
    

    setTimeout(() => {
      flyingImg.remove();
      updateCartCount();
      updateCartModal();
    }, 1000);
  }
}

function viewProduct(event) {
  const button = event.target;
  const productId = parseInt(button.getAttribute('data-product-id'));
  const product = products.find(p => p.id === productId);
  
  if (product) {
    // Populate modal with product details
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = `Price: ₹${product.price.toFixed(2)}`;
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-description').textContent = `Description: This is a detailed description of the ${product.name}.`;

    // Show the modal
    const modal = document.getElementById('product-modal');
    modal.style.display = 'block';

    // Close modal functionality
    document.getElementById('close-modal').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function updateCartModal() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  cartItemsEl.innerHTML = '';
  let total = 0;
  
  if (Object.keys(cartItems).length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.5';
    checkoutBtn.style.cursor = 'not-allowed';
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.cursor = 'pointer';
    
    Object.values(cartItems).forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" width="50">
        <span>${item.name}</span>
        <span>₹${item.price.toFixed(2)}</span>
        <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      `;
      cartItemsEl.appendChild(itemEl);
      
      total += item.price * item.quantity;
    });
  }
  
  cartTotalEl.textContent = `Total: ₹${total.toFixed(2)}`;
}

function handleCartAction(event) {
  const button = event.target;
  if (button.classList.contains('quantity-btn') || button.classList.contains('remove-btn')) {
    const itemId = parseInt(button.getAttribute('data-id'));
    const action = button.getAttribute('data-action');
    
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      if (action === 'increase') {
        cartItems[itemIndex].quantity += 1;
      } else if (action === 'decrease') {
        cartItems[itemIndex].quantity -= 1;
        if (cartItems[itemIndex].quantity === 0) {
          cartItems.splice(itemIndex, 1);
        }
      } else if (button.classList.contains('remove-btn')) {
        cartItems.splice(itemIndex, 1);
      }
      
      updateCartCount();
      updateCartModal();
    }
  }
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
  
  const cartBtn = document.querySelector('.cart-btn');
  const modal = document.getElementById('cart-modal');
  const closeBtn = modal.querySelector('.close');
  
  cartBtn.addEventListener('click', () => {
    updateCartModal();
    modal.style.display = 'block';
    toggleBodyScroll(true); 
  });
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    toggleBodyScroll(false); 
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      toggleBodyScroll(false); 
    }
  });
  
  const cartItemsEl = document.getElementById('cart-items');
  cartItemsEl.addEventListener('click', handleCartAction);
  
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.addEventListener('click', () => {
    if (!checkoutBtn.disabled) {
    window.location.href = 'https://www.youtube.com/watch?v=xvFZjo5PgG0';
    }
// checkoutBtn.addEventListener('click', () => {
//   alert('WIP.');
  });
});

function toggleBodyScroll(disable) {
  document.body.style.overflow = disable ? 'hidden' : '';
}

// Create a modal element in your HTML
const modalHTML = `
  <div id="product-modal" class="modal" style="display:none;">
    <div class="modal-content"></div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);
