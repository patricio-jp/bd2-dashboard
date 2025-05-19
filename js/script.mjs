import { getAllVentas } from './ventas-crud.mjs';
import { getAllCompras } from './compras-crud.mjs';
import { getAllProducts } from './productos-crud.mjs';

const ventasUltimoMes = () => {
  const ventas = getAllVentas();
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

const comprasUltimoMes = () => {
  const compras = getAllCompras();
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

const totalVentasUltimoMes = () => {
  const ventas = ventasUltimoMes();
  return ventas.reduce((total, venta) => total + venta.total, 0);
}

const totalComprasUltimoMes = () => {
  const compras = comprasUltimoMes();
  return compras.reduce((total, compra) => total + compra.total, 0);
}

const totalStockProductos = () => {
  const productos = getAllProducts();
  if (!Array.isArray(productos) || productos.length === 0 || typeof productos[0] !== 'object') {
    return 0;
  }
  return productos.reduce((total, producto) => total + producto.stock, 0);
}

const totalVentasLabel = document.getElementById('totalVentas');
const totalComprasLabel = document.getElementById('totalCompras');
const totalStockLabel = document.getElementById('totalStock');

const updateDashboard = () => {
  totalVentasLabel.innerText = `$${totalVentasUltimoMes()}`;
  totalComprasLabel.innerText = `$${totalComprasUltimoMes()}`;
  totalStockLabel.innerText = `${totalStockProductos()}`;
}

const init = () => {
  updateDashboard();
}

document.addEventListener('DOMContentLoaded', init);
