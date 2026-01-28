const STORAGE_KEY_USER_NAME = "cafesilloUserName";
const STORAGE_KEY_FAVORITES_PREFIX = "cafesilloFavorites";
const STORAGE_KEY_CART_PREFIX = "cafesilloCart";

let products = [];
let favorites = [];
let cart = [];
let currentUserName = "";
let currentSort = "none";
let showingOnlyFavorites = false;

function favoritesStorageKey() {
  return `${STORAGE_KEY_FAVORITES_PREFIX}:${currentUserName}`;
}

function cartStorageKey() {
  return `${STORAGE_KEY_CART_PREFIX}:${currentUserName}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const userNameSpan = document.getElementById("user-name");
  const listElement = document.getElementById("coffee-list");
  const sortSelect = document.getElementById("sort");
  const favoritesBtn = document.getElementById("favorites-btn");

  const name = localStorage.getItem(STORAGE_KEY_USER_NAME);
  if (!name) {
    window.location.href = "index.html";
    return;
  }

  currentUserName = name;

  if (userNameSpan) {
    userNameSpan.textContent = name;
  }

  favorites = JSON.parse(localStorage.getItem(favoritesStorageKey()) || "[]");
  cart = JSON.parse(localStorage.getItem(cartStorageKey()) || "[]");
  updateCartCount();

  if (!listElement) {
    return;
  }

  if (sortSelect) {
    sortSelect.value = currentSort;
    sortSelect.addEventListener("change", () => {
      currentSort = sortSelect.value;
      renderProducts(products);
    });
  }

  if (favoritesBtn) {
    favoritesBtn.addEventListener("click", () => {
      showingOnlyFavorites = !showingOnlyFavorites;
      renderProducts(products);
      updateFavoritesButton();
    });
  }

  listElement.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action][data-id]");
    if (!button) {
      return;
    }

    const productId = Number(button.dataset.id);
    if (!Number.isFinite(productId)) {
      return;
    }

    const action = button.dataset.action;
    if (action === "favorite") {
      toggleFavorite(productId);
      return;
    }

    if (action === "cart") {
      addToCart(productId);
    }
  });

  fetch("productos.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudieron cargar los productos");
      }
      return response.json();
    })
    .then((data) => {
      products = data;
      updateFavoritesButton();
      renderProducts(products);
    })
    .catch((error) => {
      console.error(error);
      listElement.innerHTML = `
        <div class="col-span-full text-center py-8">
          <p class="text-cafe-600">Ocurrió un problema al cargar los cafés.</p>
        </div>
      `;
    });
});

function renderProducts(productsToRender) {
  const listElement = document.getElementById("coffee-list");
  listElement.innerHTML = "";

  let filteredProducts = showingOnlyFavorites
    ? productsToRender.filter(p => favorites.includes(p.id))
    : productsToRender;

  const sortedProducts = [...filteredProducts];
  if (currentSort === "price_asc") {
    sortedProducts.sort((a, b) => a.precio - b.precio);
  } else if (currentSort === "price_desc") {
    sortedProducts.sort((a, b) => b.precio - a.precio);
  } else if (currentSort === "pop_asc") {
    sortedProducts.sort((a, b) => a.popularidad - b.popularidad);
  } else if (currentSort === "pop_desc") {
    sortedProducts.sort((a, b) => b.popularidad - a.popularidad);
  }

  sortedProducts.forEach((product) => {
    const isFavorite = favorites.includes(product.id);

    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow";

    card.innerHTML = `
      <img src="${product.imagen}" alt="${product.nombre}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="text-lg font-semibold text-cafe-900 mb-2">${product.nombre}</h3>
        <p class="text-cafe-600 text-sm mb-3">${product.descripcion}</p>
        <div class="flex justify-between items-center mb-4">
          <span class="text-xl font-bold text-cafe-800">$${product.precio.toFixed(2)}</span>
          <span class="text-xs bg-cafe-100 text-cafe-700 px-2 py-1 rounded">${product.categoria}</span>
        </div>
        <div class="flex space-x-2">
          <button
            data-action="favorite"
            data-id="${product.id}"
            class="flex-1 ${isFavorite ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-cafe-200 hover:bg-cafe-300 text-cafe-900'} px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            type="button"
          >
            ${isFavorite ? '❤️ Favorito' : '🤍 Favorito'}
          </button>
          <button
            data-action="cart"
            data-id="${product.id}"
            class="flex-1 bg-cafe-600 hover:bg-cafe-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            type="button"
          >
            🛒 Agregar
          </button>
        </div>
      </div>
    `;

    listElement.appendChild(card);
  });
}

function toggleFavorite(productId) {
  const index = favorites.indexOf(productId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(productId);
  }
  localStorage.setItem(favoritesStorageKey(), JSON.stringify(favorites));
  renderProducts(products);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem(cartStorageKey(), JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

function updateFavoritesButton() {
  const favoritesBtn = document.getElementById("favorites-btn");
  if (!favoritesBtn) return;

  if (showingOnlyFavorites) {
    favoritesBtn.textContent = "❤️ Ver todos";
    favoritesBtn.classList.remove("bg-cafe-600", "hover:bg-cafe-700");
    favoritesBtn.classList.add("bg-red-500", "hover:bg-red-600");
  } else {
    favoritesBtn.textContent = "❤️ Favoritos";
    favoritesBtn.classList.remove("bg-red-500", "hover:bg-red-600");
    favoritesBtn.classList.add("bg-cafe-600", "hover:bg-cafe-700");
  }
}
