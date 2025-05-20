import { getAllCompras, getCompraById } from "./compras-crud.mjs";

const comprasTotalesLabel = document.getElementById("totalCompras");
const comprasDelMesLabel = document.getElementById("comprasDelMes");
const comprasDelDiaLabel = document.getElementById("comprasDelDia");

const recientesContainer = document.getElementById("comprasRecientes");

const renderLabels = async () => {
    const compras = await getAllCompras();
    if (!Array.isArray(compras) || compras.length === 0 || typeof compras[0] !== 'object') {
        return;
    }

    let comprasTotales = 0, comprasDelMes = 0, comprasDelDia = 0;

    compras.forEach((compra) => {
        const fechaCompra = new Date(compra.fecha);
        const hoy = new Date();
        comprasTotales += Number(compra.total);

        if (
            fechaCompra.getFullYear() === hoy.getFullYear() &&
            fechaCompra.getMonth() === hoy.getMonth()
        ) {
            comprasDelMes += Number(compra.total);
        }

        if (
            fechaCompra.getFullYear() === hoy.getFullYear() &&
            fechaCompra.getMonth() === hoy.getMonth() &&
            fechaCompra.getDate() === hoy.getDate()
        ) {
            comprasDelDia += Number(compra.total);
        }
    });

    if (comprasTotalesLabel) {
        comprasTotalesLabel.textContent = comprasTotales.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    }
    if (comprasDelMesLabel) {
        comprasDelMesLabel.textContent = comprasDelMes.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    }
    if (comprasDelDiaLabel) {
        comprasDelDiaLabel.textContent = comprasDelDia.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    }
}

const renderRecientes = async () => {
    const compras = await getAllCompras();
    if (!Array.isArray(compras) || compras.length === 0 || typeof compras[0] !== 'object') {
        return;
    }

    if (recientesContainer === null) { 
        return;
    }

    const recientes = compras.slice(-3).reverse();

    recientes.forEach((compra) => {
        const tr = document.createElement("tr");

        let stringArticulo = "";
        let stringCantidad = "";
        if (compra.detalles.length > 0) {
            stringArticulo = compra.detalles.map((producto) => {
                return `${producto.producto.nombre}`;
            }).join("<br>");

            stringCantidad = compra.detalles.map((producto) => {
                return `${producto.cantidad}`;
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
            <td class="py-2 px-4">${stringArticulo}</td>
            <td class="py-2 px-4">${stringCantidad}</td>
            <td class="py-2 px-4">${Number(compra.total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
        `;
        if (recientesContainer) recientesContainer.appendChild(tr);
    });
}

renderLabels();
renderRecientes();