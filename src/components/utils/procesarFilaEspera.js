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
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, runTransaction } from "firebase/firestore";
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
  try {
    await updateDoc(libroRef, {
      filaEspera: arrayUnion({ usuarioId, fechaSolicitud: new Date().toISOString() })
    });
    console.log("[agregarAFilaEspera] agregado", usuarioId, "a libro", libroId);
    return true;
  } catch (err) {
    console.error("[agregarAFilaEspera] error agregando a fila:", err);
    return false;
  }
};

/**
 * Procesa la fila de espera de un libro. Si hay stock, crea el préstamo y elimina al usuario de la fila.
 * @param {string} libroId
 * @param {object} opcionesOpcionales { showToast, userIdActual } para notificaciones y actualizar estado local
 */
export const procesarFilaEspera = async (libroId, opcionesOpcionales = {}) => {
  try {
    const { showToast, userIdActual, actualizarPrestamosLocal } = opcionesOpcionales;

    console.log("[procesarFilaEspera] inicio", libroId);

    const libroRef = doc(db, "books", libroId);

    const result = await runTransaction(db, async (transaction) => {
      const libroSnap = await transaction.get(libroRef);
      if (!libroSnap.exists()) {
        console.log("[procesarFilaEspera] libro no existe", libroId);
        return { processed: false, reason: "no-existe" };
      }

      const libroData = libroSnap.data();
      console.log("[procesarFilaEspera] libroData.disponibles", libroData.disponibles, "filaEsperaLen", (libroData.filaEspera || []).length);
      if (libroData.disponibles <= 0 || !libroData.filaEspera?.length) {
        return { processed: false, reason: "sin-stock-o-sin-fila" };
      }

      // Primer usuario FIFO
      const siguiente = libroData.filaEspera[0];
      console.log("[procesarFilaEspera] siguiente en fila:", siguiente);

      // Crear préstamo (doc con id generado)
      const nuevoPrestamoRef = doc(collection(db, "prestamos"));

      const fechaPrestamo = new Date();
      const fechaDevolucion = new Date();
      fechaDevolucion.setDate(fechaDevolucion.getDate() + 7);

      transaction.set(nuevoPrestamoRef, {
        libroId,
        usuarioId: siguiente.usuarioId,
        fechaPrestamo: fechaPrestamo.toISOString(),
        fechaDevolucion: fechaDevolucion.toISOString(),
        observaciones: "Préstamo automático desde fila de espera",
        multa: 0,
        estado: "activo"
      });

      // Actualizar stock y remover de la fila
      transaction.update(libroRef, {
        disponibles: (libroData.disponibles || 0) - 1,
        filaEspera: arrayRemove(siguiente)
      });

      // Actualizar prestamosActivos del usuario
      const userRef = doc(db, "users", siguiente.usuarioId);
      const userSnap = await transaction.get(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        transaction.update(userRef, {
          prestamosActivos: (userData.prestamosActivos || 0) + 1
        });
      } else {
        // Si no existe el usuario, crear el documento mínimo
        transaction.set(userRef, { prestamosActivos: 1 });
      }

      // Retornar info para fuera de la transacción
      return {
        processed: true,
        siguienteUsuarioId: siguiente.usuarioId,
        nuevoPrestamoId: nuevoPrestamoRef.id,
        libroTitulo: libroData.titulo
      };
    });

    if (result?.processed) {
      console.log("[procesarFilaEspera] préstamo creado para", result.siguienteUsuarioId, "prestamoId", result.nuevoPrestamoId);

      if (userIdActual === result.siguienteUsuarioId && actualizarPrestamosLocal) {
        actualizarPrestamosLocal({
          id: result.nuevoPrestamoId,
          libroId,
          libroTitulo: result.libroTitulo,
          fechaPrestamo: new Date().toISOString(),
          fechaDevolucion: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          observaciones: "Préstamo automático desde fila de espera"
        });

        if (showToast) showToast(`¡Ahora tienes disponible "${result.libroTitulo}"! 📚`);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error procesando fila de espera (transacción):", error);
    return false;
  }
};
