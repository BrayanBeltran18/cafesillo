# Cafesillo

link:
https://cafesillo.netlify.app/index.html

Aplicación web minimalista para explorar un catálogo de cafés, marcar favoritos y agregar productos al carrito.

## Características

-**Login simulado**: Ingresa tu nombre para acceder (sin validación real)
-**Catálogo de cafés**: Lista de productos con imágenes, descripción, precio y categoría
-**Favoritos**: Marca cafés como favoritos y filtra para ver solo tus favoritos
-**Carrito**: Agrega productos al carrito con contador de items
-**Ordenamiento**: Ordena por precio (mayor/menor) o popularidad (mayor/menor)
-**Diseño minimalista**: Interfaz con Tailwind CSS y paleta de colores café
-**Persistencia**: Favoritos y carrito se guardan por usuario en localStorage

## Tecnologías

- HTML5 semántico
- JavaScript vanilla
- Tailwind CSS (CDN)
- LocalStorage para persistencia

## Datos de ejemplo

El archivo `productos.json` contiene 13 cafés con:
- `id`: Identificador único
- `nombre`: Nombre del café
- `descripcion`: Descripción detallada
- `precio`: Precio en formato numérico
- `popularidad`: Puntuación del 0-100
- `categoria`: "Caliente" o "Frío"
- `imagen`: Ruta a la imagen del producto

## Personalización

### Colores
La paleta de colores café está definida en `tailwind.config` dentro de cada HTML:
- `cafe-50` a `cafe-900` para diferentes tonos

### Productos
Modifica `productos.json` para agregar/editar/eliminar cafés

### Estilos
Los estilos usan clases de Tailwind CSS. Puedes personalizar:
- Colores en el `tailwind.config`
- Layout y espaciado modificando las clases en los HTML

## Notas técnicas

- **Servidor requerido**: La aplicación debe servirse via HTTP para cargar `productos.json` y las imágenes correctamente
- **LocalStorage**: Los datos se guardan localmente en el navegador. Limpiar el caché del navegador eliminará favoritos y carrito
