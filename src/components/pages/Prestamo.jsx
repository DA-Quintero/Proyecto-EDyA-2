import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    updateDoc,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import "../../App.scss";
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
    useEffect(() => {
        if (!libroId || !user) return;

        const libroRef = doc(db, "books", libroId);

        const unsubscribe = onSnapshot(libroRef, (docSnap) => {
            if (!docSnap.exists()) return;
            const libroData = docSnap.data();

            // Si hay stock y usuario está en fila, procesar fila
            if (libroData.disponibles > 0) {
                procesarFilaEspera(libroId, {
                    userIdActual: user.uid
                });
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

    const onChange = (e) => {
        const { name, value } = e.target;
        
        // Validar cédula: solo números, máximo 10 dígitos
        if (name === "cedula") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 10) {
                setForm({ ...form, [name]: numericValue });
            }
            return;
        }
        
        // Validar teléfono: solo números, máximo 10 dígitos
        if (name === "telefono") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 10) {
                setForm({ ...form, [name]: numericValue });
            }
            return;
        }
        
        setForm({ ...form, [name]: value });
    };
    
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
                await procesarFilaEspera(libroId, {
                    userIdActual: user.uid
                });
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
                <div className="prestamoModalOverlay">
                    <div className="prestamoModalBox">
                        <h3>{modalMessage}</h3>
                        <button onClick={() => setShowModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            <div className="prestamoContainer">
                <header className="prestamoHeader">
                    <button className="prestamoBackBtn" onClick={() => navigate(-1)}>⬅ Volver</button>
                    <h2 className="prestamoTitle">Registrar préstamo</h2>
                </header>

                <div className="prestamoContent">
                    {libro && (
                        <div className="prestamoLibroCard">
                            <div className="prestamoLibroEmoji">{libro.portada}</div>
                            <div className="prestamoLibroInfo">
                                <h3>{libro.titulo}</h3>
                                <p>📖 {libro.autor}</p>
                                <p>📚 {libro.genero}</p>
                                <span className={libro.disponibles > 0 ? "prestamoLibroBadgeAvailable" : "prestamoLibroBadgeUnavailable"}>
                                    {libro.disponibles > 0 ? `${libro.disponibles} disponibles` : "Sin stock"}
                                </span>
                            </div>
                        </div>
                    )}

                    <form className="prestamoForm" onSubmit={enviarPrestamo}>
                        <div className="prestamoFormSection">
                            <h4>Datos del solicitante</h4>
                            
                            <div className="prestamoFormField">
                                <label>Cédula</label>
                                <input 
                                    name="cedula" 
                                    value={form.cedula} 
                                    onChange={onChange} 
                                    placeholder="Ej: 1234567890"
                                    maxLength="10"
                                    required 
                                />
                                <small>{form.cedula.length}/10 dígitos (mínimo 8)</small>
                            </div>

                            <div className="prestamoFormField">
                                <label>Teléfono</label>
                                <input 
                                    name="telefono" 
                                    value={form.telefono} 
                                    onChange={onChange}
                                    placeholder="Ej: 3001234567"
                                    maxLength="10"
                                    required 
                                />
                                <small>{form.telefono.length}/10 dígitos (requerido: 10)</small>
                            </div>

                            <div className="prestamoFormField">
                                <label>Observaciones (opcional)</label>
                                <textarea 
                                    name="observaciones" 
                                    value={form.observaciones} 
                                    onChange={onChange}
                                    placeholder="Comentarios adicionales..."
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="prestamoFormActions">
                            <button 
                                type="submit" 
                                className={yaPrestado ? "prestamoBotonPrestado" : "prestamoBoton"} 
                                disabled={yaPrestado || loading || form.cedula.length < 8 || form.telefono.length !== 10}
                            >
                                {loading ? "Procesando..." : yaPrestado ? "Ya tienes este libro prestado" : "Solicitar préstamo"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
