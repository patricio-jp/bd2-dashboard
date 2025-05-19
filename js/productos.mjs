import { getAllProducts, getProductById } from "./productos-crud.mjs";

const tablaProductos = document.getElementById("bodyProductos");
const nuevoProductoBtn = document.getElementById("nuevoProductoBtn");

const renderProductos = async () => {
    const productos = await getAllProducts();
    if (tablaProductos === null) {
        return;
    }
    tablaProductos.innerHTML = "";
    if (!Array.isArray(productos) || productos.length === 0 || typeof productos[0] !== 'object') {
        return;
    }
    productos.forEach((producto) => {
        // Format precio as currency
        const precioFormateado = producto.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="py-2 px-4">${producto.id}</td>
            <td class="py-2 px-4">${producto.nombre}</td>
            <td class="py-2 px-4">${producto.descripcion}</td>
            <td class="py-2 px-4">${producto.stock}</td>
            <td class="py-2 px-4">${precioFormateado}</td>
            <td class="py-2 px-4">${producto.tipo}</td>
            <td class="py-2 px-4">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded info-btn" data-id="${producto.id}">
                  Info
              </button>
            </td>
        `;

        // Add event listener to the Info button
        const infoBtn = tr.querySelector('.info-btn');
        infoBtn.addEventListener('click', () => infoProducto(producto.id));
        tablaProductos.appendChild(tr);
    });
}

const infoProducto = async (id) => {
    const producto = await getProductById(id);
    if (!producto) {
        return;
    }
    // Create modal container
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

    // Modal content
    // Format precio as currency
    const precioFormateado = producto.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    modal.innerHTML = `
    <div class="flex flex-col justify-center bg-white rounded-lg shadow-lg max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Detalle del Producto</h2>
      <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
      </div>
      <ul class="space-y-2">
      <li><strong>ID:</strong> ${producto.id}</li>
      <li><strong>Nombre:</strong> ${producto.nombre}</li>
      <li><strong>Descripción:</strong> ${producto.descripcion}</li>
      <li><strong>Precio:</strong> ${precioFormateado}</li>
      <li><strong>Stock:</strong> ${producto.stock}</li>
      <li><strong>Tipo:</strong> ${producto.tipo}</li>
      </ul>
    </div>
    `;

    // Append modal to body
    document.body.appendChild(modal);

    // Close button event
    document.getElementById("closeModalBtn").onclick = () => {
        modal.remove();
    };

    // Optional: close modal when clicking outside the content
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

const nuevoProducto = () => {
  // Redirect to the new product page
  window.location.href = "nuevo-producto.html";
}

const cargarTipos = async () => {
  const productos = await getAllProducts();
  const tipos = [...new Set(productos.map(p => p.tipo))];
  // Now you can use the 'tipos' array as needed, e.g., populate a select element
  const selectTipos = document.getElementById("tipoProducto");
  if (selectTipos === null) {
    return;
  }
  selectTipos.innerHTML = ""; // Clear existing options

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccione un tipo";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectTipos.appendChild(defaultOption);
  
  tipos.forEach(tipo => {
    const option = document.createElement("option");
    option.value = tipo;
    option.textContent = tipo;
    selectTipos.appendChild(option);
  });
}

const init = () => {
    renderProductos();
    if (nuevoProductoBtn !== null) {
      nuevoProductoBtn.addEventListener("click", nuevoProducto);
    }
    cargarTipos();
}

document.addEventListener("DOMContentLoaded", init);
