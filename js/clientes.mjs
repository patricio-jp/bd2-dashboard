import {
    getAllClientes,
    getClienteById,
    createCliente,
    deleteCliente,
} from "./clientes-crud.mjs";

const tablaClientes = document.getElementById("bodyClientes");
const nuevoClienteBtn = document.getElementById("nuevoClienteBtn");
const nuevoClienteForm = document.getElementById("nuevoClienteForm");

const filterForm = document.getElementById("filter-form");

const renderClientes = async (filterTerm) => {
    const clientes = await getAllClientes();
    if (tablaClientes === null) {
        return;
    }
    tablaClientes.innerHTML = "";
    if (
        !Array.isArray(clientes) ||
        clientes.length === 0 ||
        typeof clientes[0] !== "object"
    ) {
        return;
    }

    let clientesFiltrados = clientes;

    if (filterTerm && filterTerm !== "") {
        clientesFiltrados = clientes.filter(
            (cliente) =>
                cliente.apellido.includes(filterTerm) ||
                cliente.nombre.includes(filterTerm) ||
                cliente.dni.toString().includes(filterTerm)
        );
    }

    clientesFiltrados.forEach((cliente) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="py-2 px-4">${cliente.id}</td>
            <td class="py-2 px-4">${cliente.dni}</td>
            <td class="py-2 px-4">${cliente.nombre}</td>
            <td class="py-2 px-4">${cliente.apellido}</td>
            <td class="py-2 px-4">${cliente.telefono}</td>
            <td class="py-2 px-4">${cliente.email}</td>
            <td class="py-2 px-4">${cliente.domicilio}</td>
            <td class="py-2 px-4">${cliente.localidad}</td>
            <td class="py-2 px-4">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded info-btn" data-id="${cliente.id}">
                  Info
              </button>
              <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded delete-btn" data-id="${cliente.id}">
            Borrar
              </button>
            </td>
        `;

        // Add event listener to the Info button
        const infoBtn = tr.querySelector(".info-btn");
        infoBtn.addEventListener("click", () => infoCliente(cliente.id));
        const deleteBtn = tr.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            if (confirm("¿Está seguro de que desea eliminar este cliente?")) {
                // Call the delete function here
                deleteCliente(cliente.id);
                alert(`Cliente ${cliente.id} eliminado`);
                renderClientes();
            }
        });
        tablaClientes.appendChild(tr);
    });
};

const infoCliente = async (id) => {
    const cliente = await getClienteById(id);
    if (!cliente) {
        return;
    }
    // Create modal container
    const modal = document.createElement("div");
    modal.className =
        "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

    // Modal content
    modal.innerHTML = `
    <div class="flex flex-col justify-center bg-white rounded-lg shadow-lg max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Detalle del Cliente</h2>
      <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
      </div>
      <ul class="space-y-2">
        <li><strong>ID:</strong> ${cliente.id}</li>
        <li><strong>DNI:</strong> ${cliente.dni}</li>
        <li><strong>Nombre:</strong> ${cliente.nombre}</li>
        <li><strong>Apellido:</strong> ${cliente.apellido}</li>
        <li><strong>Teléfono:</strong> ${cliente.telefono}</li>
        <li><strong>Email:</strong> ${cliente.email}</li>
        <li><strong>Dirección:</strong> ${cliente.domicilio}</li>
        <li><strong>Localidad:</strong> ${cliente.localidad}</li>
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
};

const nuevoCliente = () => {
    window.location.href = "nuevo-cliente.html";
};

const init = () => {
    renderClientes();
    if (nuevoClienteBtn !== null) {
        nuevoClienteBtn.addEventListener("click", nuevoCliente);
    }

    if (filterForm !== null) {
        filterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const filterValue = document.getElementById("search");
            if (filterValue) {
                renderClientes(filterValue.value || "");
            }
        });
    }

    if (nuevoClienteForm !== null) {
        nuevoClienteForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(nuevoClienteForm);
            const cliente = Object.fromEntries(formData.entries());
            console.log(cliente);
            await createCliente(cliente);
            nuevoClienteForm.reset();
            window.location.href = "listado-clientes.html";
        });
    }
};

document.addEventListener("DOMContentLoaded", init);
