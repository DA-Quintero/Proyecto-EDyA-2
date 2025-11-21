import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
    orderBy,
    getDocs,
    deleteDoc
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import styles from "./prestamo.module.scss";
import { procesarFilaEspera } from "../utils/procesarFilaEspera";
import { onSnapshot } from "firebase/firestore";


export default function Prestamo() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { state } = useLocation();
    const libroId = state?.libroId;

    const [prestamosUsuario, setPrestamosUsuario] = useState([]);
    const [form, setForm] = useState({ cedula: "", telefono: "", observaciones: "" });
    const [loading, setLoading] = useState(false);
    const [libro, setLibro] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [extra, setExtra] = useState({ prestamosActivos: 0 });
    const [toast, setToast] = useState("");

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2000);
    };
    useEffect(() => {
        if (!libroId || !user) return;

        const libroRef = doc(db, "books", libroId);

        const unsubscribe = onSnapshot(libroRef, (docSnap) => {
            if (!docSnap.exists()) return;
            const libroData = docSnap.data();

            // Si hay stock y usuario está en fila, procesar fila
            if (libroData.disponibles > 0) {
                procesarFilaEspera(libroId, user, setPrestamosUsuario, setExtra, showToast);
            }
        });

        return () => unsubscribe();
    }, [libroId, user]);


    if (!libroId) return <p>Error: No se encontró el libro seleccionado.</p>;

    useEffect(() => {
        const fetchLibro = async () => {
            const ref = doc(db, "books", libroId);
            const snap = await getDoc(ref);
            if (snap.exists()) setLibro({ id: snap.id, ...snap.data() });
        };
        fetchLibro();
    }, [libroId]);

    useEffect(() => {
        const cargarPrestamosUsuario = async () => {
            if (!user) return;
            const q = query(
                collection(db, "prestamos"),
                where("usuarioId", "==", user.uid),
                where("estado", "==", "activo")
            );
            const snap = await getDocs(q);
            setPrestamosUsuario(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        };
        cargarPrestamosUsuario();
    }, [user]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const yaPrestado = prestamosUsuario.some((p) => p.libroId === libro?.id);



    const enviarPrestamo = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) {
                setModalMessage("Debes iniciar sesión");
                setShowModal(true);
                navigate("/login");
                return;
            }

            const libroRef = doc(db, "books", libroId);
            const libroSnap = await getDoc(libroRef);
            if (!libroSnap.exists()) {
                setModalMessage("El libro no existe.");
                setShowModal(true);
                return;
            }

            const libroData = libroSnap.data();
            const fechaPrestamo = new Date();
            const fechaDevolucion = new Date();
            fechaDevolucion.setDate(fechaDevolucion.getDate() + 7);

            if (libroData.disponibles > 0) {
                await addDoc(collection(db, "prestamos"), {
                    libroId,
                    usuarioId: user.uid,
                    ...form,
                    fechaPrestamo: fechaPrestamo.toISOString(),
                    fechaDevolucion: fechaDevolucion.toISOString(),
                    multa: 0,
                    estado: "activo"
                });

                await updateDoc(libroRef, { disponibles: libroData.disponibles - 1 });
                await updateDoc(doc(db, "users", user.uid), {
                    prestamosActivos: (user.prestamosActivos || 0) + 1
                });

                setModalMessage("Préstamo registrado exitosamente 📚");
                setShowModal(true);
            } else {
                await addDoc(collection(db, "filaEspera"), {
                    libroId,
                    usuarioId: user.uid,
                    fechaSolicitud: new Date().toISOString()
                });
                setModalMessage("No hay stock, te agregamos a la fila de espera ⏳");
                setShowModal(true);
            }

            setTimeout(async () => {
                setShowModal(false);
                await procesarFilaEspera(libroId, user, setPrestamosUsuario, setExtra, showToast);
                navigate("/profile");
            }, 2000);
        } catch (error) {
            console.error("Error guardando préstamo:", error);
            setModalMessage("Hubo un error registrando el préstamo.");
            setShowModal(true);
        }

        setLoading(false);
    };

    return (
        <>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>
                        <h3>{modalMessage}</h3>
                        <button onClick={() => setShowModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                <header className={styles.header}>
                    <button className={styles.backBtn} onClick={() => navigate("/")}>⬅ Volver</button>
                </header>

                <h2 className={styles.title}>Registrar préstamo</h2>

                {libro && <p className={styles.bookName}><strong>Libro:</strong> {libro.titulo}</p>}

                <form className={styles.form} onSubmit={enviarPrestamo}>
                    <label>Cédula</label>
                    <input name="cedula" value={form.cedula} onChange={onChange} required />

                    <label>Teléfono</label>
                    <input name="telefono" value={form.telefono} onChange={onChange} required />

                    <label>Observaciones</label>
                    <textarea name="observaciones" value={form.observaciones} onChange={onChange} />

                    <button type="submit" className={yaPrestado ? styles.botonPrestado : styles.boton} disabled={yaPrestado || loading}>
                        {yaPrestado ? "Ya está en préstamo" : "Solicitar préstamo"}
                    </button>
                </form>
            </div>
        </>
    );
}
