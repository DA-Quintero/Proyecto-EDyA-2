// utils/format.js

// Formatea fecha a DD/MM/YYYY
export const formatearFecha = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString("es-ES");
};

// Formatea dinero (ej: 1.500 -> $1.500)
export const formatearPesos = (valor) => {
  return `$${valor.toLocaleString("es-CO")}`;
};
