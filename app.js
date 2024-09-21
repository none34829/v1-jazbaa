// Mock product data
const products = [
    { id: 1, name: 'College Hoodie', price: 240, image: 'ashoka maroon.png' },
    { id: 2, name: 'Shot Glass', price: 420, image: 'download (7).jpg' },
    { id: 3, name: 'Laptop Backpack', price: 49.99, image: 'backpack.jpg' },
    { id: 4, name: 'Scientific Calculator', price: 19.99, image: 'calculator.jpg' },
    { id: 5, name: 'Campus Map Poster', price: 9.99, image: 'poster.jpg' },
    { id: 6, name: 'Reusable Water Bottle', price: 14.99, image: 'bottle.jpg' },
  ];
  
  let cartCount = 0;
  
  function displayProducts(productsList) {
    const productListEl = document.getElementById('products-list');
    productListEl.innerHTML = '';
  
    productsList.forEach(product => {
      const productEl = `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>₹${product.price.toFixed(2)}</p>
          <button onclick="addToCart()">Add to Cart</button>
        </div>
      `;
      productListEl.innerHTML += productEl;
    });
  }
  
  function addToCart() {
    cartCount++;
    document.getElementById('cart-count').textContent = cartCount;
  }
  
  function searchProducts() {
    const query = document.getElementById('search').value.toLowerCase();
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
  
  // Display all products on initial load
  document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
  });
  