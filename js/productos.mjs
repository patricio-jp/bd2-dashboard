// js/productos.mjs
import { getAllProducts, getProductById, createProduct } from './productos-crud.mjs';

const tablaProductos = document.getElementById('bodyProductos');
const nuevoProductoBtn = document.getElementById('nuevoProductoBtn');
const nuevoProductoForm = document.getElementById('nuevoProductoForm');

const renderProductos = async () => {
  const productos = await getAllProducts();
  if (tablaProductos === null) return;

  tablaProductos.innerHTML = '';

  if (!Array.isArray(productos) || productos.length === 0 || typeof productos[0] !== 'object') {
    return;
  }

  productos.forEach((producto) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="py-2 px-4">${producto.id}</td>
      <td class="py-2 px-4">${producto.tipo}</td>
      <td class="py-2 px-4">${producto.nombre}</td>
      <td class="py-2 px-4">${producto.descripcion}</td>
      <td class="py-2 px-4">$${producto.precio.toFixed(2)}</td>
      <td class="py-2 px-4">${producto.stock}</td>
    `;

    // Opción: agregar botón "Info"
    const td = document.createElement('td');
    td.innerHTML = `
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded info-btn" data-id="${producto.id}">
        Info
      </button>
    `;
    const infoBtn = td.querySelector('.info-btn');
    infoBtn.addEventListener('click', () => infoProducto(producto.id));
    tr.appendChild(td);

    tablaProductos.appendChild(tr);

    // Agregar botón "Eliminar"
    const eliminarTd = document.createElement('td');

    // Agregar botón "Editar"
    const editarTd = document.createElement('td');
    editarTd.innerHTML = `
      <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded editar-btn" data-id="${producto.id}">
      Editar
      </button>
    `;
    const editarBtn = editarTd.querySelector('.editar-btn');
    editarBtn.addEventListener('click', () => {
      // Convertir las celdas en inputs editables
      if (tr.querySelector('input')) return; // Ya está en modo edición

      // Guardar valores originales
      const original = {
      tipo: producto.tipo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
      };

      // Reemplazar celdas por inputs
      tr.children[1].innerHTML = `<input type="text" value="${producto.tipo}" class="border px-1 py-0.5 w-full" />`;
      tr.children[2].innerHTML = `<input type="text" value="${producto.nombre}" class="border px-1 py-0.5 w-full" />`;
      tr.children[3].innerHTML = `<input type="text" value="${producto.descripcion}" class="border px-1 py-0.5 w-full" />`;
      tr.children[4].innerHTML = `<input type="number" step="0.01" value="${producto.precio}" class="border px-1 py-0.5 w-full" />`;
      tr.children[5].innerHTML = `<input type="number" value="${producto.stock}" class="border px-1 py-0.5 w-full" />`;

      // Cambiar botón Editar por Guardar y Cancelar
      editarTd.innerHTML = `
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded guardar-btn">Guardar</button>
      <button class="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded cancelar-btn">Cancelar</button>
      `;

      // Reasignar eventos después de reemplazar innerHTML
      const guardarBtn = editarTd.querySelector('.guardar-btn');
      const cancelarBtn = editarTd.querySelector('.cancelar-btn');

      guardarBtn.addEventListener('click', async () => {
        const nuevosValores = {
          tipo: tr.children[1].querySelector('input').value,
          nombre: tr.children[2].querySelector('input').value,
          descripcion: tr.children[3].querySelector('input').value,
          precio: parseFloat(tr.children[4].querySelector('input').value),
          stock: parseInt(tr.children[5].querySelector('input').value)
        };
        const { updateProduct } = await import('./productos-crud.mjs');
        await updateProduct(producto.id, nuevosValores);
        await renderProductos();
      });

      cancelarBtn.addEventListener('click', () => {
        // Restaurar valores originales
        tr.children[1].innerHTML = original.tipo;
        tr.children[2].innerHTML = original.nombre;
        tr.children[3].innerHTML = original.descripcion;
        tr.children[4].innerHTML = `$${original.precio.toFixed(2)}`;
        tr.children[5].innerHTML = original.stock;
        editarTd.innerHTML = `
          <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded editar-btn" data-id="${producto.id}">
          Editar
          </button>
        `;
        const newEditarBtn = editarTd.querySelector('.editar-btn');
        newEditarBtn.addEventListener('click', editarBtn.onclick);
      });
    });
    tr.appendChild(editarTd);
    eliminarTd.innerHTML = `
      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded eliminar-btn" data-id="${producto.id}">
        Eliminar
      </button>
    `;
    const eliminarBtn = eliminarTd.querySelector('.eliminar-btn');
    eliminarBtn.addEventListener('click', async () => {
      if (confirm('¿Seguro que deseas eliminar este producto?')) {
        const { deleteProduct } = await import('./productos-crud.mjs');
        await deleteProduct(producto.id);
        renderProductos();
      }
    });
    tr.appendChild(eliminarTd);
  });
};

const infoProducto = async (id) => {
  const producto = await getProductById(id);
  if (!producto) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]';

  modal.innerHTML = `
    <div class="flex flex-col justify-center bg-white rounded-lg shadow-lg max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Detalle del Producto</h2>
        <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
      </div>
      <ul class="space-y-2">
        <li><strong>ID:</strong> ${producto.id}</li>
        <li><strong>Tipo:</strong> ${producto.tipo}</li>
        <li><strong>Nombre:</strong> ${producto.nombre}</li>
        <li><strong>Descripción:</strong> ${producto.descripcion}</li>
        <li><strong>Precio:</strong> $${producto.precio.toFixed(2)}</li>
        <li><strong>Stock:</strong> ${producto.stock}</li>
      </ul>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('closeModalBtn').onclick = () => modal.remove();
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};

const nuevoProducto = () => {
  window.location.href = 'nuevo-producto.html';
};

const init = () => {
  renderProductos();

  if (nuevoProductoBtn) {
    nuevoProductoBtn.addEventListener('click', nuevoProducto);
  }

  if (nuevoProductoForm) {
    nuevoProductoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(nuevoProductoForm);
      const producto = Object.fromEntries(formData.entries());

      // Convertir campos numéricos si es necesario
      producto.precio = parseFloat(producto.precio);
      producto.stock = parseInt(producto.stock);

      await createProduct(producto);
      nuevoProductoForm.reset();
      window.location.href = 'listado-productos.html';
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
