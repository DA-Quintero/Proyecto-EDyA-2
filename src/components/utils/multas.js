// utils/multas.js

// $1500 por día atrasado
export const calcularMulta = (diasRestantes) => {
  if (diasRestantes >= 0) return 0;
  return Math.abs(diasRestantes) * 1500;
};
