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

import {
  calcularEstadoDias,
  calcularDiasRestantes,
  calcularMulta,
  formatearFecha,
  formatearPesos,
} from "../utils";

import "../toast.css";
import styles from "./Profile.module.scss";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("informacion");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [prestamosUsuario, setPrestamosUsuario] = useState([]);
  const [favoritoLibros, setFavoritoLibros] = useState([]);

  const [form, setForm] = useState({
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

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setForm({
            email: data.email || "",
            telefono: data.telefono || "",
            direccion: data.direccion || "",
          });

          setExtra({
            createdAt: data.createdAt || null,
            prestamosActivos: data.prestamosActivos || 0,
            favoritos: Array.isArray(data.favoritos)
              ? data.favoritos.length
              : 0,
          });

          dispatch(setUser({ ...user, ...data }));
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }

      setLoading(false);
    };

    loadUserData();
  }, [user, dispatch]);

  useEffect(() => {
    const cargarPrestamos = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "prestamos"),
          where("usuarioId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const prestamosBase = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const prestamosConTitulo = await Promise.all(
          prestamosBase.map(async (p) => {
            try {
              const libroRef = doc(db, "books", p.libroId);
              const libroSnap = await getDoc(libroRef);

              return {
                ...p,
                libroTitulo: libroSnap.exists()
                  ? libroSnap.data().titulo
                  : "Título no encontrado",
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

      showToast("Perfil actualizado ✔️");
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
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h3>{user.displayName}</h3>

        <p>
          Socio desde:{" "}
          <strong>{extra.createdAt ? formatearFecha(extra.createdAt) : "—"}</strong>
        </p>

        <p>
          Préstamos activos: <strong>{extra.prestamosActivos}</strong>
        </p>

        <p>
          Libros favoritos: <strong>{extra.favoritos}</strong>
        </p>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <header className={styles.header}>
        <button onClick={() => navigate("/")} className={styles.backBtn}>
          ⬅ Volver
        </button>

        <h2 className={styles.title}>Mi Perfil</h2>

        <button onClick={cerrarSesion} className={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </header>

      <div className={styles.headerSpacer} />

      <nav className={styles.navbar}>
        {["informacion", "prestamos", "historial", "favoritos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.navButton} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {activeTab === "informacion" && (
        <div className={styles.infoContent}>
          <div className={styles.formPanel}>
            <label>Email:</label>
            <input type="email" disabled value={form.email} />

            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={onChange}
            />

            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={onChange}
            />

            <button
              onClick={saveChanges}
              disabled={saving}
              className={styles.saveBtn}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "prestamos" && (
        <div className={styles.sectionBox}>
          <h3>Préstamos activos</h3>

          {prestamosUsuario.map((p) => {
            const dias = calcularDiasRestantes(p.fechaDevolucion);
            const multa = calcularMulta(dias);

            return (
              <div key={p.id} className={styles.prestamoItem}>
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
                  <span className={styles.estadoDias}>
                    {calcularEstadoDias(p.fechaDevolucion)}
                  </span>
                </p>

                {dias < 0 && (
                  <p className={styles.multaBox}>
                    <strong>Multa:</strong> {formatearPesos(multa)}
                  </p>
                )}

                <p>
                  <strong>Cédula:</strong> {p.cedula}
                </p>
                <p>
                  <strong>Teléfono:</strong> {p.telefono}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "favoritos" && (
        <div className={styles.sectionBox}>
          <h3>Libros favoritos</h3>

          {favoritoLibros.length === 0 ? (
            <p>No hay libros favoritos todavía.</p>
          ) : (
            favoritoLibros.map((libro) => (
              <div key={libro.id} className={styles.favItem}>
                <span style={{ fontSize: "2rem" }}>{libro.portada}</span>
                <div>
                  <h4>{libro.titulo}</h4>
                  <p>{libro.autor}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
