const apiUrl = 'http://localhost:5165/api/';

/**
 * 
 * @returns {Venta[]}
 */
export const getAllVentas = async () => {
    const response = await fetch(`${apiUrl}venta`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} idCliente 
 * @param {number} idProducto 
 * @returns {Venta[]}
 */
export const getVentaByClienteAndProducto = async (idCliente, idProducto) => {
    const response = await fetch(`${apiUrl}venta/venta-cliente-articulo?idCliente=${idCliente}&idArticulo=${idProducto}`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @returns {Venta}
 */
export const getVentaById = async (id) => {
    const response = await fetch(`${apiUrl}venta/${id}`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {Venta} venta 
 * @returns {Venta}
 */
export const createVenta = async (venta) => {
    const response = await fetch(`${apiUrl}venta`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @param {Venta} venta 
 * @returns {Venta}
 */
export const updateVenta = async (id, venta) => {
    const response = await fetch(`${apiUrl}venta/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @returns {boolean}
 */
export const deleteVenta = async (id) => {
    const response = await fetch(`${apiUrl}venta/${id}`, {
        method: 'DELETE'
    });
    return response.ok;
}
