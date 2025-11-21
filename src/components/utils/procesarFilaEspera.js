import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";

/**
 * Agrega un usuario a la fila de espera de un libro.
 * @param {string} libroId
 * @param {string} usuarioId
 */
export const agregarAFilaEspera = async (libroId, usuarioId) => {
  const libroRef = doc(db, "books", libroId);
  const libroSnap = await getDoc(libroRef);
  if (!libroSnap.exists()) return;

  await updateDoc(libroRef, {
    filaEspera: arrayUnion({ usuarioId, fechaSolicitud: new Date().toISOString() })
  });
};

/**
 * Procesa la fila de espera de un libro. Si hay stock, crea el préstamo y elimina al usuario de la fila.
 * @param {string} libroId
 * @param {object} opcionesOpcionales { showToast, userIdActual } para notificaciones y actualizar estado local
 */
export const procesarFilaEspera = async (libroId, opcionesOpcionales = {}) => {
  try {
    const { showToast, userIdActual, actualizarPrestamosLocal } = opcionesOpcionales;

    const libroRef = doc(db, "books", libroId);
    const libroSnap = await getDoc(libroRef);
    if (!libroSnap.exists()) return;

    const libroData = libroSnap.data();
    if (libroData.disponibles <= 0 || !libroData.filaEspera?.length) return;

    // Primer usuario FIFO
    const siguiente = libroData.filaEspera[0];

    // Crear préstamo
    const fechaPrestamo = new Date();
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + 7);

    const nuevoPrestamoRef = await addDoc(collection(db, "prestamos"), {
      libroId,
      usuarioId: siguiente.usuarioId,
      fechaPrestamo: fechaPrestamo.toISOString(),
      fechaDevolucion: fechaDevolucion.toISOString(),
      observaciones: "Préstamo automático desde fila de espera",
      multa: 0,
      estado: "activo"
    });

    // Actualizar stock
    await updateDoc(libroRef, { 
      disponibles: libroData.disponibles - 1,
      filaEspera: arrayRemove(siguiente)
    });

    // Actualizar prestamosActivos del usuario
    const userRef = doc(db, "users", siguiente.usuarioId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      await updateDoc(userRef, {
        prestamosActivos: (userData.prestamosActivos || 0) + 1
      });
    }

    // Si es el usuario logueado, actualizar estado local
    if (userIdActual === siguiente.usuarioId && actualizarPrestamosLocal) {
      actualizarPrestamosLocal({
        id: nuevoPrestamoRef.id,
        libroId,
        libroTitulo: libroData.titulo,
        fechaPrestamo: fechaPrestamo.toISOString(),
        fechaDevolucion: fechaDevolucion.toISOString(),
        observaciones: "Préstamo automático desde fila de espera"
      });

      if (showToast) showToast(`¡Ahora tienes disponible "${libroData.titulo}"! 📚`);
    }

  } catch (error) {
    console.error("Error procesando fila de espera:", error);
  }
};
