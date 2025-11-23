import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { setUser } from "../../store/slices/authSlice";
import { logoutAuth } from "../../store/thunks/logoutAuth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faHeart, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons';

import {
  calcularEstadoDias,
  calcularDiasRestantes,
  calcularMulta,
  formatearFecha,
  formatearPesos,
} from "../utils";
import { procesarFilaEspera } from "../utils/procesarFilaEspera";

import "../../App.scss";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("informacion");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingFavId, setSavingFavId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState("");
  const [prestamosUsuario, setPrestamosUsuario] = useState([]);
  const [historialPrestamos, setHistorialPrestamos] = useState([]);
  const [favoritoLibros, setFavoritoLibros] = useState([]);

  const [form, setForm] = useState({
    email: "",
    telefono: "",
    direccion: "",
  });

  const [originalForm, setOriginalForm] = useState({
    email: "",
    telefono: "",
    direccion: "",
  });

  const [extra, setExtra] = useState({
    createdAt: null,
    prestamosActivos: 0,
    favoritos: 0,
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const toggleFavorite = async (libroId) => {
    if (!user) return;

    setSavingFavId(libroId);
    try {
      const userRef = doc(db, "users", user.uid);
      const favoritos = user.favoritos || [];
      let nuevosFavoritos;

      if (favoritos.includes(libroId)) {
        nuevosFavoritos = favoritos.filter(id => id !== libroId);
      } else {
        nuevosFavoritos = [...favoritos, libroId];
      }

      await updateDoc(userRef, { favoritos: nuevosFavoritos });
      dispatch(setUser({ ...user, favoritos: nuevosFavoritos }));
      
      // Actualizar la lista local de favoritos
      if (!favoritos.includes(libroId)) {
        setFavoritoLibros(prev => prev.filter(libro => libro.id !== libroId));
      }
      
      showToast(favoritos.includes(libroId) ? "Eliminado de favoritos" : "Agregado a favoritos");
    } catch (err) {
      console.error(err);
      showToast("Error actualizando favoritos ❌");
    }
    setSavingFavId(null);
  };

  // Procesar fila FIFO
  

  const devolverLibro = async (prestamoId, libroId) => {
  try {
    // Marcar préstamo como devuelto
    const prestamoRef = doc(db, "prestamos", prestamoId);
    await updateDoc(prestamoRef, { estado: "devuelto" });

    // Actualizar stock del libro
    const libroRef = doc(db, "books", libroId);
    const libroSnap = await getDoc(libroRef);
    const libroData = libroSnap.data();
    await updateDoc(libroRef, { disponibles: libroData.disponibles + 1 });

    // Actualizar prestamosActivos del usuario
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      prestamosActivos: Math.max((user.prestamosActivos || 1) - 1, 0)
    });

    // Actualizar estado local para que desaparezca de la lista
    setPrestamosUsuario(prev => prev.filter(p => p.id !== prestamoId));

    // Recargar historial de préstamos devueltos
    await cargarHistorial();

    // Procesar fila de espera automáticamente
    await procesarFilaEspera(libroId, {
  userIdActual: user.uid,
  showToast,
  actualizarPrestamosLocal: (nuevoPrestamo) =>
    setPrestamosUsuario(prev => [...prev, nuevoPrestamo])
});


    showToast("Libro devuelto correctamente ✔️");
  } catch (error) {
    console.error("Error devolviendo libro:", error);
    showToast("Error al devolver libro ❌");
  }
};

  // --- Carga datos usuario y prestamos ---
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          const formData = {
            email: data.email || "",
            telefono: data.telefono || "",
            direccion: data.direccion || "",
          };

          setForm(formData);
          setOriginalForm(formData);

          setExtra({
            createdAt: data.createdAt || null,
            prestamosActivos: data.prestamosActivos || 0,
            favoritos: Array.isArray(data.favoritos) ? data.favoritos.length : 0,
          });

          dispatch(setUser({ ...user, ...data }));
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }

      setLoading(false);
    };

    if (loading) {
      loadUserData();
    }
  }, [user?.uid, dispatch, loading]);

  useEffect(() => {
    const cargarPrestamos = async () => {
      if (!user) return;

      try {
        const q = query(
  collection(db, "prestamos"),
  where("usuarioId", "==", user.uid),
  where("estado", "==", "activo") // Filtra solo los préstamos activos
);


        const snap = await getDocs(q);

        const prestamosBase = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const prestamosConTitulo = await Promise.all(
          prestamosBase.map(async (p) => {
            try {
              const libroRef = doc(db, "books", p.libroId);
              const libroSnap = await getDoc(libroRef);

              return {
                ...p,
                libroTitulo: libroSnap.exists() ? libroSnap.data().titulo : "Título no encontrado",
              };
            } catch {
              return { ...p, libroTitulo: "Error cargando libro" };
            }
          })
        );

        setPrestamosUsuario(prestamosConTitulo);
      } catch (err) {
        console.error("Error cargando préstamos:", err);
      }
    };

    cargarPrestamos();
  }, [user]);

  const cargarHistorial = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "prestamos"),
        where("usuarioId", "==", user.uid),
        where("estado", "==", "devuelto")
      );

      const snap = await getDocs(q);

      const prestamosBase = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Ordenar por fecha de devolución manualmente (más reciente primero)
      const prestamosOrdenados = prestamosBase.sort((a, b) => {
        const fechaA = a.fechaDevolucion?.toDate?.() || new Date(a.fechaDevolucion);
        const fechaB = b.fechaDevolucion?.toDate?.() || new Date(b.fechaDevolucion);
        return fechaB - fechaA;
      });

      const prestamosConTitulo = await Promise.all(
        prestamosOrdenados.map(async (p) => {
          try {
            const libroRef = doc(db, "books", p.libroId);
            const libroSnap = await getDoc(libroRef);

            return {
              ...p,
              libroTitulo: libroSnap.exists() ? libroSnap.data().titulo : "Título no encontrado",
            };
          } catch {
            return { ...p, libroTitulo: "Error cargando libro" };
          }
        })
      );

      setHistorialPrestamos(prestamosConTitulo);
    } catch (err) {
      console.error("Error cargando historial:", err);
    }
  };

  useEffect(() => {
    cargarHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!user || !user.favoritos || user.favoritos.length === 0) {
        setFavoritoLibros([]);
        return;
      }

      try {
        const booksRef = collection(db, "books");
        const q = query(booksRef, where("__name__", "in", user.favoritos));
        const snap = await getDocs(q);

        const libros = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavoritoLibros(libros);
      } catch (err) {
        console.error("Error cargando libros favoritos:", err);
      }
    };

    cargarFavoritos();
  }, [user]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    setSaving(true);

    try {
      const ref = doc(db, "users", user.uid);

      await updateDoc(ref, {
        telefono: form.telefono,
        direccion: form.direccion,
      });

      dispatch(
        setUser({
          ...user,
          telefono: form.telefono,
          direccion: form.direccion,
        })
      );

      setOriginalForm({ ...form });
      showToast("Perfil actualizado ✔️");
      setEditMode(false);
    } catch (err) {
      console.error("Error guardando cambios:", err);
      showToast("Error al guardar ❌");
    }

    setSaving(false);
  };

  const cerrarSesion = async () => {
    try {
      await dispatch(logoutAuth());
      showToast("Sesión cerrada ✔️");
      navigate("/login");
    } catch (err) {
      console.error("Error cerrando sesión:", err);
      showToast("Error cerrando sesión ❌");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="profileContainer">
      {toast && <div className="toast">{toast}</div>}

      <header className="profileHeader">
        <button onClick={() => navigate("/")} className="profileBackBtn">
          ⬅ Volver
        </button>

        <h2 className="profileTitle">Mi perfil</h2>

        <button onClick={cerrarSesion} className="profileLogoutBtn">
          Cerrar sesión
        </button>
      </header>

      <div className="profileHeaderSpacer" />

      <div className="profileMainLayout">
        {/* Panel izquierdo - Tarjeta de perfil */}
        <div className="profileLeftCard">
          <div className="profileAvatarSection">
            <div className="profileAvatarWrapper">
              <img 
                src={user.photoURL || "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="profileAvatar"
              />
            </div>
            <h3 className="profileUserName">{user.displayName}</h3>
            <p className="profileMemberSince">
              Miembro desde {extra.createdAt ? formatearFecha(extra.createdAt) : "Enero 2020"}
            </p>
          </div>

          <div className="profileStatsSection">
            <div className="profileStatItem">
              <div className="profileStatNumber">{extra.prestamosActivos}</div>
              <div className="profileStatLabel">Préstamos activos</div>
            </div>
          </div>

          <div className="profileIdSection">
            <div className="profileIdHeader">
              <span className="profileIdLabel">ID en el Sistema</span>
              <button 
                className="profileCopyBtn"
                onClick={() => {
                  navigator.clipboard.writeText(user.uid);
                  showToast("ID copiado al portapapeles ✓");
                }}
                title="Copiar ID"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
            <div className="profileIdValue">{user.uid}</div>
          </div>
        </div>

        {/* Panel derecho - Contenido con tabs */}
        <div className="profileRightPanel">
          <nav className="profileTabsNav">
            {[
              { key: "informacion", label: "Información" },
              { key: "prestamos", label: "Préstamos" },
              { key: "historial", label: "Historial" },
              { key: "favoritos", label: "Favoritos" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`profileTabButton ${
                  activeTab === tab.key ? "profileTabActive" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="profileTabContent">
            {activeTab === "informacion" && (
              <div className="profileInfoBox">
                <div className="profileInfoHeader">
                  <h4>Información Personal</h4>
                  {!editMode ? (
                    <button className="profileEditBtn" onClick={() => setEditMode(true)}>
                      ✏️ Editar
                    </button>
                  ) : (
                    <button className="profileCancelBtn" onClick={() => {
                      setEditMode(false);
                      setForm({ ...originalForm });
                    }}>
                      ✕ Cancelar
                    </button>
                  )}
                </div>

                <div className="profileInfoField">
                  <label>Nombre Completo</label>
                  <div className="profileFieldIcon">
                    👤
                  </div>
                  <input type="text" disabled value={user.displayName || ""} />
                </div>

                <div className="profileInfoField">
                  <label>Correo electrónico</label>
                  <div className="profileFieldIcon">
                    ✉️
                  </div>
                  <input type="email" disabled value={form.email} />
                </div>

                <div className="profileInfoField">
                  <label>Teléfono</label>
                  <div className="profileFieldIcon">
                    📞
                  </div>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={onChange}
                    disabled={!editMode}
                    placeholder="+57 313 661 428"
                  />
                </div>

                <div className="profileInfoField">
                  <label>Dirección</label>
                  <div className="profileFieldIcon">
                    📍
                  </div>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={onChange}
                    disabled={!editMode}
                    placeholder="Calle 5 # 13 - 40"
                  />
                </div>

                {editMode && (
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="profileSaveBtn"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                )}
              </div>
            )}

            {activeTab === "prestamos" && (
              <div className="profileSectionBox">
                <h3>Préstamos activos</h3>

                {prestamosUsuario.length === 0 ? (
                  <p>No tienes préstamos activos.</p>
                ) : (
                  prestamosUsuario.map((p) => {
                    const dias = calcularDiasRestantes(p.fechaDevolucion);
                    const multa = calcularMulta(dias);

                    return (
                      <div key={p.id} className="profilePrestamoItem">
                        <p>
                          <strong>Libro:</strong> {p.libroTitulo}
                        </p>

                        <p>
                          <strong>Fecha préstamo:</strong>{" "}
                          {formatearFecha(p.fechaPrestamo)}
                        </p>

                        <p>
                          <strong>Fecha devolución:</strong>{" "}
                          {formatearFecha(p.fechaDevolucion)}{" "}
                          <span className="profileEstadoDias">
                            {calcularEstadoDias(p.fechaDevolucion)}
                          </span>
                        </p>

                        {dias < 0 && (
                          <p className="profileMultaBox">
                            <strong>Multa:</strong> {formatearPesos(multa)}
                          </p>
                        )}

                        <p>
                          <strong>Cédula:</strong> {p.cedula}
                        </p>
                        <p>
                          <strong>Teléfono:</strong> {p.telefono}
                        </p>

                        <button
                          className="profileDevolverBtn"
                          onClick={() => devolverLibro(p.id, p.libroId)}
                        >
                          Devolver
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === "historial" && (
              <div className="profileSectionBox">
                <h3>Historial de préstamos</h3>

                {historialPrestamos.length === 0 ? (
                  <p>No hay préstamos devueltos todavía.</p>
                ) : (
                  historialPrestamos.map((p) => (
                    <div key={p.id} className="profilePrestamoItem">
                      <p>
                        <strong>Libro:</strong> {p.libroTitulo}
                      </p>

                      <p>
                        <strong>Fecha préstamo:</strong>{" "}
                        {formatearFecha(p.fechaPrestamo)}
                      </p>

                      <p>
                        <strong>Fecha devolución:</strong>{" "}
                        {formatearFecha(p.fechaDevolucion)}
                      </p>

                      <p>
                        <strong>Estado:</strong> <span className="profileDevueltoTag">Devuelto ✓</span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "favoritos" && (
              <div className="profileSectionBox">
                <h3>Libros favoritos</h3>

                {favoritoLibros.length === 0 ? (
                  <p>No hay libros favoritos todavía.</p>
                ) : (
                  favoritoLibros.map((libro) => {
                    const isFavorite = user?.favoritos?.includes(libro.id);
                    return (
                      <div key={libro.id} className="profileFavItem">
                        <span style={{ fontSize: "2rem" }}>{libro.portada}</span>
                        <div className="profileFavInfo">
                          <h4>{libro.titulo}</h4>
                          <p>{libro.autor}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(libro.id)}
                          className={isFavorite ? "profileFavBtn profileFavBtnActive" : "profileFavBtn"}
                          disabled={savingFavId === libro.id}
                        >
                          {savingFavId === libro.id ? "..." : isFavorite ? <FontAwesomeIcon icon={faHeartCircleCheck} /> : <FontAwesomeIcon icon={faHeart} />}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
