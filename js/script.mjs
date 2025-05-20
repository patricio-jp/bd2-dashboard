import { getAllVentas } from './ventas-crud.mjs';
import { getAllCompras } from './compras-crud.mjs';
import { getAllProducts } from './productos-crud.mjs';

const ventasUltimoMes = async () => {
  const ventas = await getAllVentas();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (!Array.isArray(ventas) || ventas.length === 0 || typeof ventas[0] !== 'object') {
    return [];
  }
  return ventas.filter(venta => {
    const fecha = new Date(venta.fecha);
    return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
  });
}

const comprasUltimoMes = async () => {
  const compras = await getAllCompras();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (!Array.isArray(compras) || compras.length === 0 || typeof compras[0] !== 'object') {
    return [];
  }

  return compras.filter(compra => {
    const fecha = new Date(compra.fecha);
    return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
  });
}

const totalVentasUltimoMes = async () => {
  const ventas = await ventasUltimoMes();
  if (!Array.isArray(ventas) || ventas.length === 0 || typeof ventas[0] !== 'object') {
    return 0;
  }
  return ventas.reduce((total, venta) => total + venta.total, 0);
}

const totalComprasUltimoMes = async () => {
  const compras = await comprasUltimoMes();
  if (!Array.isArray(compras) || compras.length === 0 || typeof compras[0] !== 'object') {
    return 0;
  }
  return compras.reduce((total, compra) => total + compra.total, 0);
}

const totalStockProductos = async () => {
  const productos = await getAllProducts();
  if (!Array.isArray(productos) || productos.length === 0 || typeof productos[0] !== 'object') {
    return 0;
  }
  return productos.reduce((total, producto) => total + producto.stock, 0);
}

const totalVentasLabel = document.getElementById('totalVentas');
const totalComprasLabel = document.getElementById('totalCompras');
const totalStockLabel = document.getElementById('totalStock');

const updateDashboard = async () => {
  const totalVentas = Number(await totalVentasUltimoMes()).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  const totalCompras = Number(await totalComprasUltimoMes()).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  const totalStock = Number(await totalStockProductos()).toLocaleString('es-AR');
  totalVentasLabel.innerText = `${totalVentas}`;
  totalComprasLabel.innerText = `${totalCompras}`;
  totalStockLabel.innerText = `${totalStock} unidades`;
}

const init = () => {
  updateDashboard();
}

document.addEventListener('DOMContentLoaded', init);
