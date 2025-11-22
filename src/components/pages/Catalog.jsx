import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { DoublyLinkedList } from "../doublyLinkedList"
import "../../App.scss";

export default function Catalog() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    const fetchBooks = async () => {
        const snap = await getDocs(collection(db, "books"));

        const list = new DoublyLinkedList();

        snap.docs.forEach(docSnap => {
            list.append({ id: docSnap.id, ...docSnap.data() });
        });

        setLibros(list);
        setLoading(false);
    };


    useEffect(() => {
        fetchBooks();
    }, []);

    const toggleFavorite = async (libroId) => {
        if (!user) return alert("Debes iniciar sesión");

        setSavingId(libroId);
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
        } catch (err) {
            console.error(err);
            alert("Error actualizando favoritos");
        }
        setSavingId(null);
    };

    if (loading) return <p>Cargando libros...</p>;

    return (
        <div className="catalogGridContainer">

            <header className="catalogHeader">
                <button className="catalogBackBtn" onClick={() => navigate("/")}>
                    ⬅ Volver
                </button>
                <h2 className="catalogH2">Catálogo de Libros</h2>
            </header>

            {libros.toArray().map(libro => {
                const isFavorite = user?.favoritos?.includes(libro.id);
                return (
                    <div key={libro.id} className="catalogLibroCard">

                        <div className="catalogPortada">{libro.portada}</div>

                        <h4 className="catalogTitulo">{libro.titulo}</h4>

                        <p className="catalogAutor">{libro.autor}</p>

                        <span className="catalogGenero">{libro.genero}</span>

                        <p className="catalogDisponibles">{libro.disponibles} disponibles</p>

                        {/* Botón favoritos */}
                        <button
                            onClick={() => toggleFavorite(libro.id)}
                            disabled={savingId === libro.id}
                            className={`catalogFavBtn ${isFavorite ? "catalogFavRemove" : "catalogFavAdd"}`}
                        >
                            {savingId === libro.id
                                ? "Guardando..."
                                : isFavorite
                                    ? "Quitar de favoritos"
                                    : "Agregar a favoritos"}
                        </button>

                        {/* Botón préstamo */}
                        <button
                            onClick={() => navigate("/prestamo", { state: { libroId: libro.id } })}
                            className="catalogPrestamoBtn"
                        >
                            Pedir préstamo
                        </button>
                    </div>
                );
            })}

        </div>
    );
}
