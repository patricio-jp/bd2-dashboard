const apiUrl = 'http://localhost:5165/api/';

/**
 * 
 * @returns {Compra[]}
 */
export const getAllCompras = async () => {
    const response = await fetch(`${apiUrl}compra`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @returns {Compra}
 */
export const getCompraById = async (id) => {
    const response = await fetch(`${apiUrl}compra/${id}`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {Compra} compra 
 * @returns {Compra}
 */
export const createCompra = async (compra) => {
    const response = await fetch(`${apiUrl}compra`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @param {Compra} compra 
 * @returns {Compra}
 */
export const updateCompra = async (id, compra) => {
    const response = await fetch(`${apiUrl}compra/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @returns {boolean}
 */
export const deleteCompra = async (id) => {
    const response = await fetch(`${apiUrl}compra/${id}`, {
        method: 'DELETE'
    });
    return response.ok;
}
