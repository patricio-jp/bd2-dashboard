import { getAllCompras, getCompraById, deleteCompra } from "./compras-crud.mjs";

const tablaCompras = document.getElementById("bodyCompras");

const nuevaCompraBtn = document.getElementById("nuevaCompraBtn");

const nuevaCompra = () => {
    window.location.href = "nueva-compra.html";
}

nuevaCompraBtn.addEventListener("click", nuevaCompra);

const renderCompras = async () => {
    const compras = await getAllCompras();
    if (tablaCompras === null) {
        return;
    }
    tablaCompras.innerHTML = "";
    if (!Array.isArray(compras) || compras.length === 0 || typeof compras[0] !== 'object') {
        return;
    }
    compras.forEach((compra) => {
        const tr = document.createElement("tr");

        let stringProductos = "";
        if (compra.detalles.length > 0) {
            stringProductos = compra.detalles.map((producto) => {
                return `${producto.cantidad} x ${producto.producto.nombre}`;
            }).join("<br>");
        } else {
            stringProductos = "No hay productos";
        }

        // Format fecha as human readable (e.g., DD/MM/YYYY)
        const fechaObj = new Date(compra.fecha);
        const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        tr.innerHTML = `
            <td class="py-2 px-4">${compra.id}</td>
            <td class="py-2 px-4">${fechaFormateada}</td>
            <td class="py-2 px-4">${compra.proveedor}</td>
            <td class="py-2 px-4">${Number(compra.total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
            <td class="py-2 px-4">${stringProductos}</td>
            <td class="py-2 px-4">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded info-btn" data-id="${compra.id}">
            Info
              </button>
              <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded delete-btn" data-id="${compra.id}">
            Borrar
              </button>
            </td>
        `;

        // Add event listener to the Info button
        const infoBtn = tr.querySelector('.info-btn');
        infoBtn.addEventListener('click', () => infoCompra(compra.id));
        const deleteBtn = tr.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm("¿Está seguro de que desea eliminar esta compra?")) {
                // Call the delete function here
                deleteCompra(compra.id);
                alert(`Compra ${compra.id} eliminada`);
                renderCompras();
            }
        })
        tablaCompras.appendChild(tr);
    });
   // populateClientes(),
    //populateProductos();
}

const populateProductos = async () => {
    const productos = await getAllProducts();

    const select = document.getElementById("productoSelector");
    if (select === null) return;

    productos.forEach((prod) => {
        const option = document.createElement("option");
        option.value = prod.id;
        option.textContent = prod.nombre;
        select.appendChild(option);
    });
}

const infoCompra = async (id) => {
    const compra = await getCompraById(id);
    if (!compra) {
        return;
    }

    let stringProductos = "";
    if (compra.detalles.length > 0) {
        stringProductos = compra.detalles.map((producto) => {
            return `${producto.cantidad} x ${producto.producto.nombre}`;
        }).join("<br>");
    } else {
        stringProductos = "No hay productos";
    }

    const fechaObj = new Date(compra.fecha);
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
        <h2 class="text-xl font-semibold">Detalle de la Compra</h2>
        <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
      </div>
      <ul class="space-y-2">
        <li><strong>ID:</strong> ${compra.id}</li>
        <li><strong>Fecha:</strong> ${fechaFormateada}</li>
        <li><strong>Total:</strong> ${Number(compra.total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</li>
        <li><strong>Proveedor:</strong> ${compra.proveedor}</li>
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

renderCompras();