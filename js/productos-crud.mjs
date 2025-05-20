const apiUrl = 'http://localhost:5165/api/';

/**
 * 
 * @returns {Producto[]}
 */
export const getAllProducts = async () => {
    const response = await fetch(`${apiUrl}producto`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @returns {Producto}
 */
export const getProductById = async (id) => {
    const response = await fetch(`${apiUrl}producto/${id}`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {Producto} product 
 * @returns {Producto}
 */
export const createProduct = async (product) => {
    const response = await fetch(`${apiUrl}producto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @param {Producto} product 
 * @returns {Producto}
 */

export const updateProduct = async (id, product) => {
    const response = await fetch(`${apiUrl}producto`, {
        method: 'PUT', // Change to 'PATCH' if your API expects PATCH for updates
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, ...product })
    });
    let data = null;
    if (response.headers.get('content-length') !== '0' && response.headers.get('content-type')?.includes('application/json')) {
        data = await response.json();
    }
    return data;
}

/**
 * 
 * @param {number} id 
 * @returns {boolean}
 */
export const deleteProduct = async (id) => {
    const response = await fetch(`${apiUrl}producto/${id}`, {
        method: 'DELETE'
    });
    return response.ok;
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