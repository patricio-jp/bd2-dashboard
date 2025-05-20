import { getAllProducts } from "./productos-crud.mjs";
import { createCompra } from "./compras-crud.mjs";

const productoSelect = document.getElementById('producto');
const cantidadInput = document.getElementById('cantidad');
const agregarBtn = document.getElementById('agregar-producto');
const detalleCompra = document.getElementById('detalle-compra');
const totalCompra = document.getElementById('total-compra');
const form = document.getElementById('form-compra');

// Lista de productos agregados
let productos = [];
let detalle = [];

// Cargar productos
getAllProducts().then(prodList => {
  productos = prodList;
  productos.forEach(producto => {
    const option = document.createElement('option');
    option.value = producto.id;
    option.textContent = producto.nombre;
    productoSelect.appendChild(option);
  });
});

productos.forEach(producto => {
    const option = document.createElement('option');
    option.value = producto.id;
    option.textContent = producto.nombre;
    productoSelect.appendChild(option);
});

// Mostrar detalle en la tabla
function renderDetalle() {
  detalleCompra.innerHTML = '';

  let total = 0;

  detalle.forEach((item, idx) => {

    const producto = productos.find(p => p.id == item.productoId);
    const subtotal = item.cantidad * producto.precio;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2 border-b">${producto.nombre}</td>
      <td class="px-4 py-2 border-b text-right">
        <input type="number" min="1" value="${item.cantidad}" data-idx="${idx}" class="w-16 border rounded px-1 py-1 cantidad-input">
      </td>
      <td class="px-4 py-2 border-b text-right">$${producto.precio.toFixed(2)}</td>
      <td class="px-4 py-2 border-b text-right">$${subtotal.toFixed(2)}</td>
      <td class="px-4 py-2 border-b text-center">
        <button type="button" data-idx="${idx}" class="text-red-600 eliminar-producto hover:underline">Eliminar</button>
      </td>
    `;
    detalleCompra.appendChild(tr);
  });

  totalCompra.textContent = `$${total.toFixed(2)}`;
}

// Agregar producto al detalle
agregarBtn.addEventListener('click', () => {
  const productoId = productoSelect.value;
  const cantidad = parseInt(cantidadInput.value, 10);
  if (!productoId || cantidad < 1) return;
  const existente = detalle.find(item => item.productoId == productoId);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    detalle.push({ productoId, cantidad });
  }
  renderDetalle();
});

detalleCompra.addEventListener('input', (e) => {
  if (e.target.classList.contains('cantidad-input')) {
    const idx = e.target.dataset.idx;
    let nuevaCantidad = parseInt(e.target.value, 10);
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    detalle[idx].cantidad = nuevaCantidad;
    renderDetalle();
  }
});

detalleCompra.addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminar-producto')) {
    const idx = e.target.dataset.idx;
    detalle.splice(idx, 1);
    renderDetalle();
  }
});

// Enviar formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const proveedorInput = document.getElementById('proveedor');
  const proveedor = proveedorInput.value.trim();

  if (!proveedor || detalle.length === 0) {
    alert('Debe ingresar un proveedor y al menos un producto.');
    return;
  }

  let compraTotal = 0;

  const detalles = detalle.map(item => {
    const producto = productos.find(p => p.id == item.productoId);
    const precioUnitario = producto.precio;
    const cantidad = item.cantidad;
    const precioTotal = cantidad * precioUnitario;

    compraTotal += precioTotal;

    return {
      productoId: Number(item.productoId),
      cantidad,
      precioUnitario,
      precioTotal
    };
  });

  const compra = {
    proveedor,
    total: compraTotal,
    detalles
  };

  console.log('Compra a enviar:', compra);

  try {
    await createCompra(compra);
    form.reset();
    window.location.href = "listado-compras.html";
  } catch (err) {
    console.error("Error al registrar la compra:", err);
    alert("Error al guardar la compra. Intente nuevamente.");
  }
});
