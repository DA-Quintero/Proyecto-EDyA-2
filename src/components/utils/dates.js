export const calcularEstadoDias = (fechaISO) => {
  const hoy = new Date();
  const fecha = new Date(fechaISO);

  const diff = fecha - hoy;
  const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (dias > 0) return `Faltan ${dias} días`;
  if (dias === 0) return "Vence hoy";

  return `${Math.abs(dias)} días atrasado`;
};

// Devuelve solo el número de días (+, 0 o -)
export const calcularDiasRestantes = (fechaISO) => {
  const hoy = new Date();
  const fecha = new Date(fechaISO);
  return Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
};