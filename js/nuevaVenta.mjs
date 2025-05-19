import { getAllClientes } from "./clientes-crud.mjs";
import { getAllProducts } from "./productos-crud.mjs";
import { createVenta } from "./ventas-crud.mjs";

const clienteSelect = document.getElementById('cliente');
const productoSelect = document.getElementById('producto');
const cantidadInput = document.getElementById('cantidad');
const agregarBtn = document.getElementById('agregar-producto');
const detalleVenta = document.getElementById('detalle-venta');
const totalVenta = document.getElementById('total-venta');
const form = document.getElementById('nueva-venta-form');

let productos = [];
let detalle = [];

// Cargar clientes
getAllClientes().then(clientes => {
  clientes.forEach(cliente => {
    const option = document.createElement('option');
    option.value = cliente.id;
    option.textContent = cliente.nombre;
    clienteSelect.appendChild(option);
  });
});

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

function renderDetalle() {
  detalleVenta.innerHTML = '';
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
    detalleVenta.appendChild(tr);
  });
  totalVenta.textContent = `$${total.toFixed(2)}`;
}

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

detalleVenta.addEventListener('input', (e) => {
  if (e.target.classList.contains('cantidad-input')) {
    const idx = e.target.dataset.idx;
    let nuevaCantidad = parseInt(e.target.value, 10);
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    detalle[idx].cantidad = nuevaCantidad;
    renderDetalle();
  }
});

detalleVenta.addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminar-producto')) {
    const idx = e.target.dataset.idx;
    detalle.splice(idx, 1);
    renderDetalle();
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!clienteSelect.value || detalle.length === 0) {
    alert('Debe seleccionar un cliente y agregar al menos un producto.');
    return;
  }
  
  const formData = new FormData(form);
  const venta = {
    clienteId: Number(formData.get('cliente')),
    detalles: detalle.map(item => ({
      productoId: Number(item.productoId),
      cantidad: item.cantidad,
    })),
  };
  console.log('Venta a enviar:', venta);

  await createVenta(venta);
  form.reset();
  window.location.href = "listado-ventas.html";
});
