import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { DoublyLinkedList } from "../doublyLinkedList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faHeart, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons';
import "../../App.scss";

export default function Catalog() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas las categorías");
    const [selectedAvailability, setSelectedAvailability] = useState("Todos los libros");

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

    // Obtener géneros únicos de los libros
    const generosUnicos = [...new Set(libros.toArray().map(libro => libro.genero))].filter(Boolean);

    // Filtrar libros
    const librosFiltrados = libros.toArray().filter(libro => {
        // Filtro de búsqueda por título, autor o ISBN
        const matchSearch = searchTerm === "" || 
            libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (libro.isbn && libro.isbn.toLowerCase().includes(searchTerm.toLowerCase()));

        // Filtro por categoría/género
        const matchCategory = selectedCategory === "Todas las categorías" || 
            libro.genero === selectedCategory;

        // Filtro por disponibilidad
        const matchAvailability = selectedAvailability === "Todos los libros" ||
            (selectedAvailability === "Disponibles" && libro.disponibles > 0) ||
            (selectedAvailability === "Prestados" && libro.disponibles === 0);

        return matchSearch && matchCategory && matchAvailability;
    });

    return (
        <div className="catalogContainer">

            <header className="catalogHeader">
                <button className="catalogBackBtn" onClick={() => navigate("/")}>
                    ⬅ Volver
                </button>
                <div className="catalogHeaderTitle">
                    <FontAwesomeIcon icon={faBookOpen} className="catalogTitleIcon" />
                    <h2 className="catalogTitle">Catálogo Completo</h2>
                </div>
                <button className="catalogProfileBtn" onClick={() => navigate("/profile")}>
                    Cerrar sesión
                </button>
            </header>

            <div className="catalogFilterSection">
                <div className="catalogFilterContainer">
                    <h3 className="catalogFilterTitle">
                        Buscar y filtrar
                    </h3>
                    
                    <div className="catalogFilterGrid">
                    <div className="catalogFilterInput">
                        <input 
                            type="text" 
                            placeholder="Buscar por título, autor o ISBN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="catalogSearchInput"
                        />
                    </div>

                    <select 
                        className="catalogFilterSelect"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option>Todas las categorías</option>
                        {generosUnicos.map(genero => (
                            <option key={genero} value={genero}>{genero}</option>
                        ))}
                    </select>

                    <select 
                        className="catalogFilterSelect"
                        value={selectedAvailability}
                        onChange={(e) => setSelectedAvailability(e.target.value)}
                    >
                        <option>Todos los libros</option>
                        <option>Disponibles</option>
                        <option>Prestados</option>
                    </select>
                </div>
                </div>
            </div>

            <div className="catalogBooksCount">
                Mostrando {librosFiltrados.length} de {libros.toArray().length} libros
            </div>

            <div className="catalogGrid">
                {librosFiltrados.map(libro => {
                    const isFavorite = user?.favoritos?.includes(libro.id);
                    return (
                        <div key={libro.id} className="catalogBookCard">
                            <div className="catalogBookImage">
                                <div className="catalogBookEmoji">{libro.portada}</div>
                                {libro.disponibles > 0 ? (
                                    <span className="catalogBadgeAvailable">Disponible</span>
                                ) : (
                                    <span className="catalogBadgeUnavailable">Prestado</span>
                                )}
                            </div>

                            <div className="catalogBookInfo">
                                <h4 className="catalogBookTitle">{libro.titulo}</h4>
                                <p className="catalogBookAuthor">👤 {libro.autor}</p>
                                <p className="catalogBookGenre">Género: {libro.genero}</p>
                                <p className="catalogBookISBN">ISBN: {libro.isbn || "N/A"}</p>
                                <p className="catalogBookYear">Año: {libro.año || "N/A"}</p>
                            </div>

                            <div className="catalogBookActions">
                                <button
                                    onClick={() => toggleFavorite(libro.id)}
                                    className={isFavorite ? "catalogFavoriteBtn catalogFavoriteBtnActive" : "catalogFavoriteBtn"}
                                    disabled={savingId === libro.id}
                                >
                                    {savingId === libro.id ? "..." : isFavorite ? <FontAwesomeIcon icon={faHeartCircleCheck} /> : <FontAwesomeIcon icon={faHeart} />}
                                </button>
                                <button
                                    onClick={() => navigate("/prestamo", { state: { libroId: libro.id } })}
                                    className="catalogReserveBtn"
                                    disabled={libro.disponibles === 0}
                                >
                                    Reservar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
