const apiUrl = 'http://localhost:5165/api/';

/**
 * 
 * @returns {Cliente[]}
 */
export const getAllClientes = async () => {
    const response = await fetch(`${apiUrl}cliente`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @returns {Cliente}
 */
export const getClienteById = async (id) => {
    const response = await fetch(`${apiUrl}cliente/${id}`);
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {Cliente} cliente 
 * @returns {Cliente}
 */
export const createCliente = async (cliente) => {
    const response = await fetch(`${apiUrl}cliente`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @param {Cliente} cliente 
 * @returns {Cliente}
 */
export const updateCliente = async (id, cliente) => {
    const response = await fetch(`${apiUrl}cliente/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {number} id 
 * @returns {boolean}
 */
export const deleteCliente = async (id) => {
    const response = await fetch(`${apiUrl}cliente/${id}`, {
        method: 'DELETE'
    });
    return response.ok;
}
