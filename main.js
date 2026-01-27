const STORAGE_KEY_USER_NAME = "cafesilloUserName";

document.addEventListener("DOMContentLoaded", () => {
  const userNameSpan = document.getElementById("user-name");
  const listElement = document.getElementById("coffee-list");

  const name = localStorage.getItem(STORAGE_KEY_USER_NAME);
  if (!name) {
    window.location.href = "index.html";
    return;
  }

  if (userNameSpan) {
    userNameSpan.textContent = name;
  }

  if (!listElement) {
    return;
  }

  fetch("productos.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudieron cargar los productos");
      }
      return response.json();
    })
    .then((products) => {
      listElement.innerHTML = "";

      products.forEach((product) => {
        const item = document.createElement("li");

        const image = document.createElement("img");
        image.src = product.imagen;
        image.alt = product.nombre;

        const title = document.createElement("h3");
        title.textContent = product.nombre;

        const description = document.createElement("p");
        description.textContent = product.descripcion;

        const price = document.createElement("p");
        price.textContent = `Precio: $${product.precio.toFixed(2)}`;

        item.appendChild(image);
        item.appendChild(title);
        item.appendChild(description);
        item.appendChild(price);

        listElement.appendChild(item);
      });
    })
    .catch((error) => {
      listElement.innerHTML = "";
      const message = document.createElement("p");
      message.textContent = "Ocurrió un problema al cargar los cafés.";
      listElement.appendChild(message);
      console.error(error);
    });
});
