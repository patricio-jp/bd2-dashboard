import { getAllVentas, getVentaById, createVenta } from "./ventas-crud.mjs";

const tablaVentas = document.getElementById("bodyVentas");
const nuevaVentaBtn = document.getElementById("nuevaVentaBtn");
const nuevaVentaForm = document.getElementById("nuevaVentaForm");

const renderVentas = async () => {
    const ventas = await getAllVentas();
    if (tablaVentas === null) {
        return;
    }
    tablaVentas.innerHTML = "";
    if (!Array.isArray(ventas) || ventas.length === 0 || typeof ventas[0] !== 'object') {
        return;
    }
    ventas.forEach((venta) => {
        const tr = document.createElement("tr");

        let stringProductos = "";
        if (venta.detalles.length > 0) {
            stringProductos = venta.detalles.map((producto) => {
                return `${producto.cantidad} x ${producto.producto.nombre}`;
            }).join("<br>");
        } else {
            stringProductos = "No hay productos";
        }

        // Format fecha as human readable (e.g., DD/MM/YYYY)
        const fechaObj = new Date(venta.fecha);
        const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        tr.innerHTML = `
            <td class="py-2 px-4">${venta.id}</td>
            <td class="py-2 px-4">${fechaFormateada}</td>
            <td class="py-2 px-4">${venta.cliente.apellido}, ${venta.cliente.nombre}</td>
            <td class="py-2 px-4">${Number(venta.total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
            <td class="py-2 px-4">${stringProductos}</td>
            <td class="py-2 px-4">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded info-btn" data-id="${venta.id}">
            Info
              </button>
            </td>
        `;

        // Add event listener to the Info button
        const infoBtn = tr.querySelector('.info-btn');
        infoBtn.addEventListener('click', () => infoVenta(venta.id));
        tablaVentas.appendChild(tr);
    });
}

const infoVenta = async (id) => {
    const venta = await getVentaById(id);
    if (!venta) {
        return;
    }

    let stringProductos = "";
    if (venta.detalles.length > 0) {
        stringProductos = venta.detalles.map((producto) => {
            return `${producto.cantidad} x ${producto.producto.nombre}`;
        }).join("<br>");
    } else {
        stringProductos = "No hay productos";
    }

    const fechaObj = new Date(venta.fecha);
    const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
        });

    // Create modal container
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

    // Modal content
    modal.innerHTML = `
    <div class="flex flex-col justify-center bg-white rounded-lg shadow-lg max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Detalle del Venta</h2>
        <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
      </div>
      <ul class="space-y-2">
        <li><strong>ID:</strong> ${venta.id}</li>
        <li><strong>Fecha:</strong> ${fechaFormateada}</li>
        <li><strong>Total:</strong> ${Number(venta.total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</li>
        <li><strong>Cliente:</strong> ${venta.cliente.apellido}, ${venta.cliente.nombre}</li>
        <li><strong>Productos:</strong> ${stringProductos}</li>
      </ul>
    </div>
    `;

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

const nuevaVenta = () => {
    window.location.href = "nueva-venta.html";
}

const init = () => {
    renderVentas();
    if (nuevaVentaBtn !== null) {
        nuevaVentaBtn.addEventListener("click", nuevaVenta);
    }

    if (nuevaVentaForm !== null) {
        nuevaVentaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(nuevaVentaForm);
            const venta = Object.fromEntries(formData.entries());
            //console.log(venta);
            await createVenta(venta);
            nuevaVentaForm.reset();
            //window.location.href = "listado-ventas.html";
        });
    }
}

document.addEventListener("DOMContentLoaded", init);
